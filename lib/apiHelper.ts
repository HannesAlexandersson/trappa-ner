import { supabase } from "@/utils/supabase";

export const fetchUserDataFromProfilesTable = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const saveTreatmentPlanToDB = async (userId: string, formData: any) => {
  // 1. Insert into treatment_plans table
  const { error: planError } = await supabase
    .from("treatment_plans")
    .insert({
      user_id: userId,
      consumption_type: formData.consumptionType,
      start_units_per_day: formData.unitsPerDay,
      mg_nicotine_per_day: formData.mgNicotinePerDay,
      use_patch: formData.usePatch,
      patch_strength: formData.patchStrength,
      use_gum: formData.useGum,
      gum_strength: formData.gumStrength,
      is_active: true,
    });

  if (planError) throw planError;

  // 2. Update needs_setup in profiles table so onboarding is done
  const { data: updatedProfile, error: profileError } = await supabase
    .from("profiles")
    .update({ needs_setup: false })
    .eq("id", userId)
    .select()
    .single();

  if (profileError) throw profileError;

  return updatedProfile;
};

export const fetchUserAvatarFromAvatarBucket = async (avatarUrl: string) => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .download(avatarUrl);
  if (error) throw error;

  return data as Blob;
};

export const getFullUrl = async (path: string) => {
  const { data } = await supabase.storage.from("avatars").getPublicUrl(path);

  return data;
};

export const moveAvatarToPictures = async (oldAvatarUrl: string) => {
  if (!oldAvatarUrl) {
    console.error("Old avatar path is undefined or empty.");
    return;
  }

  const { data: moveData, error: moveError } = await supabase.storage
    .from("avatars")
    .move(oldAvatarUrl, `${oldAvatarUrl}`, {
      destinationBucket: "pictures",
    });

  if (moveError) {
    console.error("Failed to copy avatar:", moveError);
    return;
  }
};

export const calculateAge = (dateOfBirth: Date) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear();
  return age;
};
