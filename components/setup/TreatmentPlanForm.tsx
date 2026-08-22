import { Button, HelpModal, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { updateUserProfile } from "@/lib/apiHelper";
import { useAuth } from "@/providers/authProviders";
import { OnboardingData } from "@/utils/types";
import { timeOptions } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
/* import * as Notifications from "expo-notifications"; */
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeStore } from "@/stores/themeStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Switch,
  TouchableOpacity,
  View
} from "react-native";
import { calculatePlanSummary, prepareTreatmentPlanPayload } from "./TreatmentPlanForm.utils";

export default function TreatmentPlanForm() {
  // Global states & Contexts
  const router = useRouter();
  const { createTreatmentPlan, user } = useAuth();
  const systemTheme = useColorScheme();
  const theme = useThemeStore((state) => state.theme);

  const activeTheme =
    theme === "system"
      ? systemTheme ?? "light"
      : theme;

  // Local states
  const [step, setStep] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [helpKey, setHelpKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    consumptionType: "snus",
    mgNicotinePerDay: 20,
    unitsPerDay: 10,
    aggressiveness: 3,
    useExternalTools: false,
    // Patch & Gum specific state
    usePatch: false,
    patchStrength: 0,
    useGum: false,
    gumStrength: 0,
    // Legacy / fallback fields
    toolType: "none",
    toolStrength: "",
    // Algorithm fields
    awakeHours: 16,
    wakeUpTime: "07:00",
    reductionRate: 0.06,
    startDate: new Date().toISOString().split("T")[0],
  });

  // Methods & Handlers
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const openHelp = (key: string) => {
    setHelpKey(key);
    setShowHelp(true);
  };

  const handleFinalSave = async () => {
    setLoading(true);
    try {
      // 1. Request  permissions to send notifications
      /*   const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
  
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        } */

      // 2. Prepare payload (calculates reductionRate, startDate, endDate using your updated helper)
      const payload = prepareTreatmentPlanPayload(formData);

      // 3. Save to backend/database
      await createTreatmentPlan(payload);

      // 4. Redirect to main app flow
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to save treatment plan:", error);
      // TOAST ALERT TO USER!!!!!!!!!!
    } finally {
      setLoading(false);

    }
  };


  const handleTOSAcceptance = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        agred_tos: true,
        agreed_tos_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to update TOS agreement:", error);
      // trigger an alert/toast here ?? to let the user know something went wrong
    } finally {
      setLoading(false);
      setStep(step + 1);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-slate-800"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
      maximumZoomScale={3}
      minimumZoomScale={1}
      showsHorizontalScrollIndicator={false}
    >
      {/* STEP 1: INTRO */}
      {step === 1 && (
        <View className="p-4">
          <Typography className="text-[25px] text-center mb-3 text-black dark:text-white font-roboto" weight="700">
            {i18n.t("onboarding.step1Title")}
          </Typography>

          <Typography className="text-grey500 dark:text-grey200 mb-8" size="lg">
            {i18n.t("onboarding.step1Subtitle")}
          </Typography>

          <View className="bg-grey50 dark:bg-semiDarkBg rounded-3xl p-5 mb-6 border border-grey100">
            <Typography className="mb-4 leading-6 text-gray-700 dark:text-grey200">
              {i18n.t("onboarding.step1Info1")}
            </Typography>

            <Typography className="mb-4 leading-6 text-gray-700 dark:text-grey200">
              {i18n.t("onboarding.step1Info2")}
            </Typography>

            <Typography className="mb-4 leading-6 text-gray-700 dark:text-grey200">
              {i18n.t("onboarding.step1Info3")}
            </Typography>

            <Typography className="mb-4 leading-6 text-gray-700 dark:text-grey200">
              {i18n.t("onboarding.step1Info4")}
            </Typography>

            <Typography className="leading-6 text-gray-700 dark:text-grey200">
              {i18n.t("onboarding.step1Info5")}
            </Typography>
          </View>

          <View className="items-center mb-4">
            <Typography className="text-gray-400 dark:text-white">
              1 / 5 {i18n.t("onboarding.pages")}
            </Typography>
          </View>

          <View className="flex-row justify-center pb-8">
            <Button
              onPress={nextStep}
              variant="blue"
              className="w-full py-4 rounded-2xl"
            >
              <Typography variant="white" className="text-center" weight="700">
                {i18n.t("onboarding.nextBtn")}
              </Typography>
            </Button>
          </View>
        </View>
      )}

      {/* STEP 2: The Core Data */}
      {step === 2 && (
        <View className="flex-1 w-full px-4 py-4">
          <Typography
            className="font-roboto mb-4 w-full text-black dark:text-white"
            weight="700"
            size="xl"
          >
            {i18n.t("onboarding.step2Title")}
          </Typography>

          <Typography
            weight="300"
            size="lg"
            className="mb-6 w-full text-black dark:text-white"
          >
            {i18n.t("onboarding.step2Subtitle")}
          </Typography>

          {/* TOGGLE BUTTONS */}
          <View className="flex-row justify-around w-full mb-6 gap-2">
            <Button
              variant={activeTheme == "dark" ? formData.consumptionType === "smoker" ? "darkThemedSelected" : "darkThemedUnselected" : formData.consumptionType === "smoker" ? "blue" : "white"}
              onPress={() =>
                setFormData({ ...formData, consumptionType: "smoker" })
              }
            >
              <Typography
                className={activeTheme == "dark" ? formData.consumptionType === "smoker" ? "text-darkTextSecondary" : "text-white"
                  : formData.consumptionType === "smoker" ? "text-white" : "text-darkTextSecondary"
                }
              >
                {i18n.t("onboarding.cig")}
              </Typography>
            </Button>
            <Button
              variant={activeTheme == "dark" ? formData.consumptionType === "snus" ? "darkThemedSelected" : "darkThemedUnselected" : formData.consumptionType === "snus" ? "blue" : "white"}
              onPress={() =>
                setFormData({ ...formData, consumptionType: "snus" })
              }
            >
              <Typography
                className={activeTheme == "dark" ? formData.consumptionType === "snus" ? "text-darkTextSecondary" : "text-white"
                  : formData.consumptionType === "snus" ? "text-white" : "text-darkTextSecondary"
                }
              >
                {i18n.t("onboarding.snus")}
              </Typography>
            </Button>
          </View>

          {/* MG NICOTINE SLIDER - DATA CENTERED */}
          <View className="mb-8 bg-vgrBlue dark:bg-semiDarkBg p-6 rounded-3xl border border-grey100 w-full">
            {/* Header Row Fixed */}
            <View className="flex-row items-center justify-center mb-4 w-full px-2">
              <Typography
                size="sm"
                className="text-grey200 text-center mb-2 uppercase tracking-widest flex-shrink"
              >
                {i18n.t("onboarding.step2mgNicotinePerDay")}
              </Typography>
              {/* TOOLTIP ICON */}
              <TouchableOpacity onPress={() => openHelp("nicotineHelp")}>
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* THIS IS THE REAL-TIME DATA FEEDBACK */}
            <View className="items-center justify-center mb-4 w-full">
              <Typography variant="white" weight="700" className="text-5xl">
                {formData.mgNicotinePerDay >= 100
                  ? "100+"
                  : formData.mgNicotinePerDay}
              </Typography>
              <Typography variant="white" weight="400" size="lg">
                mg / {i18n.t("onboarding.day")}
              </Typography>
            </View>
            <View className="w-full">
              <Slider
                /* style={{ width: "100%", height: 50 }} */
                className="w-full h-14"
                minimumValue={5}
                maximumValue={100}
                step={1}
                value={formData.mgNicotinePerDay}
                minimumTrackTintColor="#FFF"
                maximumTrackTintColor="#FFF"
                thumbTintColor="#FFF"
                onValueChange={(val) =>
                  setFormData({ ...formData, mgNicotinePerDay: val })
                }
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Typography size="sm" className="text-gray-400 dark:text-white">
                5 mg ({i18n.t("onboarding.or less")})
              </Typography>
              <Typography size="sm" className="text-gray-400 dark:text-white">
                100+ mg
              </Typography>
            </View>
          </View>

          {/* UNITS PER DAY STEPPER */}
          <View className="mb-10">
            <Typography
              className="mb-4 text-center text-black dark:text-white"
              size="lg"
              weight="400"
            >
              {i18n.t("onboarding.step2unitsPerDay")}
            </Typography>
            <View className="flex-row items-center justify-between bg-grey100 dark:bg-darkBorder p-2 rounded-xl">
              <Button
                variant={activeTheme == "dark" ? "darkThemedUnselected" : "white"}
                className="w-12 h-12 rounded-lg"
                onPress={() =>
                  setFormData({
                    ...formData,
                    unitsPerDay: Math.max(1, formData.unitsPerDay - 1),
                  })
                }
              >
                <Typography className="text-2xl text-black dark:text-white">-</Typography>
              </Button>

              <Typography weight="700" className="text-xl text-black dark:text-white">
                {formData.unitsPerDay >= 50 ? "50+" : formData.unitsPerDay}{" "}
                {formData.consumptionType === "snus"
                  ? i18n.t("onboarding.snus")
                  : i18n.t("onboarding.cig")}
              </Typography>

              <Button
                variant={activeTheme == "dark" ? "darkThemedUnselected" : "white"}
                className="w-12 h-12 rounded-lg"
                onPress={() =>
                  setFormData({
                    ...formData,
                    unitsPerDay: Math.min(50, formData.unitsPerDay + 1),
                  })
                }
              >
                <Typography className="text-2xl text-black dark:text-white">+</Typography>
              </Button>
            </View>
          </View>

          {/* WAKE UP TIME & AWAKE HOURS */}
          <View className="mb-10 bg-grey50 dark:bg-semiDarkBg p-5 rounded-3xl border border-grey100 w-full">
            <Typography weight="700" size="lg" className="mb-4 uppercase text-black dark:text-white">
              {i18n.t("onboarding.scheduleTitle")}
            </Typography>

            {/* Wake-up time picker or simple input */}
            <View className="mb-4 w-full">
              <Typography size="md" className="text-grey600 dark:text-grey200 mb-2">
                {i18n.t("onboarding.wakeUpTime")}
              </Typography>
              <View className="flex-row items-center bg-white p-3 rounded-xl border border-grey200 w-full">
                <Ionicons name="time-outline" size={20} color="#6b7280" className="mr-2" />
                <TouchableOpacity
                  className="flex-1"
                  onPress={() => setShowTimeModal(true)}
                >
                  <Typography weight="600" className="text-lg">
                    {formData.wakeUpTime || "07:00"}
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>

            {/* Awake hours slider */}
            <View className="w-full">
              {/* Label Row - flex-1 on text allows wrapping and prevents horizontal overflow */}
              <View className="flex-row items-center justify-between mb-2 w-full">
                <View className="flex-row items-center flex-1 pr-2">
                  <Typography size="md" className="text-grey600 dark:text-grey200 flex-1">
                    {i18n.t("onboarding.awakeHours")}
                  </Typography>
                  {/* TOOLTIP ICON */}
                  <TouchableOpacity onPress={() => openHelp("awakeTimeHelp")}>
                    <Ionicons
                      name="information-circle-outline"
                      size={24}
                      color={activeTheme == "light" ? "#005b89" : "#fff"}
                    />
                  </TouchableOpacity>
                </View>
                <Typography weight="700" variant={activeTheme == "light" ? "blue" : "white"} className="shrink-0 text-lg">
                  {formData.awakeHours || 16} h
                </Typography>
              </View>

              {/* Slider Container */}
              <View className="w-full h-10 justify-center">
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={12}
                  maximumValue={18}
                  step={1}
                  value={formData.awakeHours || 16}
                  minimumTrackTintColor="#0056B3"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#0056B3"
                  onValueChange={(val) =>
                    setFormData({ ...formData, awakeHours: val })
                  }
                />
              </View>
            </View>
          </View>



          {/*NAVIGATION STEP 2 btns */}
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={prevStep}
              className="flex-row items-center ml-2 bg-vgrBlue dark:bg-white rounded-full"
            >
              <Ionicons
                name="arrow-back-circle-sharp"
                size={50}
                color={activeTheme == "dark" ? "#1f2937" : "white"}
              />
            </TouchableOpacity>
            <Typography className="text-grey400 dark:text-grey100 text-xl font-bold flex-1 text-center font-roboto shadow-slate-800 shadow-lg">
              {step}/5 {i18n.t("onboarding.pages")}
            </Typography>
            <TouchableOpacity
              onPress={nextStep}
              className="flex-row items-center mr-4  bg-vgrBlue dark:bg-white rounded-full"
            >
              <Ionicons name="arrow-forward-circle" size={50} color={activeTheme == "dark" ? "#1f2937" : "white"} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: Support Tools */}
      {step === 3 && (
        <View className="p-4 flex-1">
          <View className="flex flex-row justify-between px-4">
            <Typography
              className="text-[25px] font-roboto text-center mb-2 text-black dark:text-white"
              weight="700"
            >
              {i18n.t("onboarding.step3Title")}
            </Typography>
            {/* TOOLTIP ICON */}
            <TouchableOpacity onPress={() => openHelp("supportToolsHelp")}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={activeTheme == "light" ? "#005b89" : "#fff"}
              />
            </TouchableOpacity>
          </View>
          <Typography size="sm" className="text-grey500 dark:text-grey200  mb-6 px-4">
            {i18n.t("onboarding.step3SubTitle")}
          </Typography>

          {/* MASTER TOGGLE CARD */}
          <View className="bg-grey50 p-5 rounded-2xl border border-grey200 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Typography weight="700" size="md">
                  {i18n.t("onboarding.step3SupportToolsCard")}
                </Typography>
                <Typography size="sm" className="text-grey500 mt-1">
                  {formData.useExternalTools
                    ? "Ja, jag vill använda plåster eller tuggummi."
                    : "Nej, jag vill bara trappa ner min nuvarande produkt."}
                </Typography>
              </View>
              <Switch
                value={!!formData.useExternalTools}
                onValueChange={(val) =>
                  setFormData({ ...formData, useExternalTools: val })
                }
              />
            </View>
          </View>

          {/* REVEALED OPTIONS (ONLY WHEN YES / TRUE) */}
          {formData.useExternalTools && (
            <View className="space-y-4 mb-6">
              {/* --- PATCH SECTION --- */}
              <View className="p-4 bg-blue50/60 rounded-2xl border border-blue100 mb-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-2">
                    <Typography weight="700" variant="blue">
                      Nikotinplåster
                    </Typography>
                    <Typography size="sm" className="text-grey500">
                      Ger en jämn basdos under hela dagen.
                    </Typography>
                  </View>
                  <Switch
                    value={!!formData.usePatch}
                    onValueChange={(val) =>
                      setFormData({ ...formData, usePatch: val })
                    }
                  />
                </View>

                {formData.usePatch && (
                  <View className="mt-3 pt-3 border-t border-blue100">
                    <Typography size="sm" className="text-grey500 mb-2">
                      Välj styrka på ditt plåster:
                    </Typography>
                    <View className="flex-row justify-between">
                      {[21, 14, 7].map((mg) => (
                        <Button
                          key={mg}
                          variant={formData.patchStrength === mg ? "blue" : "white"}
                          className="flex-1 mx-1 py-2"
                          onPress={() =>
                            setFormData({ ...formData, patchStrength: mg })
                          }
                        >
                          <Typography
                            size="sm"
                            weight="700"
                            variant={formData.patchStrength === mg ? "white" : "black"}
                          >
                            {mg} mg
                          </Typography>
                        </Button>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* --- GUM SECTION --- */}
              <View className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 mb-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 mr-2">
                    <Typography weight="700" variant="blue">
                      Nikotintuggummi / Sugtablett
                    </Typography>
                    <Typography size="sm" className="text-grey500">
                      För tillfälliga, skarpa begär.
                    </Typography>
                  </View>
                  <Switch
                    value={!!formData.useGum}
                    onValueChange={(val) =>
                      setFormData({ ...formData, useGum: val })
                    }
                  />
                </View>

                {formData.useGum && (
                  <View className="mt-3 pt-3 border-t border-purple-100">
                    <Typography size="sm" className="text-grey500 mb-2">
                      Välj styrka på tuggummi/tablett:
                    </Typography>
                    <View className="flex-row justify-center">
                      {[4, 2].map((mg) => (
                        <Button
                          key={mg}
                          variant={formData.gumStrength === mg ? "blue" : "white"}
                          className="flex-1 mx-1 py-2"
                          onPress={() =>
                            setFormData({ ...formData, gumStrength: mg })
                          }
                        >
                          <Typography
                            size="sm"
                            weight="700"
                            variant={formData.gumStrength === mg ? "white" : "black"}
                          >
                            {mg} mg
                          </Typography>
                        </Button>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* NAVIGATION BUTTONS */}
          <Typography className="text-gray-400 text-xl font-bold flex-1 text-center font-roboto shadow-slate-800 shadow-lg">
            {step}/5 {i18n.t("onboarding.pages")}
          </Typography>
          <View className="flex-row justify-between pt-4">

            <Button onPress={prevStep} variant="outlined" className="flex-1 mr-2">
              <Typography>{i18n.t("onboarding.prevBtn")}</Typography>
            </Button>
            <Button onPress={nextStep} variant="blue" className="flex-1 ml-2">
              <Typography variant="white">
                {i18n.t("onboarding.nextBtn")}
              </Typography>
            </Button>
          </View>
        </View>
      )}
      {/* step 4 Present the treatmentplan */}
      {step === 4 && (
        <View className="w-full p-4 ">
          <Typography variant="black" weight="700" size="xl" className="mb-2">
            {i18n.t("onboarding.summaryTitle")}
          </Typography>
          <Typography size="sm" className="text-grey600 mb-6">
            {i18n.t("onboarding.summarySubtitle")}
          </Typography>

          {/* PLAN HIGHLIGHT CARD */}
          <View className="bg-grey50 p-5 rounded-3xl border border-grey100 w-full mb-6">
            {/* Target Goal */}
            <View className="flex-row justify-between items-center pb-4 border-b border-grey200">
              <Typography size="sm" className="text-grey600">{i18n.t("onboarding.summaryEndgoal")}</Typography>
              <Typography weight="700" variant="blue">{i18n.t("onboarding.summarySupremGoal")}</Typography>
            </View>

            {/* Estimated Duration */}
            <View className="flex-row justify-between items-center py-4 border-b border-grey200">
              <Typography size="sm" className="text-grey600">{i18n.t("onboarding.summaryCalculatedTime")}</Typography>
              <Typography weight="700" variant="black">
                {calculatePlanSummary(formData).totalDays} {i18n.t("general.days")}
              </Typography>
            </View>

            {/* END DATE */}
            <View className="flex-row justify-between items-center py-4 border-b border-grey200">
              <Typography size="sm" className="text-grey600">{i18n.t("onboarding.summaryEndDate")}</Typography>
              <Typography weight="700" variant="black">
                {/*  format the ISO datestring into readable format */}
                {new Date(calculatePlanSummary(formData).endDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </View>

            {/* Active Aids from Step 3 */}
            {(formData.usePatch || formData.useGum) && (
              <View className="flex-row justify-between items-center py-4 border-b border-grey200">
                <Typography size="sm" className="text-grey600">{i18n.t("onboarding.Aid")}</Typography>
                <Typography weight="700" variant="black" className="text-right flex-1 ml-4">
                  {[
                    formData.usePatch ? `Plåster (${formData.patchStrength}mg)` : null,
                    formData.useGum ? `Tuggummi (${formData.gumStrength}mg)` : null,
                  ].filter(Boolean).join(" + ")}
                </Typography>
              </View>
            )}

            {/* First Dose Time */}
            <View className="flex-row justify-between items-center pt-4">
              <Typography size="sm" className="text-grey600">{i18n.t("onboarding.summaryFirstDoseToday")}</Typography>
              <Typography weight="700" variant="black">
                Kl. {formData.wakeUpTime || "07:00"}
              </Typography>
            </View>
          </View>

          {/* PUSH NOTIFICATION PERMISSION CARD */}
          <View className="bg-blue50 p-5 rounded-3xl border border-blue100 w-full mb-6 flex-row items-center">
            <Ionicons name="notifications-outline" size={28} color="#0056B3" className="mr-4" />
            <View className="flex-1 pr-2">
              <Typography weight="700" size="sm" className="text-blue-900 mb-1">
                {i18n.t("onboarding.summaryNotificationsImportant")}
              </Typography>
              <Typography size="sm" className="text-blue-700">
                {i18n.t("onboarding.summaryNotificationsSchedule")}
              </Typography>
            </View>
          </View>

          <View className="flex-row justify-between items-center pt-4">
            <Button onPress={prevStep} variant="outlined" className="flex-1 mr-2">
              <Typography>{i18n.t("onboarding.prevBtn")}</Typography>
            </Button>
            <Typography className="text-gray-400 text-sm font-bold text-center px-2">
              {step}/ 5
            </Typography>
            <Button onPress={nextStep} variant="blue" className="flex-1 ml-2">
              <Typography variant="white">{i18n.t("onboarding.nextBtn")}</Typography>
            </Button>
          </View>
        </View>
      )}

      {/* STEP 5: TOS */}
      {step === 5 && (
        <View className="p-4">
          <Typography variant="black" className="text-xl mb-4" weight="700">
            {i18n.t("onboarding.tos.title")}
          </Typography>

          {/* Removed fixed h-40 so the card grows dynamically with text */}
          <View className="bg-grey50 p-4 mb-6 rounded-2xl border border-grey200">
            <Typography size="md" className="text-gray-700 mb-2">
              {i18n.t("onboarding.tos.subtitle")}
            </Typography>
            <Typography size="sm" className="text-grey500 mt-2">
              1. {i18n.t("onboarding.tos.1")}
            </Typography>
            <Typography size="sm" className="text-grey500 mt-2">
              2. {i18n.t("onboarding.tos.2")}
            </Typography>
            <Typography size="sm" className="text-grey500 mt-2">
              3. {i18n.t("onboarding.tos.3")}
            </Typography>
            <Typography size="sm" className="text-grey500 mt-2">
              4. {i18n.t("onboarding.tos.4")}
            </Typography>
            <Typography size="sm" className="text-grey500 mt-2">
              5. {i18n.t("onboarding.tos.5")}
            </Typography>
          </View>

          {/* Side-by-side button row placed cleanly below the text card */}
          <View className="flex-row justify-between">
            <Button
              onPress={prevStep}
              variant="outlined"
              className="items-center"
            >
              <Typography>{i18n.t("onboarding.prevBtn")}</Typography>
            </Button>

            <Button
              onPress={handleTOSAcceptance}
              variant="blue"
              className="flex-1 ml-2 items-center"
            >
              <Typography variant="white">
                {i18n.t("onboarding.confirm")}
              </Typography>
            </Button>
          </View>
        </View>
      )}

      {/* STEP 6: HOW TO USE THE APP */}
      {step === 6 && (
        <View className="p-4">
          <Typography variant="black" className="text-2xl text-center mb-2" weight="700">
            {i18n.t("onboarding.step5header")}
          </Typography>

          <Typography size="sm" className="text-grey500 text-center mb-6 px-4">
            {i18n.t("onboarding.step5subHeader")}
          </Typography>

          {/* VIDEO / INSTRUCTIONAL MEDIA PLACEHOLDER */}
          {/*  <View className="bg-slate-900 rounded-3xl h-48 mb-6 justify-center items-center overflow-hidden border border-slate-800"> */}
          {/* If using Video, replace this view with <Video source={{ uri: '...' }} useNativeControls resizeMode="cover" /> */}
          {/*  <Ionicons name="play-circle-outline" size={64} color="#FFF" />
            <Typography variant="white" weight="600" className="mt-2">
              Se instuktionsfilm (1 min)
            </Typography>
          </View> */}

          {/* FEATURE CARDS / QUICK GUIDE */}
          <View className="space-y-3 mb-8 gap-3">
            <View className="bg-grey50 p-4 rounded-2xl border border-grey100 flex-row items-center">
              <View className="bg-orange-100 p-3 rounded-xl mr-4">
                <Ionicons name="notifications" size={24} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Typography weight="700" size="md">{i18n.t("onboarding.featureCard1Header")}</Typography>
                <Typography size="sm" className="text-grey500">
                  {i18n.t("onboarding.featureCard1Para")}
                </Typography>
              </View>
            </View>
            <View className="bg-grey50 p-4 rounded-2xl border border-grey100 flex-row items-center">
              <View className="bg-red-100 p-3 rounded-xl mr-4">
                <Ionicons name="flash" size={24} color="#FF0600" />
              </View>
              <View className="flex-1">
                <Typography weight="700" size="md">{i18n.t("onboarding.featureCard2Header")}</Typography>
                <Typography size="sm" className="text-grey500">
                  {i18n.t("onboarding.featureCard2Para")}
                </Typography>
              </View>
            </View>
            <View className="bg-grey50 p-4 rounded-2xl border border-grey100 flex-row items-center">
              <View className="bg-pink-100 p-3 rounded-xl mr-4">
                <Ionicons name="analytics" size={24} color="#be185d" />
              </View>
              <View className="flex-1">
                <Typography weight="700" size="md">{i18n.t("onboarding.featureCard3Header")}</Typography>
                <Typography size="sm" className="text-grey500">
                  {i18n.t("onboarding.featureCard3Para")}
                </Typography>
              </View>
            </View>
            {/*NEW OLD CARDS */}
            <View className="bg-grey50 p-4 rounded-2xl border border-grey100 flex-row items-center">
              <View className="bg-blue100 p-3 rounded-xl mr-4">
                <Ionicons name="stats-chart" size={24} color="#0056B3" />
              </View>
              <View className="flex-1">
                <Typography weight="700" size="md">{i18n.t("onboarding.featureCard4Header")}</Typography>
                <Typography size="sm" className="text-grey500">
                  {i18n.t("onboarding.featureCard4Para")}
                </Typography>
              </View>
            </View>

            <View className="bg-grey50 p-4 rounded-2xl border border-grey100 flex-row items-center">
              <View className="bg-green-100 p-3 rounded-xl mr-4">
                <Ionicons name="trophy" size={24} color="#2E7D32" />
              </View>
              <View className="flex-1">
                <Typography weight="700" size="md">{i18n.t("onboarding.featureCard5Header")}</Typography>
                <Typography size="sm" className="text-grey500">
                  {i18n.t("onboarding.featureCard5Para")}
                </Typography>
              </View>
            </View>

            <View className="bg-grey50 p-4 rounded-2xl border border-grey100 flex-row items-center">
              <View className="bg-purple-100 p-3 rounded-xl mr-4">
                <Ionicons name="medkit" size={24} color="#6A1B9A" />
              </View>
              <View className="flex-1">
                <Typography weight="700" size="md">{i18n.t("onboarding.featureCard6Header")}</Typography>
                <Typography size="sm" className="text-grey500">
                  {i18n.t("onboarding.featureCard6Para")}
                </Typography>
              </View>
            </View>
          </View>

          {/* NAVIGATION BUTTONS */}
          <View className="flex-row justify-between">
            <Button onPress={prevStep} variant="outlined" className="flex-1 mr-2">
              <Typography>{i18n.t("onboarding.prevBtn")}</Typography>
            </Button>

            <Button
              onPress={handleFinalSave}
              variant="blue"
              size="md"
              className="flex-1 ml-2"
              loading={loading}
            >
              <Typography variant="white">Starta din plan</Typography>
            </Button>
          </View>
        </View>
      )}

      {/* HELP MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showHelp}
        onRequestClose={() => setShowHelp(false)}
      >
        <HelpModal setShowHelp={setShowHelp} helpKey={helpKey} />
      </Modal>

      {/* WAKE UP TIME MODAL */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center p-6"
          activeOpacity={1}
          onPress={() => setShowTimeModal(false)}
        >
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <Typography weight="700" size="lg" className="mb-4 text-center">
              Välj din vaknatid
            </Typography>

            <ScrollView className="max-h-64">
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  className={`py-3 px-4 rounded-xl mb-2 flex-row justify-between items-center ${formData.wakeUpTime === time ? "bg-blue50 border border-blue500" : "bg-gray-50"
                    }`}
                  onPress={() => {
                    setFormData({ ...formData, wakeUpTime: time });
                    setShowTimeModal(false);
                  }}
                >
                  <Typography weight={formData.wakeUpTime === time ? "700" : "400"}>
                    Kl. {time}
                  </Typography>
                  {formData.wakeUpTime === time && (
                    <Ionicons name="checkmark-circle" size={20} color="#0056B3" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
