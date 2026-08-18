import i18n from "@/constants/dictonarys/i18n";
import { useAuth } from "@/providers/authProviders";
import { useUserStore } from "@/stores";
import React from "react";
import { Text, View } from "react-native";

export default function HomeScreen() {
  //Context
  const { user } = useAuth();
  const { first_name } = useUserStore();

  // handle back button behavior
  /*   useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (user?.first_time === false) {
          // Show alert when back button is pressed
          Alert.alert(
          i18n.t("home.alerts.backWarning"),
            [
              {
                text: i18n.t("home.alerts.no"),
                onPress: () => null, //do nothing IE stay on the home screen
                style: "cancel",
              },
              {
                text: i18n.t("home.alerts.yes"),
                onPress: () => BackHandler.exitApp(), //close the app
              },
            ],
            { cancelable: false },
          );
          return true;
        }
        return false;
      };

      const backSubscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        backSubscription.remove();
      };
    }, [user]),
  ); */

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>
        {i18n.t("home.greeting", { name: first_name })}
      </Text>
    </View>
  );
}
