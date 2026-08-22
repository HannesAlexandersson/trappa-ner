import { Typography } from "@/components";
import HelpModal from "@/components/HelpModal";
import i18n, { languageOptions } from "@/constants/dictonarys/i18n";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { updateUserProfile } from "@/lib/apiHelper";
import { useAuth } from "@/providers/authProviders";
import { useThemeStore } from "@/stores/themeStore";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  // GLOBAL
  const { user, updateTheme } = useAuth();
  // STORES
  const systemTheme = useColorScheme();
  const theme = useThemeStore((state) => state.theme);

  const activeTheme =
    theme === "system"
      ? systemTheme ?? "light"
      : theme;
  // LOCAL
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [language, setLanguage] = useState(user?.language ?? i18n.locale);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpKey, setHelpKey] = useState("");

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{i18n.t("utilities.loading")}</Text>
      </View>
    );
  }

  if (!user.id) return null;
  // HANDLERS
  const hasProfileChanges =
    firstName !== (user.first_name ?? "") ||
    lastName !== (user.last_name ?? "") ||
    email !== (user.email ?? "") ||
    language !== (user.language ?? i18n.locale);

  const hasPasswordChanges =
    newPassword.length > 0 || confirmPassword.length > 0;

  const hasChanges = hasProfileChanges || hasPasswordChanges;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (!user.id) return null;
      if (hasProfileChanges) {
        await updateUserProfile(user.id, {
          first_name: firstName,
          last_name: lastName,
          language,
        });
      }

      if (email !== (user.email ?? "")) {
        const { error } = await supabase.auth.updateUser({
          email,
        });

        if (error) {
          throw error;
        }
      }

      if (hasPasswordChanges) {
        if (newPassword !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match.");
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          throw error;
        }

        setNewPassword("");
        setConfirmPassword("");
      }

      i18n.locale = language;

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      Alert.alert("Error", "Could not update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const openHelp = (key: string) => {
    setHelpKey(key);
    setShowHelp(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Error", "Could not log out.");
      console.error(error);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">

      <View className="flex flex-row justify-between">
        <Text className="text-3xl font-bold mb-8 font-roboto text-vgrBlue dark:text-white shadow-slate-300 shadow-lg">
          {i18n.t("settings.systemSettings")}
        </Text>

        <TouchableOpacity onPress={() => openHelp("systemSettingsHelp")}>
          {theme == "dark" ? (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#fff"
            />
          ) : (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#005b89"
            />
          )}

        </TouchableOpacity>
      </View>
      {/* System settings */}
      <Text className="text-base font-semibold mb-2 dark:text-white">
        {i18n.t("settings.theme")}
      </Text>
      <View className="flex flex-row justify-around mb-6">
        <View className="flex flex-col items-center justify-center">
          <TouchableOpacity onPress={() => updateTheme("light")} className="bg-blue-400 dark:bg-white rounded-md p-2">
            <Ionicons
              name="sunny-sharp"
              size={50}
              color="#dbe920"
            />

          </TouchableOpacity>
          <Typography size="sm" weight="300" className="dark:text-white text-black" > {i18n.t("settings.light")}</Typography>
        </View>
        <View className="flex flex-col items-center justify-center">
          <TouchableOpacity onPress={() => updateTheme("dark")} className="bg-vgrBlue dark:bg-white rounded-md p-2">
            {theme == "dark" ? (
              <Ionicons
                name="moon-sharp"
                size={50}
                color="#005b89"
              />
            ) : (
              <Ionicons
                name="moon-sharp"
                size={50}
                color="#fff"
              />
            )}


          </TouchableOpacity>
          <Typography size="sm" weight="300" className="dark:text-white text-black" > {i18n.t("settings.dark")}</Typography>
        </View>
      </View>
      <Text className="text-base font-semibold mb-2 dark:text-white">
        {i18n.t("settings.language")}
      </Text>

      <View className="border border-grey300 dark:border-grey50 rounded-lg mb-6 overflow-hidden ">
        <Picker
          selectedValue={language}
          onValueChange={(value) => setLanguage(value)}

        >
          {Object.entries(languageOptions).map(([locale, option]) => (
            <Picker.Item
              key={locale}
              label={`${option.flag}  ${option.name}`}
              value={locale}
              color={Colors[activeTheme].vgrBlue}
            />
          ))}
        </Picker>
      </View>
      {/* Profile Settings */}
      <View className="flex flex-row justify-between">
        <Text className="text-3xl font-bold mb-8 font-roboto text-vgrBlue dark:text-white shadow-slate-300 shadow-lg">
          {i18n.t("settings.profileSettings")}
        </Text>

        <TouchableOpacity onPress={() => openHelp("profileSettingsHelp")}>
          {theme == "dark" ? (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#fff"
            />
          ) : (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#005b89"
            />
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-base font-semibold mb-2 dark:text-white">
        {i18n.t("settings.firstName")}
      </Text>

      <TextInput
        className="border border-grey300 dark:border-grey50 rounded-lg p-3 mb-4  dark:text-white"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text className="text-base font-semibold mb-2 dark:text-white">
        {i18n.t("settings.lastName")}
      </Text>

      <TextInput
        className="border border-grey300 dark:border-grey50 rounded-lg p-3 mb-4 dark:text-white"
        value={lastName}
        onChangeText={setLastName}
      />

      <Text className="text-base font-semibold mb-2 dark:text-white">
        {i18n.t("settings.email")}
      </Text>

      <TextInput
        className="border border-grey300 dark:border-grey50 rounded-lg p-3 mb-4 dark:text-white"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="text-base font-semibold mb-2 dark:text-white">
        {i18n.t("settings.newPassword")}
      </Text>

      <TextInput
        className="border border-grey300 dark:border-grey50 rounded-lg p-3 mb-4 dark:text-white"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <Text className="text-base font-semibold mb-2 dark:text-white">
        {i18n.t("settings.confirmPassword")}
      </Text>

      <TextInput
        className="border border-grey300 dark:border-grey50 rounded-lg p-3 mb-6 dark:text-white"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {hasChanges && (
        <Pressable
          className="bg-vgrBlue dark:bg-white dark:border dark:border-vgrBlue rounded-lg p-4 items-center"
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text className="text-white dark:text-vgrBlue font-semibold">
            {isSaving ? i18n.t("utilities.saving") : i18n.t("utilities.saveChanges")}
          </Text>
        </Pressable>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showHelp}
        onRequestClose={() => setShowHelp(false)}
      >
        <HelpModal setShowHelp={setShowHelp} helpKey={helpKey} />
      </Modal>

      <Pressable
        className="bg-red-500 rounded-lg p-4 items-center mt-8 mb-20"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold">
          {i18n.t("utilities.logOut")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}