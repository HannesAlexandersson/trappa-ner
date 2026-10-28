import Typography from "@/components/Typography";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeStore } from "@/stores/themeStore";
import { ForumActionButtonProps } from "@/utils/types";
import { cn } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";

const ForumActionButton = ({
    icon,
    label,
    onPress,
    btnDisabled
}: ForumActionButtonProps) => {
    const systemTheme = useColorScheme();
    const theme = useThemeStore((state) => state.theme);

    const activeTheme =
        theme === "system"
            ? systemTheme ?? "light"
            : theme;


    return (
        <Pressable
            disabled={btnDisabled ? true : false}
            onPress={onPress}
            className={cn(btnDisabled ? "bg-gray-500 dark:bg-gray-400" : "bg-vgrBlue dark:bg-white", "flex-row items-center  rounded-full px-4 py-2 active:scale-75")}
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