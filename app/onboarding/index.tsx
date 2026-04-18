import TreatmentPlanForm from "@/components/setup/TreatmentPlanForm";
import React from "react";
import { View } from "react-native";

export default function OnboardingScreen() {
  return (
    <View className="flex-1 items-center justify-start bg-slate-100 ">
      {/* We pass isNewUser={true} because this is the onboarding route */}
      <TreatmentPlanForm isNewUser={true} />
    </View>
  );
}
