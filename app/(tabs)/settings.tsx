import HelpModal from "@/components/HelpModal";
import i18n from "@/constants/dictonarys/i18n";
import { updateUserProfile } from "@/lib/apiHelper";
import { useAuth } from "@/providers/authProviders";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (!user.id) return null;
      await updateUserProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
      });

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      Alert.alert("Error", "Could not update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    firstName !== (user.first_name ?? "") ||
    lastName !== (user.last_name ?? "");

  const openHelp = (key: string) => {
    setHelpKey(key);
    setShowHelp(true);
  };
  return (
    <View className="flex-1 p-6">
      <View className="flex flex-row justify-around">
        <Text className="text-3xl font-bold mb-8 font-roboto text-vgrBlue shadow-slate-300 shadow-lg">
          {i18n.t("settings.topHeader")}
        </Text>
        <TouchableOpacity onPress={() => openHelp("settingsHelp")}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#005b89"
          />
        </TouchableOpacity>
      </View>



      <Text className="text-base font-semibold mb-2">
        {i18n.t("settings.firstName")}
      </Text>

      <TextInput
        className="border border-grey300 rounded-lg p-3 mb-4"
        value={firstName}
        onChangeText={setFirstName}

      />

      <Text className="text-base font-semibold mb-2">
        {i18n.t("settings.lastName")}
      </Text>

      <TextInput
        className="border border-grey300 rounded-lg p-3 mb-4"
        value={lastName}
        onChangeText={setLastName}

      />

      <Text className="text-base font-semibold mb-2">
        {i18n.t("settings.email")}
      </Text>

      <TextInput
        className="border border-grey300 rounded-lg p-3 mb-6"
        value={user.email ?? ""}
        editable={false}
      />
      {hasChanges && (
        <Pressable
          className="bg-vgrBlue rounded-lg p-4 items-center"
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text className="text-white font-semibold">
            {isSaving ? "Saving..." : "Save changes"}
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
    </View>
  );
}