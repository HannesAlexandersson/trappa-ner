import { Stack } from "expo-router";
import React from "react";
import "../global.css";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="forget"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}
