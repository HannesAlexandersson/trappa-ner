import Typography from "@/components/Typography";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeStore } from "@/stores/themeStore";
import { ForumActionButtonProps } from "@/utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";

const ForumActionButton = ({
    icon,
    label,
    onPress,
}: ForumActionButtonProps) => {
    const systemTheme = useColorScheme();
    const theme = useThemeStore((state) => state.theme);

    const activeTheme =
        theme === "system"
            ? systemTheme ?? "light"
            : theme;

    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center bg-vgrBlue dark:bg-white rounded-full px-4 py-2"
        >

            <Ionicons
                name={icon}
                size={22}
                color={activeTheme === "dark" ? "#111827" : "#fff"}
            />

            <Typography
                size="sm"
                weight="700"
                className="ml-2 text-white dark:text-gray-900 font-roboto"
            >
                {label}
            </Typography>
        </Pressable>

    );
};

export default ForumActionButton;