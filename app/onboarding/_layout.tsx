import i18n from "@/constants/dictonarys/i18n";
import { Stack } from "expo-router";
import React from "react";


export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                // Option 1: Hide it completely to build your own custom look inside the page
                // headerShown: false, 

                /* Option 2: If you WANT a header but want it to look good: */
                headerShown: true,
                headerTitle: i18n.t("onboarding.header1"),
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#005b89' },
                headerTintColor: '#ffffff'
            }}
        />
    );
}
