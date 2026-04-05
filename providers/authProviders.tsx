import { useUserStore } from "@/stores";
import { supabase } from "@/utils/supabase";
import { AuthContextType, User } from "@/utils/types";
import { useRouter } from "expo-router";
import React from "react";

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //states used as global states in the app
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  //global states from the zustand stores
  const {
    first_name,
    last_name,
    user_email,
    date_of_birth,
    description,
    selected_option,
    getUserData,
    updateUser,
  } = useUserStore();

  //keep user logged in with supabase on/off state feature
  React.useEffect(() => {
    const { data: authData } = supabase.auth.onAuthStateChange(
      (event, session) => {
        //if there is no active user session return to sign in page
        if (!session) return router.push("/(auth)/index");
        //else call the getUser function with the session id
        getUser(session?.user.id);
      },
    );
    //clean up function  that terminates the subscription I.E the user session
    return () => {
      authData?.subscription.unsubscribe();
    };
  }, []);

  //context functions
  const getUser = async (id: string) => {
    //get all the user data from the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return console.error(error);

    const updatedUser: User = {
      ...data,
    };

    //set the user to the updated user
    setUser(updatedUser);

    if (data?.first_time) {
      //redirect to the special onboarding route thats only getting renderd once the first time the user logs in
      router.push("/onboarding");
    } else {
      setUser(updatedUser);
      router.push("/(tabs)");
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) return console.error(error);
    getUser(data.user.id);
    getUserData(data.user.id);
  };

  const signUp = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) => {
    //trimming the input fields to remove any white spaces to avoid issues with supabases not accepting the emails
    const trimmedEmail = email.trim();
    const trimmedFirstname = firstname.trim();
    const trimmedLastname = lastname.trim();

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: password,
    });
    if (error) return console.error(error);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user?.id,
        user_id: data.user?.id,
        first_name: trimmedFirstname,
        last_name: trimmedLastname,
        email: trimmedEmail,
      });
    if (profileError) return console.error(profileError);

    //set the user object in the context and redirect to the homepage
    setUser(profileData);
    router.back();
    router.push("/(tabs)");
    //finally set the global user state
    if (data?.user) {
      getUser(data?.user?.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return console.error(error);
    setUser(null);
    router.push("/(auth)/index");
  };

  const editUser = async (
    id: string,
    firstname: string,
    lastname: string,
    email: string,
  ) => {
    //if there is no changes made to a property then dont update that property in the db
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
