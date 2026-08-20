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
    // 1. Fetch active plan
    const { data: plan, error: planError } = await supabase
        .from("treatment_plans")
        .select("id, start_date")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

    if (planError || !plan) throw new Error("No active treatment plan found");

    // 2. Fetch today's schedule
    const { data: scheduleDay, error: scheduleError } = await supabase
        .from("schedule_days")
        .select("target_pouches, interval_minutes, schedule_times")
        .eq("plan_id", plan.id)
        .eq("day_index", 0)
        .single();

    if (scheduleError || !scheduleDay) throw new Error("No schedule found for today");

    // 3. Fetch today's logs
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data: logs, error: logsError } = await supabase
        .from("dose_logs")
        .select("timestamp")
        .eq("user_id", userId)
        .gte("timestamp", startOfDay.toISOString())
        .order("timestamp", { ascending: true });

    if (logsError) throw logsError;

    const unitsTakenToday = logs ? logs.length : 0;
    const targetPouches = scheduleDay.target_pouches;
    const unitsRemainingToday = Math.max(0, targetPouches - unitsTakenToday);
    const intervalMinutes = scheduleDay.interval_minutes || 60;

    // CASE A: User has not taken Dose 1 yet -> Unlocked
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

    // CASE B: Daily limit reached -> Locked
    if (unitsRemainingToday <= 0) {
        return {
            targetPouches,
            intervalMinutes,
            scheduleTimes: scheduleDay.schedule_times || [],
            unitsTakenToday,
            unitsRemainingToday: 0,
            secondsRemaining: 86400, // Lock button until next day
            canTakeDoseNow: false,
            nextDoseFormattedTime: "Imorgon",
        };
    }

    // CASE C: Dose taken -> Calculate countdown to NEXT dose in schedule_times
    const scheduleTimes = scheduleDay.schedule_times || [];
    const nextDoseTimeStr = scheduleTimes[unitsTakenToday]; // Slot index for next dose

    let nextDoseTime: Date;

    if (nextDoseTimeStr) {
        const [hrs, mins] = nextDoseTimeStr.split(":").map(Number);
        nextDoseTime = new Date();
        nextDoseTime.setHours(hrs, mins, 0, 0);
    } else {
        // Fallback: Last Log + Interval Minutes
        const lastLogTime = new Date(logs[logs.length - 1].timestamp).getTime();
        nextDoseTime = new Date(lastLogTime + intervalMinutes * 60 * 1000);
    }

    const currentTime = new Date();
    const diffInSeconds = Math.ceil((nextDoseTime.getTime() - currentTime.getTime()) / 1000);
    const secondsRemaining = Math.max(0, diffInSeconds);

    const hoursStr = String(nextDoseTime.getHours()).padStart(2, "0");
    const minsStr = String(nextDoseTime.getMinutes()).padStart(2, "0");

    return {
        targetPouches,
        intervalMinutes,
        scheduleTimes,
        unitsTakenToday,
        unitsRemainingToday,
        secondsRemaining,
        canTakeDoseNow: secondsRemaining === 0,
        nextDoseFormattedTime: `${hoursStr}:${minsStr}`,
    };
};

export const logDoseTaken = async (
    userId: string,
    extraData?: { scheduled?: string | null; craving_level?: number | null }
): Promise<HomeCountdownData> => {
    const now = new Date();
    const nowIso = now.toISOString();

    // 1. Fetch active plan
    const { data: plan, error: planError } = await supabase
        .from("treatment_plans")
        .select("id")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

    if (planError || !plan) throw new Error("No active treatment plan found.");

    // 2. Check existing dose logs
    const { data: existingLogs } = await supabase
        .from("dose_logs")
        .select("id")
        .eq("user_id", userId);

    const doseCount = existingLogs ? existingLogs.length : 0;
    const isFirstDose = doseCount === 0;

    // 3. IF FIRST DOSE: Anchor plan and chain all subsequent dose times relative to the prior dose
    if (isFirstDose) {
        await supabase
            .from("treatment_plans")
            .update({ start_date: nowIso })
            .eq("id", plan.id);

        const { data: day0 } = await supabase
            .from("schedule_days")
            .select("id, target_pouches, interval_minutes")
            .eq("plan_id", plan.id)
            .eq("day_index", 0)
            .single();

        if (day0) {
            const targetCount = day0.target_pouches;
            const baseIntervalMins = day0.interval_minutes; // Planned interval between doses

            const updatedScheduleTimes: string[] = [];
            let currentDoseTime = new Date(now);

            // Dose 1 is exact time taken
            const hrs1 = String(currentDoseTime.getHours()).padStart(2, "0");
            const mins1 = String(currentDoseTime.getMinutes()).padStart(2, "0");
            updatedScheduleTimes.push(`${hrs1}:${mins1}`);

            // Chain Doses 2 through N: Previous Dose Time + Planned Interval
            for (let i = 1; i < targetCount; i++) {
                currentDoseTime = new Date(currentDoseTime.getTime() + baseIntervalMins * 60 * 1000);

                const hrs = String(currentDoseTime.getHours()).padStart(2, "0");
                const mins = String(currentDoseTime.getMinutes()).padStart(2, "0");
                updatedScheduleTimes.push(`${hrs}:${mins}`);
            }

            // Write chained array to schedule_days
            await supabase
                .from("schedule_days")
                .update({ schedule_times: updatedScheduleTimes })
                .eq("id", day0.id);
        }
    }

    // 4. Fetch the updated schedule array to set target scheduled timestamp
    const { data: currentSchedule } = await supabase
        .from("schedule_days")
        .select("schedule_times")
        .eq("plan_id", plan.id)
        .eq("day_index", 0)
        .single();

    let targetScheduledIso = nowIso;

    if (!isFirstDose && currentSchedule?.schedule_times?.[doseCount]) {
        const timeStr = currentSchedule.schedule_times[doseCount];
        const [hrs, mins] = timeStr.split(":").map(Number);
        const scheduledDate = new Date();
        scheduledDate.setHours(hrs, mins, 0, 0);
        targetScheduledIso = scheduledDate.toISOString();
    }

    // 5. Save the dose log
    const { error: logError } = await supabase.from("dose_logs").insert({
        user_id: userId,
        timestamp: nowIso,
        scheduled: targetScheduledIso,
        craving_level: extraData?.craving_level || null,
    });

    if (logError) throw new Error(`Failed to log dose: ${logError.message}`);

    return await fetchHomeCountdownData(userId);
};