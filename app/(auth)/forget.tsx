import { Button, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { useAuth } from "@/providers/authProviders";
import { supabase } from "@/utils/supabase";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
} from "react-native";

export default function ForgetPassword() {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function forget() {
    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (!error) {
      setLoading(false);
      alert(i18n.t("auth.forget.successMessage"));
    }
    if (error) {
      setLoading(false);
      alert(i18n.t("auth.forget.errorMessage"));
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled className="flex-1">
      <View className="flex-1 items-center justify-between bg-vgrBlue">
        {/* TODO: ADD LOGO IMAGE*/}
        <ScrollView>
          <View className="px-4">
            <Typography
              variant="white"
              size="h2"
              weight="700"
              className="self-center p-8"
            >
              {i18n.t("auth.forget.pageHeader")}
            </Typography>
            <Typography
              variant="white"
              size="md"
              weight="400"
              className="self-center"
            >
              {i18n.t("auth.forget.pageInstruction")}
            </Typography>
            <TextInput
              className="bg-white rounded-lg p-2 mt-4 border-gray-300 w-full text-vgrBlue"
              placeholder={i18n.t("auth.forget.email_placeholder")}
              value={email}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Button
              variant="white"
              size="md"
              className="my-4 rounded items-center justify-center"
              onPress={() => {
                forget();
              }}
            >
              {loading ? (
                <Typography variant="black" weight="700" className="text-lg">
                  {i18n.t("utilities.loading")}
                </Typography>
              ) : (
                <Typography variant="black" weight="700" className="text-lg">
                  {i18n.t("utilities.skicka")}
                </Typography>
              )}
            </Button>

            <View className="flex-col items-center justify-center mt-4">
              <Typography variant="white" size="md">
                {i18n.t("auth.forget.alreadyGotAnAccount")}
              </Typography>
              <Link href="/">
                <Typography
                  size="md"
                  weight="700"
                  className="ml-2 text-blue-300 underline"
                >
                  {i18n.t("auth.forget.loginHere")}
                </Typography>
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
