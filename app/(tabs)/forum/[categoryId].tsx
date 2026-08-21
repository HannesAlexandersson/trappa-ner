import { Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { getForumThreads } from "@/services/forumService";
import { useForumStore } from "@/stores/forumStore";
import { ForumThread } from "@/utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, TouchableOpacity, View } from "react-native";

export default function ForumCategoryScreen() {
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

    const categories = useForumStore((state) => state.categories);

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

    return (
        <View className="flex-1 p-2">
            {/* NAVIGATION */}
            <View className="flex-row justify-start mt-4">
                <TouchableOpacity
                    onPress={handleGoBack}
                    className="flex-row items-center ml-4 bg-vgrBlue rounded-full"
                >
                    <Ionicons
                        name="arrow-back-circle-sharp"
                        size={40}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            <View className="flex-1 p-6">
                {category && (
                    <Typography
                        size="h1"
                        weight="700"
                        className="text-vgrBlue"
                    >
                        {i18n.t(`forum.categories.${category.slug}`)}
                    </Typography>
                )}

                {threads.map((thread) => (
                    <Pressable
                        key={thread.id}
                        onPress={() =>
                            router.push({
                                pathname: "/forum/thread/[threadId]",
                                params: {
                                    threadId: thread.id,
                                },
                            })
                        }
                        className="border border-grey300 rounded-lg p-5 mb-4"
                    >
                        <Typography size="lg" weight="600">
                            {thread.title}
                        </Typography>

                        <Typography size="sm" className="mt-2">
                            {thread.created_at}
                        </Typography>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}