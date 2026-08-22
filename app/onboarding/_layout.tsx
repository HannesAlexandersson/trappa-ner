import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeStore } from "@/stores/themeStore";
import { Stack } from "expo-router";
import React from "react";


export default function OnboardingLayout() {
    const systemTheme = useColorScheme();
    const theme = useThemeStore((state) => state.theme);

    const activeTheme =
        theme === "system"
            ? systemTheme ?? "light"
            : theme;

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTitle: "",
                headerStyle: {
                    backgroundColor: Colors[activeTheme].headerBackground,
                    // WHENWE HAVE ADS USE THE DYNAMIC HEIGHT SYSTEM
                    // height: headerHeight,
                },
                headerShadowVisible: false,
                headerTintColor: '#ffffff',
            }}
        />
    );
}
