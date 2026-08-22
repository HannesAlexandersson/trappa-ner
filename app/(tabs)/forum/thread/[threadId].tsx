import { Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useForumStore } from "@/stores/forumStore";
import { useThemeStore } from "@/stores/themeStore";
import { formatDateTime } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    View,
} from "react-native";


export default function ForumThreadScreen() {
    const { threadId } = useLocalSearchParams<{
        threadId: string;
    }>();

    const {
        threads,
        repliesByThread,
        replyPage,
        replyPageCount,
        fetchThread,
        fetchReplies,
    } = useForumStore();
    const systemTheme = useColorScheme();
    const theme = useThemeStore((state) => state.theme);
    const activeTheme =
        theme === "system"
            ? systemTheme ?? "light"
            : theme;

    const thread = threadId ? threads[threadId] : undefined;
    const replies = threadId ? repliesByThread[threadId] : undefined;
    const currentPage = threadId ? replyPage[threadId] ?? 0 : 0;
    const pageCount = threadId ? replyPageCount[threadId] ?? 0 : 0;

    useEffect(() => {
        if (!threadId) return;

        fetchThread(threadId);
        fetchReplies(threadId, 0);
    }, [threadId, fetchThread, fetchReplies]);

    const handleGoBack = () => {
        router.navigate("/(tabs)/forum");
    };

    const handlePreviousPage = () => {
        if (!threadId || currentPage <= 0) return;

        fetchReplies(threadId, currentPage - 1);
    };

    const handleNextPage = () => {
        if (!threadId || currentPage >= pageCount - 1) return;

        fetchReplies(threadId, currentPage + 1);
    };

    const handleLastPage = () => {
        if (!threadId || pageCount === 0) return;

        fetchReplies(threadId, pageCount - 1);
    };

    if (!thread || !replies) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 px-6">
            <View className="flex-row justify-start mt-4">
                <Pressable
                    onPress={handleGoBack}
                    className="bg-vgrBlue dark:bg-white rounded-full"
                >
                    <Ionicons
                        name="arrow-back-circle-sharp"
                        size={40}
                        color={activeTheme == "dark" ? "#111827" : "#fff"}
                    />
                </Pressable>
            </View>

            <View className="flex-1 pt-6 pb-12 mb-12">
                {/* THREAD START */}

                <Typography
                    size="h1"
                    weight="700"
                    className="text-vgrBlue dark:text-darkThemeText"
                >
                    {thread.title}
                </Typography>

                <Typography size="sm" className="mb-4 dark:text-darkThemeText">
                    {formatDateTime(thread.created_at)}
                </Typography>

                <View className="border border-grey300 dark:border-white rounded-lg p-5 mb-6">
                    <Typography size="md" className="dark:text-darkThemeText">
                        {thread.body}
                    </Typography>
                </View>

                {/* REPLIES */}

                <Typography
                    size="h2"
                    weight="700"
                    className="text-vgrBlue dark:text-darkThemeText"
                >
                    {i18n.t("forum.threads.replies")}
                </Typography>
                {/* TIMESTAMPS NEEDS BETTER FORMATTING */}
                {replies.map((reply) => (
                    <View
                        key={reply.id}
                        className="border border-grey300 dark:border-white rounded-lg p-4 mb-4"
                    >
                        <Typography size="sm" className="mb-2 dark:text-darkThemeText">
                            {formatDateTime(reply.created_at)}
                        </Typography>

                        <Typography size="md" className="dark:text-darkThemeText">
                            {reply.body}
                        </Typography>
                    </View>
                ))}

                {/* PAGINATION */}

                {pageCount > 1 && (
                    <View className="flex-row items-center justify-between mt-4">
                        <Pressable
                            onPress={handlePreviousPage}
                            disabled={currentPage === 0}
                            className="p-3"
                        >
                            <Typography
                                size="md"
                                variant={currentPage === 0 ? "black" : "blue"}
                            >
                                {i18n.t("utilities.previus")}
                            </Typography>
                        </Pressable>

                        <Typography size="md">
                            {currentPage + 1} / {pageCount}
                        </Typography>

                        <Pressable
                            onPress={handleNextPage}
                            disabled={currentPage >= pageCount - 1}
                            className="p-3"
                        >
                            <Typography
                                size="md"
                                variant={
                                    currentPage >= pageCount - 1 ? "black" : "blue"
                                }
                            >
                                {i18n.t("utilities.next")}
                            </Typography>
                        </Pressable>
                    </View>
                )}

                {pageCount > 1 && currentPage < pageCount - 1 && (
                    <Pressable
                        onPress={handleLastPage}
                        className="items-center mt-2"
                    >
                        <Typography size="md" variant="blue">
                            {i18n.t("forum.threads.lastReply")}
                        </Typography>
                    </Pressable>
                )}
            </View>
        </ScrollView>
    );
}