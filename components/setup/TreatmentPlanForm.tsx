import { Button, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

export default function TreatmentPlanForm({
  isNewUser,
}: {
  isNewUser: boolean;
}) {
  const router = useRouter();
  // Local state for step management and form data
  const [step, setStep] = useState(1);
  const [helpContent, setHelpContent] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [helpKey, setHelpKey] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    consumptionType: "snus", // default
    mgNicotinePerDay: 20,
    unitsPerDay: 10,
    aggressiveness: 3,
    useExternalTools: false,
    usePatch: false,
    patchStrength: 0, // Should be 21, 14, or 7 (mg/24h)
    useGum: false,
    gumStrength: 0, // Should be 4 or 2 (mg)
    toolType: "none",
    toolStrength: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const openHelp = (key: string) => {
    setHelpKey(key);
    setShowHelp(true);
  };

  const handleFinalSave = async () => {
    // 1. Perform calculations (Logic to be added later)
    // 2. Save to Supabase
    // 3. Mark setup as done
    // await supabase.from('profiles').update({ needs_setup: false, ...formData }).eq('id', user.id);
    router.replace("/(tabs)");
  };

  return (
    <ScrollView>
      {/* STEP 1: INTRO */}
      {step === 1 && (
        <View className="p-4">
          <Typography variant="black" className="text-2xl mb-3" weight="700">
            {i18n.t("onboarding.step1Title")}
          </Typography>

          <Typography className="text-gray-500 mb-8" size="lg">
            {i18n.t("onboarding.step1Subtitle")}
          </Typography>

          <View className="bg-gray-50 rounded-3xl p-5 mb-6 border border-gray-100">
            <Typography className="mb-4 leading-6 text-gray-700">
              {i18n.t("onboarding.step1Info1")}
            </Typography>

            <Typography className="mb-4 leading-6 text-gray-700">
              {i18n.t("onboarding.step1Info2")}
            </Typography>

            <Typography className="mb-4 leading-6 text-gray-700">
              {i18n.t("onboarding.step1Info3")}
            </Typography>

            <Typography className="mb-4 leading-6 text-gray-700">
              {i18n.t("onboarding.step1Info4")}
            </Typography>

            <Typography className="leading-6 text-gray-700">
              {i18n.t("onboarding.step1Info5")}
            </Typography>
          </View>

          <View className="items-center mb-4">
            <Typography className="text-gray-400">
              1 / 4 {i18n.t("onboarding.pages")}
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
        <View className="flex-1 p-4 ">
          <Typography
            variant="black"
            className="font-roboto mb-4"
            weight="700"
            size="xl"
          >
            {i18n.t("onboarding.step2Title")}
          </Typography>

          {/* Question 1 */}
          <Typography
            variant="black"
            weight="300"
            size="lg"
            className="mr-2 mb-6"
          >
            {i18n.t("onboarding.step2Subtitle")}
          </Typography>

          <View className="flex-row justify-around mb-6">
            <Button
              variant={formData.consumptionType === "smoker" ? "blue" : "white"}
              onPress={() =>
                setFormData({ ...formData, consumptionType: "smoker" })
              }
            >
              <Typography
                variant={
                  formData.consumptionType === "smoker" ? "white" : "blue"
                }
              >
                {i18n.t("onboarding.cig")}
              </Typography>
            </Button>
            <Button
              variant={formData.consumptionType === "snus" ? "blue" : "white"}
              onPress={() =>
                setFormData({ ...formData, consumptionType: "snus" })
              }
            >
              <Typography
                variant={formData.consumptionType === "snus" ? "white" : "blue"}
              >
                {i18n.t("onboarding.snus")}
              </Typography>
            </Button>
          </View>

          {/* MG NICOTINE SLIDER - DATA CENTERED */}
          <View className="mb-12 bg-vgrBlue p-6 rounded-3xl border border-gray-100">
            <View className="flex-row items-center justify-center mb-6">
              <Typography
                size="sm"
                className="text-gray-200 text-center mb-2 uppercase tracking-widest"
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
            <View className="items-center justify-center mb-4">
              <Typography variant="white" weight="700" className="text-5xl">
                {formData.mgNicotinePerDay >= 100
                  ? "100+"
                  : formData.mgNicotinePerDay}
              </Typography>
              <Typography variant="white" weight="400" size="lg">
                mg / {i18n.t("onboarding.day")}
              </Typography>
            </View>

            <Slider
              style={{ width: "100%", height: 50 }}
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

            <View className="flex-row justify-between mt-2">
              <Typography size="sm" className="text-gray-400">
                5 mg ({i18n.t("onboarding.or less")})
              </Typography>
              <Typography size="sm" className="text-gray-400">
                100+ mg
              </Typography>
            </View>
          </View>

          {/* UNITS PER DAY STEPPER */}
          <View className="mb-10">
            <Typography
              className="mb-2 text-center"
              size="lg"
              variant="black"
              weight="400"
            >
              {i18n.t("onboarding.step2unitsPerDay")}
            </Typography>
            <View className="flex-row items-center justify-between bg-gray-100 p-2 rounded-xl">
              <Button
                variant="white"
                className="w-12 h-12 rounded-lg"
                onPress={() =>
                  setFormData({
                    ...formData,
                    unitsPerDay: Math.max(1, formData.unitsPerDay - 1),
                  })
                }
              >
                <Typography className="text-2xl">-</Typography>
              </Button>

              <Typography weight="700" className="text-xl">
                {formData.unitsPerDay >= 50 ? "50+" : formData.unitsPerDay}{" "}
                {formData.consumptionType === "snus"
                  ? i18n.t("onboarding.snus")
                  : i18n.t("onboarding.cig")}
              </Typography>

              <Button
                variant="white"
                className="w-12 h-12 rounded-lg"
                onPress={() =>
                  setFormData({
                    ...formData,
                    unitsPerDay: Math.min(50, formData.unitsPerDay + 1),
                  })
                }
              >
                <Typography className="text-2xl">+</Typography>
              </Button>
            </View>
          </View>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={prevStep}
              className="flex-row items-center ml-2 bg-vgrBlue rounded-full"
            >
              <Ionicons
                name="arrow-back-circle-sharp"
                size={50}
                color="white"
              />
            </TouchableOpacity>
            <Typography className="text-gray-400 text-xl font-bold flex-1 text-center font-roboto shadow-slate-800 shadow-lg">
              {step}/4 {i18n.t("onboarding.pages")}
            </Typography>
            <TouchableOpacity
              onPress={nextStep}
              className="flex-row items-center mr-4  bg-vgrBlue rounded-full"
            >
              <Ionicons name="arrow-forward-circle" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: Aggressivity & Tools */}
      {step === 3 && (
        <View>
          <Typography variant="black" className="text-xl mb-4">
            {i18n.t("onboarding.step3Title")}
          </Typography>

          <View className="flex-row items-center justify-between mb-4">
            <Typography>{i18n.t("onboarding.step3SupportTools")}</Typography>
            <Switch
              value={formData.useExternalTools}
              onValueChange={(val) =>
                setFormData({ ...formData, useExternalTools: val })
              }
            />
          </View>

          {formData.useExternalTools && (
            <View>
              {/* --- PATCH SECTION --- */}
              <View className="mb-6 p-4 bg-blue-50 rounded-xl">
                <View className="flex-row justify-between items-center mb-2">
                  <Typography weight="700">Nikotinplåster</Typography>
                  <Switch
                    value={formData.usePatch}
                    onValueChange={(val) =>
                      setFormData({ ...formData, usePatch: val })
                    }
                  />
                </View>

                {formData.usePatch && (
                  <View className="flex-row justify-between mt-2">
                    {[21, 14, 7].map((mg) => (
                      <Button
                        key={mg}
                        variant={
                          formData.patchStrength === mg ? "blue" : "white"
                        }
                        className="flex-1 mx-1"
                        onPress={() =>
                          setFormData({ ...formData, patchStrength: mg })
                        }
                      >
                        <Typography size="sm">{mg} mg</Typography>
                      </Button>
                    ))}
                  </View>
                )}
              </View>

              {/* --- GUM SECTION --- */}
              <View className="mb-6 p-4 bg-purple-50 rounded-xl">
                <View className="flex-row justify-between items-center mb-2">
                  <Typography weight="700">Nikotintuggummi</Typography>
                  <Switch
                    value={formData.useGum}
                    onValueChange={(val) =>
                      setFormData({ ...formData, useGum: val })
                    }
                  />
                </View>

                {formData.useGum && (
                  <View className="flex-row justify-center mt-2">
                    {[4, 2].map((mg) => (
                      <Button
                        key={mg}
                        variant={formData.gumStrength === mg ? "blue" : "white"}
                        className="mx-2 px-6"
                        onPress={() =>
                          setFormData({ ...formData, gumStrength: mg })
                        }
                      >
                        <Typography>{mg} mg</Typography>
                      </Button>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Navigation Buttons - Always outside the logic so they don't disappear */}
          <View className="flex-row justify-between mt-4 mb-10">
            <Button onPress={prevStep} variant="white">
              <Typography>{i18n.t("onboarding.prevBtn")}</Typography>
            </Button>
            <Button onPress={nextStep}>
              <Typography>{i18n.t("onboarding.nextBtn")}</Typography>
            </Button>
          </View>
        </View>
      )}

      {/* STEP 4: TOS */}
      {step === 4 && (
        <View>
          <Typography variant="black" className="text-xl mb-4">
            {i18n.t("onboarding.tos.title")}
          </Typography>
          <View className="h-40 bg-gray-50 p-4 mb-4 rounded border border-gray-200">
            <Typography size="md" className="text-gray-700">
              {i18n.t("onboarding.tos.subtitle")}
            </Typography>
            <Typography size="sm" className="text-gray-500 mt-2">
              1. {i18n.t("onboarding.tos.1")}
            </Typography>
            <Typography size="sm" className="text-gray-500 mt-2">
              2. {i18n.t("onboarding.tos.2")}
            </Typography>
            <Typography size="sm" className="text-gray-500 mt-2">
              3. {i18n.t("onboarding.tos.3")}
            </Typography>
            <Typography size="sm" className="text-gray-500 mt-2">
              4. {i18n.t("onboarding.tos.4")}
            </Typography>
            <Typography size="sm" className="text-gray-500 mt-2">
              5. {i18n.t("onboarding.tos.5")}
            </Typography>
          </View>

          <Button onPress={prevStep} variant="blue" className="mt-4">
            <Typography>{i18n.t("onboarding.prevBtn")}</Typography>
          </Button>
          <Button onPress={handleFinalSave}>
            <Typography>{i18n.t("onboarding.confirm")}</Typography>
          </Button>
        </View>
      )}

      {/* HELP MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showHelp}
        onRequestClose={() => setShowHelp(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center p-6"
          onPress={() => setShowHelp(false)}
        >
          <View className="bg-white w-full rounded-3xl p-6 shadow-xl">
            <Typography weight="700" size="lg" variant="blue" className="mb-4">
              {i18n.t(`help.${helpKey}.title`)}
            </Typography>

            <Typography size="md" className="text-gray-600 mb-6">
              {i18n.t(`help.${helpKey}.body`)}
            </Typography>

            <Button onPress={() => setShowHelp(false)} variant="blue">
              <Typography variant="white" className="text-center">
                {i18n.t(`help.${helpKey}.btnText`)}
              </Typography>
            </Button>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
