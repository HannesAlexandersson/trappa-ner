import { HelpModal, Typography } from "@/components";
import i18n from "@/constants/dictonarys/i18n";
import { useForumStore } from "@/stores/forumStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, TouchableOpacity, View } from "react-native";

export default function ForumScreen() {
  // global states
  const {
    categories,
    isLoadingCategories,
    fetchCategories,
  } = useForumStore();


  // Local states
  const [showHelp, setShowHelp] = useState(false);
  const [helpKey, setHelpKey] = useState("");

  // hooks
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handlers
  const openHelp = (key: string) => {
    setHelpKey(key);
    setShowHelp(true);
  };

  if (isLoadingCategories) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 p-6">
      <View className="flex-row justify-between ">
        <Typography size="h1" weight="700" className="mb-8 text-vgrBlue font-roboto">
          {i18n.t("forum.header")}
        </Typography>
        <TouchableOpacity onPress={() => openHelp("forumBasicHelp")}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#005b89"
          />
        </TouchableOpacity>
      </View>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() =>
            router.push({
              pathname: "/forum/[categoryId]",
              params: {
                categoryId: category.id,
              },
            })
          }
          className="border border-grey300 rounded-lg p-5 mb-4"
        >
          <Typography size="lg" weight="600">
            {i18n.t(`forum.categories.${category.slug}`)}
          </Typography>
        </Pressable>
      ))}

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