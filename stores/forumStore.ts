import { getForumCategories, getForumReplies, getForumThread, getForumThreads } from "@/services/forumService";
import { create } from "zustand";
import { ForumStore } from "./stores.types";


export const useForumStore = create<ForumStore>((set, get) => ({
    categories: [],
    threadsByCategory: {},
    threads: {},
    repliesByThread: {},

    categoriesLoaded: false,
    isLoadingCategories: false,

    fetchCategories: async () => {
        if (get().categoriesLoaded || get().isLoadingCategories) {
            return;
        }

        set({ isLoadingCategories: true });

        try {
            const data = await getForumCategories();

            const sortedCategories = [...data].sort((a, b) => {
                if (a.slug === "other") return 1;
                if (b.slug === "other") return -1;
                return 0;
            });

            set({
                categories: sortedCategories,
                categoriesLoaded: true,
            });
        } catch (error) {
            console.error("Failed to load forum categories:", error);
        } finally {
            set({ isLoadingCategories: false });
        }
    },

    fetchThreads: async (categoryId) => {
        try {
            const data = await getForumThreads(categoryId);

            set((state) => ({
                threadsByCategory: {
                    ...state.threadsByCategory,
                    [categoryId]: data.map((thread) => ({
                        id: thread.id,
                        category_id: thread.category_id,
                        author_id: thread.author_id,
                        title: thread.title,
                        created_at: thread.created_at,
                    })),
                },
            }));
        } catch (error) {
            console.error("Failed to load forum threads:", error);
        }
    },

    fetchThread: async (threadId) => {
        try {
            const data = await getForumThread(threadId);

            set((state) => ({
                threads: {
                    ...state.threads,
                    [threadId]: data,
                },
            }));
        } catch (error) {
            console.error("Failed to load forum thread:", error);
        }
    },

    fetchReplies: async (threadId) => {
        try {
            const data = await getForumReplies(threadId);

            set((state) => ({
                repliesByThread: {
                    ...state.repliesByThread,
                    [threadId]: data,
                },
            }));
        } catch (error) {
            console.error("Failed to load forum replies:", error);
        }
    },
}));