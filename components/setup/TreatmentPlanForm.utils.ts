import { supabase } from "@/utils/supabase";
import { OnboardingData } from "@/utils/types";

// Base reduction rate from slider (1 = 2%, 3 = 6%, 5 = 10%)
export const calculateReductionRate = (aggressiveness: number = 3): number => {
    return aggressiveness * 0.02;
};

// Calculates total days needed to reach < 0.8 units/day
export const calculateTotalDays = (formData: OnboardingData): number => {
    let effectiveAggressiveness = formData.aggressiveness || 3;

    if (formData.usePatch) {
        effectiveAggressiveness += 1;
    }

    if (formData.useGum) {
        effectiveAggressiveness += 0.5;
    }

    effectiveAggressiveness = Math.min(effectiveAggressiveness, 5);

    // Safeguard rate to ensure progress is always made
    const rate = Math.max(calculateReductionRate(effectiveAggressiveness), 0.01);
    let days = 0;
    let currentUnits = formData.unitsPerDay || 10;

    while (currentUnits > 0.8 && days < 365) {
        currentUnits -= currentUnits * rate;
        days++;
    }

    return Math.max(days, 7); // Minimum 1 week
};

// Helper: Calculate interval in minutes between doses
export const calculateIntervalMinutes = (awakeHours: number = 16, targetDoses: number = 10): number => {
    const totalAwakeMinutes = awakeHours * 60;
    return Math.round(totalAwakeMinutes / Math.max(1, targetDoses - 1));
};

// Helper: Generate dose schedule strings ["07:00", "08:45", ...]
export const generateScheduleTimes = (
    wakeUpTime: string = "07:00",
    awakeHours: number = 16,
    targetDoses: number = 10
): string[] => {
    const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);
    const intervalMinutes = calculateIntervalMinutes(awakeHours, targetDoses);
    const times: string[] = [];

    for (let i = 0; i < targetDoses; i++) {
        const doseDate = new Date();
        doseDate.setHours(wakeHour, wakeMinute + i * intervalMinutes, 0, 0);
        const hours = String(doseDate.getHours()).padStart(2, "0");
        const minutes = String(doseDate.getMinutes()).padStart(2, "0");
        times.push(`${hours}:${minutes}`);
    }

    return times;
};

// Summary helper: creates exact creation timestamp for startDate
export const calculatePlanSummary = (formData: OnboardingData) => {
    const totalDays = calculateTotalDays(formData);

    const now = new Date(); // Exact start timestamp RIGHT NOW
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + totalDays);

    return {
        totalDays,
        reductionRate: calculateReductionRate(formData.aggressiveness),
        startDate: now.toISOString(), // e.g. "2026-08-19T16:47:11.000Z"
        endDate: endDate.toISOString(),
    };
};

// PREPARE PAYLOAD (Matches OnboardingData interface)
export const prepareTreatmentPlanPayload = (
    formData: OnboardingData
): OnboardingData => {
    const summary = calculatePlanSummary(formData);

    return {
        ...formData,
        startDate: summary.startDate,
        endDate: summary.endDate,
    };
};

// DATABASE OPERATIONS

export const fetchUserDataFromProfilesTable = async (userId: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) throw error;
    return data;
};

export const updateUserProfile = async (userId: string, updates: Record<string, any>) => {
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// UTILITIES

export const calculateAge = (dateOfBirth: Date | string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const fetchUserAvatarFromAvatarBucket = async (avatarUrl: string) => {
    const { data, error } = await supabase.storage
        .from("avatars")
        .download(avatarUrl);

    if (error) throw error;
    return data as Blob;
};

export const getFullUrl = async (path: string) => {
    const { data } = await supabase.storage.from("avatars").getPublicUrl(path);
    return data;
};