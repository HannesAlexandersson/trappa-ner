import { calculateIntervalMinutes, calculateTotalDays, generateScheduleTimes } from "@/components/setup/TreatmentPlanForm.utils";
import { supabase } from "@/utils/supabase";
import { OnboardingData, UpdateUserProfile } from "@/utils/types";

export const fetchUserDataFromProfilesTable = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: UpdateUserProfile
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const saveMasterPlanToDB = async (
  userId: string,
  formData: OnboardingData & { reductionRate?: number; startDate?: string; endDate?: string }
) => {
  const now = new Date();
  const planPayload = {
    user_id: userId,
    consumption_type: formData.consumptionType,
    start_units_per_day: formData.unitsPerDay,
    mg_nicotine_per_day: formData.mgNicotinePerDay,
    wake_up_time: formData.wakeUpTime || "07:00",
    awake_hours: formData.awakeHours || 16,
    use_patch: formData.usePatch || false,
    patch_strength: formData.patchStrength || null,
    use_gum: formData.useGum || false,
    gum_strength: formData.gumStrength || null,
    reduction_rate: formData.reductionRate,
    start_date: formData.startDate || now.toISOString(),
    end_date: formData.endDate,
    is_active: true,
  };

  const { data, error } = await supabase
    .from("treatment_plans")
    .upsert(planPayload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw new Error(`treatment_plans save failed: ${error.message}`);
  return data;
};

export const saveUsageProfileToDB = async (
  userId: string,
  formData: OnboardingData
) => {
  const usageProfilePayload = {
    user_id: userId,
    product_type: formData.consumptionType || null,
    mg_per_pouch: formData.mgNicotinePerDay && formData.unitsPerDay
      ? Math.round(formData.mgNicotinePerDay / Math.max(1, formData.unitsPerDay))
      : null,
    pouches_per_day: formData.unitsPerDay || null,
    awake_hours: formData.awakeHours || 16,
  };

  const { data, error } = await supabase
    .from("usage_profiles")
    .insert(usageProfilePayload)
    .select()
    .single();

  if (error) throw new Error(`usage_profiles insert failed: ${error.message}`);
  return data;
};

/**
 * Generates and inserts all daily schedule rows tied to a specific planId.
 */
export const saveScheduleDaysToDB = async (
  planId: string,
  formData: OnboardingData & { reductionRate?: number }
) => {
  const totalDays = calculateTotalDays(formData);
  const scheduleRows = [];
  const rate = formData.reductionRate || 0.06;
  let currentUnits = formData.unitsPerDay || 10;

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const targetPouches = Math.max(1, Math.round(currentUnits));
    const intervalMinutes = calculateIntervalMinutes(formData.awakeHours, targetPouches);
    const scheduleTimes = generateScheduleTimes(formData.wakeUpTime, formData.awakeHours, targetPouches);

    scheduleRows.push({
      plan_id: planId, // Accepts planId directly
      day_index: dayIndex,
      target_pouches: targetPouches,
      interval_minutes: intervalMinutes,
      schedule_times: scheduleTimes,
      completed: false,
    });

    currentUnits = Math.max(0.8, currentUnits - currentUnits * rate);
  }

  const { error } = await supabase
    .from("schedule_days")
    .insert(scheduleRows);

  if (error) throw new Error(`schedule_days insert failed: ${error.message}`);
};

export const completeUserProfileSetup = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ needs_setup: false })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(`profile setup update failed: ${error.message}`);
  return data;
};

export const saveTreatmentPlanToDB = async (
  userId: string,
  formData: OnboardingData & { reductionRate?: number; startDate?: string; endDate?: string }
) => {
  // Step 1: Save Master Plan & get generated plan_id back
  const plan = await saveMasterPlanToDB(userId, formData);

  // Step 2: Save Usage Profile
  await saveUsageProfileToDB(userId, formData);

  // Step 3: Save Schedule Days using the plan.id from Step 1
  await saveScheduleDaysToDB(plan.id, formData);

  // Step 4: Mark onboarding setup complete
  const updatedProfile = await completeUserProfileSetup(userId);

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
