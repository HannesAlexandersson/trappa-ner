import { Button, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, TextInput, View } from "react-native";

export default function TreatmentPlanForm({
  isNewUser,
}: {
  isNewUser: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    consumptionType: "snus", // default
    mgNicotinePerDay: "",
    unitsPerDay: "",
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

  const handleFinalSave = async () => {
    // 1. Perform calculations (Logic to be added later)
    // 2. Save to Supabase
    // 3. Mark setup as done
    // await supabase.from('profiles').update({ needs_setup: false, ...formData }).eq('id', user.id);
    router.replace("/(tabs)");
  };

  return (
    <ScrollView className="flex-1 p-4">
      {/* STEP 1: Placeholder Description */}
      {step === 1 && (
        <View>
          <Typography variant="black" className="text-xl mb-4">
            {i18n.t("onboarding.step1Title")}
          </Typography>
          <Typography className="mb-8">
            {i18n.t("onboarding.step1Subtitle")}
          </Typography>
          <Button onPress={nextStep}>
            <Typography>{i18n.t("onboarding.nextBtn")}</Typography>
          </Button>
        </View>
      )}

      {/* STEP 2: The Core Data */}
      {step === 2 && (
        <View>
          <Typography variant="black" className="text-xl mb-4">
            {i18n.t("onboarding.step2Title")}
          </Typography>

          <Typography className="mb-2">
            {i18n.t("onboarding.step2Subtitle")}
          </Typography>
          <View className="flex-row justify-around mb-6">
            <Button
              variant={formData.consumptionType === "smoker" ? "blue" : "white"}
              onPress={() =>
                setFormData({ ...formData, consumptionType: "smoker" })
              }
            >
              <Typography>{i18n.t("onboarding.cig")}</Typography>
            </Button>
            <Button
              variant={formData.consumptionType === "snus" ? "blue" : "white"}
              onPress={() =>
                setFormData({ ...formData, consumptionType: "snus" })
              }
            >
              <Typography>{i18n.t("onboarding.snus")}</Typography>
            </Button>
          </View>

          <Typography>{i18n.t("onboarding.step2mgNicotinePerDay")}</Typography>
          <TextInput
            className="bg-gray-100 p-4 rounded-lg mb-4"
            keyboardType="numeric"
            value={formData.mgNicotinePerDay}
            onChangeText={(val) =>
              setFormData({ ...formData, mgNicotinePerDay: val })
            }
          />

          <Typography>{i18n.t("onboarding.step2unitsPerDay")}</Typography>
          <TextInput
            className="bg-gray-100 p-4 rounded-lg mb-4"
            keyboardType="numeric"
            value={formData.unitsPerDay}
            onChangeText={(val) =>
              setFormData({ ...formData, unitsPerDay: val })
            }
          />

          <View className="flex-row justify-between mt-4">
            <Button onPress={prevStep} variant="white">
              <Typography>{i18n.t("onboarding.prevBtn")}</Typography>
            </Button>
            <Button onPress={nextStep}>
              <Typography>{i18n.t("onboarding.nextBtn")}</Typography>
            </Button>
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
    </ScrollView>
  );
}
