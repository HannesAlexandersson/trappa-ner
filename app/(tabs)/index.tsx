import i18n from "@/constants/dictonarys/i18n";
import { useUserStore } from "@/stores";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { first_name } = useUserStore();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>
        {i18n.t("home.greeting", { name: first_name })}
      </Text>
    </View>
  );
}
