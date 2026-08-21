import { supabase } from "@/utils/supabase";
import { ForumCategory, ForumReply, ForumThread } from "@/utils/types";

export const getForumCategories = async (): Promise<ForumCategory[]> => {
    const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("name");

    if (error) {
        throw error;
    }

    return data;
};

export const getForumThreads = async (
    categoryId: string
): Promise<ForumThread[]> => {
    const { data, error } = await supabase
        .from("forum_threads")
        .select("*")
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
};

export const createForumThread = async (
    categoryId: string,
    title: string,
    body: string
): Promise<ForumThread> => {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
        .from("forum_threads")
        .insert({
            category_id: categoryId,
            author_id: user.id,
            title,
            body,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const getForumThread = async (
    threadId: string
): Promise<ForumThread> => {
    const { data, error } = await supabase
        .from("forum_threads")
        .select("*")
        .eq("id", threadId)
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const getForumReplies = async (
    threadId: string
): Promise<ForumReply[]> => {
    const { data, error } = await supabase
        .from("forum_replies")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
};

export const createForumReply = async (
    threadId: string,
    authorId: string,
    body: string
): Promise<ForumReply> => {
    const { data, error } = await supabase
        .from("forum_replies")
        .insert({
            thread_id: threadId,
            author_id: authorId,
            body,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};