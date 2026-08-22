import TreatmentPlanForm from "@/components/setup/TreatmentPlanForm";
import React from "react";
import { View } from "react-native";

export default function OnboardingScreen() {
  return (
    <View className="flex-1 w-full items-center justify-start ">
      <TreatmentPlanForm />
    </View>
  );
}
