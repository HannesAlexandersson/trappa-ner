import { OnboardingData } from "@/utils/types";

export const calculateReductionRate = (aggressiveness: number = 3): number => {
    return aggressiveness * 0.02;
};

export const prepareTreatmentPlanPayload = (
    formData: OnboardingData
): OnboardingData => {
    return {
        ...formData,
        reductionRate: calculateReductionRate(formData.aggressiveness),
        startDate: new Date().toISOString(),
    };
};