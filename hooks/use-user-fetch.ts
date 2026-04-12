import { supabase } from "@/utils/supabase";
import { User } from "@/utils/types";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useUserFetch = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const getUser = async (id: string) => {
    try {
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (userError) throw userError;

      // Process user data
      if (userData.date_of_birth) {
        userData.date_of_birth = new Date(userData.date_of_birth);
      }

      // Handle first-time user
      if (userData.first_time) {
        router.push("/onboarding");
      } else {
        setUser(userData);
        router.push("/(tabs)/index");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return { user, getUser };
};
