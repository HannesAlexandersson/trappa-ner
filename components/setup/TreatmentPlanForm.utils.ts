import { OnboardingData } from "@/utils/types";

// Base reduction rate from slider (1 = 2%, 3 = 6%, 5 = 10%)
export const calculateReductionRate = (aggressiveness: number = 3): number => {
    return aggressiveness * 0.02;
};

// Calculates total days needed to reach < 1 unit/day
export const calculateTotalDays = (formData: OnboardingData): number => {
    let effectiveAggressiveness = formData.aggressiveness || 3;

    // Patches provide continuous nicotine, allowing a ~20% faster step-down
    if (formData.usePatch) {
        effectiveAggressiveness += 1;
    }

    // Gum provides craving relief on demand, boosting tolerance slightly
    if (formData.useGum) {
        effectiveAggressiveness += 0.5;
    }

    // Cap effective aggressiveness at 5 max
    effectiveAggressiveness = Math.min(effectiveAggressiveness, 5);

    const rate = calculateReductionRate(effectiveAggressiveness);
    let days = 0;
    let currentUnits = formData.unitsPerDay || 10;

    while (currentUnits > 0.8 && days < 365) {
        currentUnits -= currentUnits * rate;
        days++;
    }

    return Math.max(days, 7); // Minimum 1 week
};

// Summary helper for Step 4
export const calculatePlanSummary = (formData: OnboardingData) => {
    const totalDays = calculateTotalDays(formData);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + totalDays);

    return {
        totalDays,
        reductionRate: calculateReductionRate(formData.aggressiveness),
        startDate: new Date().toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
    };
};

// PREPARE PAYLOAD (Strictly matches OnboardingData interface)
export const prepareTreatmentPlanPayload = (
    formData: OnboardingData
): OnboardingData => {
    const summary = calculatePlanSummary(formData);

    return {
        ...formData,
        reductionRate: summary.reductionRate,
        startDate: summary.startDate,
        endDate: summary.endDate,
    };
};