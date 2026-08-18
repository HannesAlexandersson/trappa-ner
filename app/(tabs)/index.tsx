import i18n from "@/constants/dictonarys/i18n";
import { useAuth } from "@/providers/authProviders";
import { useUserStore } from "@/stores";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  //Context
  const { user } = useAuth();
  const { first_name } = useUserStore();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>
        {i18n.t("home.greeting", { name: first_name })}
      </Text>
      {/*  <HomeCountdownTimer /> */}
    </View>
  );
}
