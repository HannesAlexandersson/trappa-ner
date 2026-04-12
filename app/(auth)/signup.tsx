import { Button, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { useAuth } from "@/providers/authProviders";
import { Link } from "expo-router";
import React, { useState } from "react";
import { TextInput, View } from "react-native";

export default function SignUp() {
  //local states for the form inputs
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // global states and functions from the auth context
  const { signUp } = useAuth();

  return (
    <View className="flex-1 items-center justify-center  bg-vgrBlue">
      {/*  <Image
        source={require("@/assets/images/vgrLong.png")}
        className="mb-2"
        style={{ width: 300, height: 150, resizeMode: "contain" }}
      /> */}

      <View className="flex-1 items-center justify-center w-full p-4">
        <Typography variant="white" weight="700" className="text-2xl mb-4">
          {i18n.t("auth.signup.pageHeader")}
        </Typography>
        <TextInput
          placeholder={i18n.t("auth.signup.firstname_placeholder")}
          className="bg-white rounded-lg p-4 mb-4 border-gray-300 w-full text-vgrBlue"
          value={firstname}
          onChangeText={setFirstname}
        />
        <TextInput
          placeholder={i18n.t("auth.signup.lastname_placeholder")}
          className="bg-white rounded-lg p-4 mb-4 border-gray-300 w-full text-vgrBlue"
          value={lastname}
          onChangeText={setLastname}
        />

        <TextInput
          placeholder={i18n.t("auth.signup.email_placeholder")}
          className="bg-white rounded-lg p-4 mb-4 border-gray-300 w-full text-vgrBlue"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry={true}
          placeholder={i18n.t("auth.signup.password_placeholder")}
          className="bg-white rounded-lg p-4 mb-4 border-gray-300 w-full text-vgrBlue"
          value={password}
          onChangeText={setPassword}
        />
        <Button
          variant="white"
          size="md"
          className="mb-4 rounded"
          onPress={() => signUp(firstname, lastname, email, password)}
        >
          <Typography variant="black" weight="700" className="text-lg">
            {i18n.t("utilities.create")}
          </Typography>
        </Button>

        <Typography variant="white" size="md" className="mt-2">
          {i18n.t("auth.signup.alreadyGotAnAccount")}
        </Typography>
        <Link className="text-blue-300 underline" href="/(auth)">
          {i18n.t("auth.login")}
        </Link>
      </View>
    </View>
  );
}
