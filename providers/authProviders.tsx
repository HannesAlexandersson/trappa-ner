import { useUserStore } from "@/stores";
import { supabase } from "@/utils/supabase";
import { AuthContextType, User } from "@/utils/types";
import { useRouter } from "expo-router";
import React from "react";

// Create the AuthContext
export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);
// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// AuthProvider component that wraps the app and provides authentication state and functions
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  //global user states & functions from the zustand stores
  const {
    first_name,
    last_name,
    user_email,
    getUserData,
    updateUser,
    clearUser,
  } = useUserStore();

  //keep user logged in with supabase on/off state feature
  React.useEffect(() => {
    const { data: authData } = supabase.auth.onAuthStateChange(
      (event, session) => {
        //if there is no active user session return to sign in page
        if (!session) return router.push("/(auth)");
        //else call the getUser function with the session id
        getUser(session?.user.id);
      },
    );
    //clean up function  that terminates the subscription I.E the session
    return () => {
      authData?.subscription.unsubscribe();
    };
  }, []);

  //Get ALL user data
  const getUser = async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return console.error(error);

    const updatedUser: User = {
      ...data,
    };

    //set the user to the updated user in context
    setUser(updatedUser);
    // and in the zustand store
    updateUser({
      id: updatedUser.id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      user_email: updatedUser.email,
    });

    // THE GATEKEEPER LOGIC:
    if (data?.needs_setup) {
      router.replace("/onboarding");
    } else {
      router.replace("/(tabs)");
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) return console.error(error);
    getUser(data.user.id);
  };

  const signUp = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) => {
    const trimmedEmail = email.trim();
    const trimmedFirstname = firstname.trim();
    const trimmedLastname = lastname.trim();

    // 1. Create the Auth User
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: password,
    });

    if (error) {
      console.error("Signup Error:", error.message);
      return;
    }

    // 2. Create the Profile and RETURN the data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user?.id,
        first_name: trimmedFirstname,
        last_name: trimmedLastname,
        email: trimmedEmail,
      })
      .select() // get the row back
      .single(); // expecting a single row back

    if (profileError) {
      console.error("Profile Creation Error:", profileError.message);
      return;
    }

    // 3a. Update state
    setUser(profileData);
    // 3b. Set the Zustand store with the new user data
    updateUser({
      id: profileData.id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      user_email: profileData.email,
    });

    // Use replace instead of push for Auth flows
    router.replace("/onboarding");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return console.error(error);
    setUser(null);
    clearUser();
    router.push("/(auth)");
  };

  const editUser = async (
    id: string,
    firstname: string,
    lastname: string,
    email: string,
  ) => {
    //if no changes, dont update
    const updates: any = {};
    if (firstname !== first_name) updates.first_name = firstname;
    if (lastname !== last_name) updates.last_name = lastname;
    if (email !== user_email) updates.email = email;

    //only update the database if there are changes
    if (Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id);

      if (error) {
        console.error("Profile update error:", error);
        return;
      }
      //update the user in the global state
      updateUser(updates);
      console.log("User updated");
    } else {
      console.log("No changes detected, skipping update.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, signIn, signOut, signUp, editUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
