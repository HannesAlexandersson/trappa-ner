import { ForumCategory, ForumReply, ForumThread, mediaDataProps, ThemeMode } from "@/utils/types";



export type ForumThreadSummary = {
    id: string;
    category_id: string;
    author_id: string;
    title: string;
    created_at: string;
};
export type ForumStore = {
    categories: ForumCategory[];
    threadsByCategory: Record<string, ForumThreadSummary[]>;
    threads: Record<string, ForumThread>;
    categoriesLoaded: boolean;
    isLoadingCategories: boolean;
    /*   repliesByThread: Record<string, ForumReply[]>;
   
  fetchThread: (threadId: string) => Promise<void>;
   fetchReplies: (threadId: string) => Promise<void>;  */

    fetchCategories: () => Promise<void>;
    fetchThreads: (categoryId: string) => Promise<void>;

    repliesByThread: Record<string, ForumReply[]>;
    replyPage: Record<string, number>;
    replyPageCount: Record<string, number>;

    fetchThread: (threadId: string) => Promise<void>;
    fetchReplies: (threadId: string, page: number) => Promise<void>;
};

export interface MediaStore {
    getPhotoForAvatar?: boolean;
    selectedMedia: string | null;
    selectedMediaFile: string | null;
    setSelectedMedia: (file: string | null) => void;
    setSelectedMediaFile: (file: string | null) => void;
    userMediaFiles: ({ file }: { file: string }) => string | null;
    mediaData: mediaDataProps;
    setMediaData: (newData: mediaDataProps) => void;
    handleSelect: (fileUrl: string) => void;
    setGetPhotoForAvatar: (value: boolean) => void;
}

export interface UserStore {
    id: string | null;
    first_name: string;
    last_name: string;
    user_email: string;
    getUserData: (id: string) => Promise<void>;
    updateUser: (updates: Partial<UserStore>) => void;
    clearUser: () => void;
}

export type ThemeStore = {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
};