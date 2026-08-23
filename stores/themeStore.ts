import { create } from "zustand";
import { ThemeStore } from "./stores.types";



export const useThemeStore = create<ThemeStore>((set) => ({
    theme: "system",

    setTheme: (theme) => {
        set({ theme });
    },
}));