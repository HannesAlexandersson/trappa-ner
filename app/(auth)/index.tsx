import { Button, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { useAuth } from "@/providers/authProviders";
import { loginSchema } from "@/utils/zodSchemas";
import { Link } from "expo-router";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
import "../global.css";

export default function Auth() {
  //local states for the form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // global states and functions from the auth context
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setErrorMsg(""); // Clear errors
    //parse the input with the zod schema
    const result = loginSchema.safeParse({
      emailAddress: email,
      password: password,
    });

    if (!result.success) {
      // TODO: Handle validation errors and display them to the user
      return;
    }

    await signIn(email, password);
  };

  return (
    <View className="flex-1 items-center justify-between bg-vgrBlue">
      <View className="flex-1 flex-col items-center justify-center w-full p-4">
        <Typography weight="700" variant="black" className="text-2xl mb-4">
          {i18n.t("auth.welcome_to")}
        </Typography>
        <TextInput
          placeholder={i18n.t("auth.email_placeholder")}
          className="bg-white rounded-lg p-4 mb-4 border-gray-300 w-full text-vgrBlue"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry={true}
          placeholder={i18n.t("auth.password_placeholder")}
          className="bg-white rounded-lg p-4 mb-4 border-gray-300 w-full text-vgrBlue"
          value={password}
          onChangeText={setPassword}
        />
        <Button
          variant="white"
          size="md"
          className="rounded"
          onPress={handleLogin}
        >
          <Typography
            variant="black"
            size="md"
            weight="700"
            className="text-lg"
          >
            {i18n.t("auth.login")}
          </Typography>
        </Button>

        <Typography variant="white" size="md" className="mt-8">
          {i18n.t("auth.forget.pageHeader")}
        </Typography>
        <Link className="text-blue-300 underline" href="/(auth)/forget">
          {i18n.t("auth.forget.recoverPassword")}
        </Link>

        <Typography variant="white" size="md" className="mt-8">
          {i18n.t("auth.dontHaveAnAccount")}
        </Typography>
        <Link className="text-blue-300 underline" href="/(auth)/signup">
          {i18n.t("auth.registerAccount")}
        </Link>
      </View>
    </View>
  );
}
