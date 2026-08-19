import { HomeCountdownTimer, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { useAuth } from "@/providers/authProviders";
import { fetchHomeCountdownData } from "@/services/treatmentPlanService";
import { useUserStore } from "@/stores";
import { HomeCountdownData } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  // Global states & contexts
  const { user } = useAuth();
  const { first_name } = useUserStore();
  // Local states
  const [countdownData, setCountdownData] = useState<HomeCountdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await fetchHomeCountdownData(user.id);
        setCountdownData(data);
      } catch (err: any) {
        console.error("Error loading home countdown:", err);
        setError(err.message || "Failed to load treatment plan data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.id]);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24 }}>
          {i18n.t("home.greeting", { name: first_name })}
        </Text>

      </View>
      {loading ? (
        <View className="p-8 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : error || !countdownData ? (
        <View className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <Typography className="text-red-600 text-center">
            {error || "No active plan found. Please complete onboarding."}
          </Typography>
        </View>
      ) : (
        <HomeCountdownTimer initialData={countdownData} />
      )}
    </ScrollView>
  );
}
