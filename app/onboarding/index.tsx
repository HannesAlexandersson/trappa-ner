import TreatmentPlanForm from "@/components/setup/TreatmentPlanForm";
import React from "react";
import { View } from "react-native";

export default function OnboardingScreen() {
  return (
    <View className="flex-1 bg-white p-6 justify-center">
      {/* We pass isNewUser={true} because this is the onboarding route */}
      <TreatmentPlanForm isNewUser={true} />
    </View>
  );
}
