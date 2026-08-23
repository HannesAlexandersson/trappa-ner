import { useThemeStore } from "@/stores/themeStore";
import { useColorScheme as useSystemColorScheme } from "react-native";

export function useColorScheme() {
    const theme = useThemeStore((state) => state.theme);
    const systemTheme = useSystemColorScheme();

    if (theme === "light") {
        return "light";
    }

    if (theme === "dark") {
        return "dark";
    }

    return systemTheme ?? "light";
}