import { Button, Typography } from "@/components";
import ForumActionButton from "@/components/ui/ForumActionButton";
import i18n from "@/constants/dictonarys/i18n";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/providers/authProviders";
import { createForumReply } from "@/services/forumService";
import { useForumStore } from "@/stores/forumStore";
import { useThemeStore } from "@/stores/themeStore";
import { formatDateTime } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";


export default function ForumThreadScreen() {
    const { threadId, categoryId, authorId } = useLocalSearchParams<{
        threadId: string;
        categoryId: string;
        authorId: string;
    }>();

    const { user } = useAuth();
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
    const [showReplyToThreadModal, setShowReplyToThreadModal] = useState<boolean>(false);
    const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
    // new thread states    
    const [newBody, setNewBody] = useState<string>("");


    useEffect(() => {
        if (!threadId) return;

        fetchThread(threadId);
        fetchReplies(threadId, 0);
    }, [threadId, fetchThread, fetchReplies, refreshComponent]);

    const handleGoBack = () => {
        router.replace({
            pathname: "/forum/[categoryId]",
            params: {
                categoryId,
            },
        });
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

    const searchThread = () => {
        console.log("Search")
    };

    const handleSaveReplyThread = async () => {
        if (!user) {
            throw new Error("No user id available!");

        }
        const body = newBody;

        try {
            const newThread = await createForumReply(threadId, user.id ?? "", body);
            if (newThread) {
                setShowReplyToThreadModal(false);
            } else {
                throw new Error("Error While saving to database");

            }
        } catch (error) {
            console.error(error);
        } finally {
            setNewBody("");
            setRefreshComponent(true);
        }
    }
    return (
        <ScrollView className="flex-1 px-6">
            <View className="flex-row items-center justify-between my-4 gap-3">
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
                <View className="flex-row justify-between gap-4 mr-4">
                    <ForumActionButton
                        icon="create-outline"
                        label={i18n.t("forum.replyToThread")}
                        onPress={() => setShowReplyToThreadModal(true)}
                    />

                    <ForumActionButton
                        icon="search-outline"
                        label={i18n.t("forum.searchThread")}
                        onPress={searchThread}
                    />
                </View>
            </View>

            <View className="flex-1 pt-6 pb-12 mb-12">
                {/* THREAD START */}

                <Typography
                    size="h1"
                    weight="700"
                    className="text-vgrBlue dark:text-darkThemeText"
                >
                    {thread.title} h
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
            <Modal
                visible={showReplyToThreadModal}
                transparent={true}
                animationType="fade"

                onRequestClose={() => setShowReplyToThreadModal(false)}
            >

                <TouchableOpacity
                    className="flex-1 bg-black/50 dark:bg-white/50 justify-center items-center p-6"
                    activeOpacity={1}
                    onPress={() => setShowReplyToThreadModal(false)}
                >

                    <View className="bg-white dark:bg-black rounded-3xl p-6 w-full flex flex-col items-center justify-between h-full">
                        <Typography weight="700" variant={activeTheme == "dark" ? "white" : "blue"} size="xl" className="mt-6 text-start">
                            {i18n.t("forum.replyToThreadActual")}
                        </Typography>
                        <View className="flex-1 flex-col items-center justify-center w-full h-full p-4">

                            <View className="flex flex-col items-start w-full">
                                <Typography weight="700" size="xl" variant={activeTheme == "dark" ? "white" : "blue"} className=" mb-4">
                                    {i18n.t("forum.newReplyToThreadBody")}
                                </Typography>
                                <TextInput
                                    placeholder={i18n.t("forum.newBody_placeholder")}
                                    className="dark:bg-white bg-slate-500 active:bg-slate500/50 rounded-lg p-4 mb-4 border-gray-300 w-full text-white"
                                    value={newBody}
                                    multiline
                                    style={{
                                        height: 400,
                                        textAlignVertical: "top",
                                    }}
                                    onChangeText={setNewBody}
                                    clearTextOnFocus
                                />
                            </View>
                            <Button
                                variant={activeTheme == "light" ? "blue" : "blue"}
                                size="lg"
                                className="rounded w-full"
                                onPress={handleSaveReplyThread}
                            >
                                <Typography
                                    variant={activeTheme == "light" ? "white" : "white"}
                                    size="md"
                                    weight="700"
                                    className="text-lg"
                                >
                                    {i18n.t("forum.replyToThread")}
                                </Typography>
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
}