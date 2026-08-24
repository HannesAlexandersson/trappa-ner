import { Typography } from "@/components";
import ForumActionButton from "@/components/ui/ForumActionButton";
import i18n from "@/constants/dictonarys/i18n";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getForumThreads } from "@/services/forumService";
import { useForumStore } from "@/stores/forumStore";
import { useThemeStore } from "@/stores/themeStore";
import { ForumThread } from "@/utils/types";
import { formatDateTime } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, TouchableOpacity, View } from "react-native";

export default function ForumCategoryScreen() {
    const { categoryId, } = useLocalSearchParams<{ categoryId: string }>();

    const categories = useForumStore((state) => state.categories);
    const systemTheme = useColorScheme();
    const theme = useThemeStore((state) => state.theme);
    const activeTheme =
        theme === "system"
            ? systemTheme ?? "light"
            : theme;

    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const category = categories.find(
        (item) => item.id === categoryId
    );

    useEffect(() => {
        const loadThreads = async () => {
            if (!categoryId) return;

            try {
                const data = await getForumThreads(categoryId);
                setThreads(data);
            } catch (error) {
                console.error("Failed to load forum threads:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadThreads();
    }, [categoryId]);

    const handleGoBack = () => {
        router.navigate("/(tabs)/forum");
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator />
            </View>
        );
    }

    const handleNewThreadInCategory = () => {
        console.log("new thread in cat")
    }
    const handleSearchCategory = () => {
        console.log("search in cat")
    }

    return (
        <View className="flex-1 p-2">
            {/* NAVIGATION */}
            <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                    onPress={handleGoBack}
                    className="flex-row items-center ml-4 bg-vgrBlue dark:bg-white rounded-full"
                >
                    <Ionicons
                        name="arrow-back-circle-sharp"
                        size={40}
                        color={activeTheme == "dark" ? "#111827" : "#fff"}
                    />
                </TouchableOpacity>
                {category && (
                    <View className="flex-row gap-4 mr-4">
                        <ForumActionButton
                            icon="create-outline"
                            label={i18n.t("forum.newThreadInCategory")}
                            onPress={handleNewThreadInCategory}
                        />

                        <ForumActionButton
                            icon="search-outline"
                            label={i18n.t("forum.searchInCategorys")}
                            onPress={handleSearchCategory}
                        />
                    </View>
                )}
            </View>

            <View className="flex-1 p-6">
                {category && (
                    <Typography
                        size="h1"
                        weight="700"
                        className="text-vgrBlue dark:text-darkThemeText"
                    >
                        {i18n.t(`forum.categories.${category.slug}`)}
                    </Typography>
                )}

                {threads.map((thread) => (
                    category &&
                    <Pressable
                        key={thread.id}
                        onPress={() =>
                            router.push({
                                pathname: "/forum/thread/[threadId]",
                                params: {
                                    threadId: thread.id,
                                    categoryId: category.id,
                                }
                            })
                        }

                        className="border border-grey300 dark:border-darkThemeText rounded-lg p-5 mb-4"
                    >

                        <Typography size="lg" weight="600" className="dark:text-darkThemeText">
                            {thread.title}
                        </Typography>

                        <Typography size="sm" className="mt-2 dark:text-darkThemeText" >
                            {formatDateTime(thread.created_at)}
                        </Typography>
                        {/*  WE NEED TO ADD AUTHOR NAME ALSO!!!
                       
                       <Typography size="sm" className="mt-2 dark:text-darkThemeText" >
                            {formatDateTime(thread.author_name)}
                        </Typography> */}
                    </Pressable>
                ))}
            </View>
        </View>
    );
}