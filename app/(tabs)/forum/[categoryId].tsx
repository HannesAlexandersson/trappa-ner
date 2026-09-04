import { Button, Typography } from "@/components";
import ForumActionButton from "@/components/ui/ForumActionButton";
import i18n from "@/constants/dictonarys/i18n";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createForumThread, getForumThreads } from "@/services/forumService";
import { useForumStore } from "@/stores/forumStore";
import { useThemeStore } from "@/stores/themeStore";
import { ForumThread } from "@/utils/types";
import { formatDateTime } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, TextInput, TouchableOpacity, View } from "react-native";

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
    const [showNewThreadModal, setShowNewThreadModal] = useState(false);
    // new thread states
    const [newTitle, setNewTitle] = useState<string>("");
    const [newBody, setNewBody] = useState<string>("");

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

    const handleSearchCategory = () => {
        console.log("search in cat")
    }
    const handleSaveNewThread = () => {
        const title = newTitle;
        const body = newBody;
        try {
            createForumThread(categoryId, title, body);
            setShowNewThreadModal(false);
        } catch (error) {
            console.log("Error while creating new thread");
        }
        finally {
            router.reload;
        }
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
                            onPress={() => setShowNewThreadModal(true)}
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
            <Modal
                visible={showNewThreadModal}
                transparent={true}
                animationType="fade"

                onRequestClose={() => setShowNewThreadModal(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/50 dark:bg-white/50 justify-center items-center p-6"
                    activeOpacity={1}
                    onPress={() => setShowNewThreadModal(false)}
                >
                    <View className="bg-white dark:bg-black rounded-3xl p-6 w-full flex flex-col items-center justify-between h-full">
                        <Typography weight="700" variant={activeTheme == "dark" ? "white" : "blue"} size="xl" className="mt-6 text-center">
                            {i18n.t("forum.createNewThread")}
                        </Typography>
                        <View className="flex-1 flex-col items-center justify-center w-full h-full p-4">
                            <View className="flex flex-col items-start w-full">
                                <Typography weight="700" variant={activeTheme == "dark" ? "white" : "blue"} className="text-2xl mb-4">
                                    {i18n.t("forum.newThreadTitle")}
                                </Typography>
                                <TextInput
                                    placeholder={i18n.t("forum.newTitle_placeholder")}
                                    className="dark:bg-white bg-slate-500  rounded-lg p-4 mb-4 border-gray-300 w-full text-white"
                                    value={newTitle}
                                    onChangeText={setNewTitle}
                                    autoFocus={true}
                                    clearTextOnFocus
                                />
                            </View>
                            <View className="flex flex-col items-start w-full">
                                <Typography weight="700" variant={activeTheme == "dark" ? "white" : "blue"} className="text-2xl mb-4">
                                    {i18n.t("forum.newThreadBody")}
                                </Typography>
                                <TextInput
                                    placeholder={i18n.t("forum.newBody_placeholder")}
                                    className="dark:bg-white bg-slate-500 active:bg-slate500/50 rounded-lg p-4 mb-4 border-gray-300 w-full text-white"
                                    value={newBody}
                                    multiline
                                    style={{
                                        height: 175,
                                        textAlignVertical: "top",
                                    }}
                                    onChangeText={setNewBody}
                                    clearTextOnFocus
                                />
                            </View>
                            <Button
                                variant={activeTheme == "light" ? "blue" : "blue"}
                                size="md"
                                className="rounded w-full"
                                onPress={handleSaveNewThread}
                            >
                                <Typography
                                    variant={activeTheme == "light" ? "white" : "white"}
                                    size="md"
                                    weight="700"
                                    className="text-lg"
                                >
                                    {i18n.t("forum.newThreadSave")}
                                </Typography>
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>

            </Modal>
        </View>
    );
}