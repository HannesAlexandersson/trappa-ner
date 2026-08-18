import { supabase } from "@/utils/supabase";
import { HomeCountdownData, HomeCountdownState, PlanConfig } from "@/utils/types";

/**
 * Calculates dose target and intervals for day d (Handles Plateau Rule)
 */
export const calculateDailyTarget = (
    config: PlanConfig
): { Nd: number; IdMinutes: number; plateauDays: number } => {
    const { N0, r, T_awake, day, previousNd, plateauDays = 0 } = config;

    if (day === 0) {
        const Nd = N0;
        const IdMinutes = Math.round((T_awake * 60) / Nd);
        return { Nd, IdMinutes, plateauDays: 1 };
    }

    // Formula: Nd = floor(N0 * (1 - r)^d)
    let rawNd = Math.floor(N0 * Math.pow(1 - r, day));
    rawNd = Math.max(1, rawNd); // Floor at 1 dose minimum

    let currentPlateau = plateauDays;

    // Step 4: Plateau handling (force -1 if same count for > 2 days)
    if (previousNd !== undefined && rawNd === previousNd) {
        currentPlateau += 1;
        if (currentPlateau > 2) {
            rawNd = Math.max(1, previousNd - 1);
            currentPlateau = 1; // Reset plateau count after forced drop
        }
    } else {
        currentPlateau = 1;
    }

    const Nd = rawNd;
    // Step 5: Intervall per dag (Id = T_awake / Nd)
    const IdMinutes = Math.round((T_awake * 60) / Nd);

    return { Nd, IdMinutes, plateauDays: currentPlateau };
};

/**
 * Generates exact dose timestamps throughout waking hours,
 * protecting morning, lunch, and evening slots.
 */
export const generateDailyTimeSlots = (
    wakeTimeHour: number = 7, // Default 07:00 AM wake up
    T_awake: number = 16,
    Nd: number
): string[] => {
    // Edge Case Handling (Step 12: Fixed times when doses < 6)
    if (Nd < 6) {
        const fixedHours = [7, 12, 17, 21, 23].slice(0, Nd);
        return fixedHours.map((h) => `${String(h).padStart(2, "0")}:00`);
    }

    const awakeMinutes = T_awake * 60;
    const intervalMinutes = awakeMinutes / Nd;
    const timeSlots: number[] = [];

    // 1. Generate even time offsets from wake time in minutes
    for (let i = 0; i < Nd; i++) {
        timeSlots.push(wakeTimeHour * 60 + i * intervalMinutes);
    }

    // 2. Format as HH:mm strings
    return timeSlots.map((totalMinutes) => {
        const hrs = Math.floor(totalMinutes / 60) % 24;
        const mins = Math.floor(totalMinutes % 60);
        return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    });
};

/**
 * Derives current timer state from today's allowance and logged dose timestamps
 */
export const calculateCountdownState = (
    Nd: number,
    IdMinutes: number,
    todayLogs: { created_at: string }[] // Sorted ascending by timestamp
): HomeCountdownState => {
    const unitsTakenToday = todayLogs.length;
    const unitsRemainingToday = Math.max(0, Nd - unitsTakenToday);

    // If no doses taken today yet, user is allowed immediately
    if (unitsTakenToday === 0) {
        return {
            unitsTakenToday: 0,
            unitsAllowedToday: Nd,
            unitsRemainingToday: Nd,
            secondsRemaining: 0,
            canTakeDoseNow: true,
            nextDoseFormattedTime: null,
        };
    }

    // Get timestamp of the most recent dose
    const lastDoseTime = new Date(todayLogs[todayLogs.length - 1].created_at);
    const nextDoseTime = new Date(lastDoseTime.getTime() + IdMinutes * 60 * 1000);

    const now = new Date();
    const diffInSeconds = Math.floor((nextDoseTime.getTime() - now.getTime()) / 1000);
    const secondsRemaining = Math.max(0, diffInSeconds);

    const hours = nextDoseTime.getHours().toString().padStart(2, "0");
    const mins = nextDoseTime.getMinutes().toString().padStart(2, "0");

    return {
        unitsTakenToday,
        unitsAllowedToday: Nd,
        unitsRemainingToday,
        secondsRemaining,
        canTakeDoseNow: secondsRemaining === 0,
        nextDoseFormattedTime: `${hours}:${mins}`,
    };
};

/**
 * Fetches active plan, today's schedule day, and today's dose logs,
 * returning the exact stats needed for the home countdown clock.
 */
export const fetchHomeCountdownData = async (userId: string): Promise<HomeCountdownData> => {
    // 1. Fetch user's active treatment plan
    const { data: plan, error: planError } = await supabase
        .from("treatment_plans")
        .select("id, start_date")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

    if (planError || !plan) throw new Error("No active treatment plan found");

    // 2. Calculate day_index relative to start_date
    const startDate = plan.start_date ? new Date(plan.start_date) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 3. Fetch today's schedule row
    const { data: scheduleDay, error: scheduleError } = await supabase
        .from("schedule_days")
        .select("target_pouches, interval_minutes, schedule_times")
        .eq("plan_id", plan.id)
        .eq("day_index", dayIndex)
        .single();

    if (scheduleError || !scheduleDay) throw new Error("No schedule found for today");

    // 4. Fetch today's dose logs
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const { data: logs, error: logsError } = await supabase
        .from("dose_logs")
        .select("timestamp")
        .eq("user_id", userId)
        .gte("timestamp", startOfDay)
        .order("timestamp", { ascending: true });

    if (logsError) throw logsError;

    const unitsTakenToday = logs ? logs.length : 0;
    const targetPouches = scheduleDay.target_pouches;
    const unitsRemainingToday = Math.max(0, targetPouches - unitsTakenToday);
    const intervalMinutes = scheduleDay.interval_minutes;

    // 5. Calculate countdown timer values
    if (unitsTakenToday === 0) {
        return {
            targetPouches,
            intervalMinutes,
            scheduleTimes: scheduleDay.schedule_times || [],
            unitsTakenToday: 0,
            unitsRemainingToday: targetPouches,
            secondsRemaining: 0,
            canTakeDoseNow: true,
            nextDoseFormattedTime: null,
        };
    }

    const lastLogTimestamp = logs[logs.length - 1].timestamp;
    const lastDoseTime = new Date(lastLogTimestamp);
    const nextDoseTime = new Date(lastDoseTime.getTime() + intervalMinutes * 60 * 1000);

    const currentTime = new Date();
    const diffInSeconds = Math.floor((nextDoseTime.getTime() - currentTime.getTime()) / 1000);
    const secondsRemaining = Math.max(0, diffInSeconds);

    const hours = String(nextDoseTime.getHours()).padStart(2, "0");
    const mins = String(nextDoseTime.getMinutes()).padStart(2, "0");

    return {
        targetPouches,
        intervalMinutes,
        scheduleTimes: scheduleDay.schedule_times || [],
        unitsTakenToday,
        unitsRemainingToday,
        secondsRemaining,
        canTakeDoseNow: secondsRemaining === 0,
        nextDoseFormattedTime: `${hours}:${mins}`,
    };
};