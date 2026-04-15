import { fetchUserDataFromProfilesTable } from "@/lib/apiHelper";
import { UserStore } from "@/utils/types";
import { create } from "zustand";

export const useUserStore = create<UserStore>((set) => ({
  id: null,
  first_name: "",
  last_name: "",
  user_email: "",

  updateUser: (updates) => set((state) => ({ ...state, ...updates })),
  getUserData: async (id: string) => {
    if (!id) return;

    const data = await fetchUserDataFromProfilesTable(id);

    set({
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      user_email: data.email,
    });
  },
  clearUser: () =>
    set({ id: null, first_name: "", last_name: "", user_email: "" }),
}));
