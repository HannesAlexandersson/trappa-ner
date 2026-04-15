import { useAuth } from "@/providers/authProviders";
import { useUserStore } from "@/stores";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { Button } from "react-native";
import { ThemedView } from "../Themed-view";
import Typography from "../Typography";
import { TreatmentPlanFormProps } from "./TreatmentPlanForm.types";

export default function TreatmentPlanForm({
  isNewUser,
}: TreatmentPlanFormProps) {
  const { user } = useAuth();
  const { updateUser } = useUserStore(); // Your Zustand store
  const router = useRouter();

  const handleSave = async (data: any) => {
    // 1. Save plan data to Supabase
    // 2. If isNewUser, also set needs_setup = false
    let userId = user?.id;
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    if (isNewUser) {
      await supabase
        .from("profiles")
        .update({ needs_setup: false })
        .eq("id", userId);
      router.replace("/(tabs)");
    } else {
      router.back(); // Just go back to Settings
    }
  };

  return (
    <ThemedView>
      <Typography>
        {isNewUser ? "Let's build your plan" : "Update your plan"}
      </Typography>
      {/* Form Inputs Here */}
      <Button onPress={handleSave} title="Save Plan" />
    </ThemedView>
  );
}
