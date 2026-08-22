import i18n from "@/constants/dictonarys/i18n";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeStore } from "@/stores/themeStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";


export default function TabLayout() {
  const systemTheme = useColorScheme();
  const theme = useThemeStore((state) => state.theme);

  const activeTheme =
    theme === "system"
      ? systemTheme ?? "light"
      : theme;


  // WHEN ADS ARE ADDED
  /* const AD_PADDING = 10;
  const MAX_AD_HEIGHT = 80;

  const headerHeight = Math.min(
    adHeight + AD_PADDING,
    MAX_AD_HEIGHT
  );
 */
  /* Let the header height be dynamic depening on the ad height up to a ceiling max value. */
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",

        headerStyle: {
          backgroundColor: Colors[activeTheme].headerBackground,
          // WHENWE HAVE ADS USE THE DYNAMIC HEIGHT SYSTEM
          // height: headerHeight,
        },

        tabBarActiveTintColor: Colors[activeTheme].tabIcon,
        tabBarInactiveTintColor: Colors[activeTheme].tabIcon,

        tabBarStyle: {
          backgroundColor: Colors[activeTheme].tabBackground,
        },

        sceneStyle: {
          backgroundColor: Colors[activeTheme].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t("tabs.home"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={24}
              color={Colors[activeTheme].tabIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: i18n.t("tabs.plan"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              size={24}
              color={Colors[activeTheme].tabIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          title: i18n.t("tabs.panic"),
          headerTitle: i18n.t("tabs.panic"),
          tabBarIcon: () => (
            <View
              style={{
                top: -20, // Pushes the button UP out of the bar
                height: 73,
                width: 73,
                borderRadius: 35,
                backgroundColor: "#FF0600",
                justifyContent: "center",
                alignItems: "center",
                // Shadow for iOS
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                // Elevation for Android
                elevation: 7,
              }}
            >
              <Ionicons name="medkit-sharp" size={40} color="white" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/abstinence");
          },
        }}
      />
      <Tabs.Screen
        name="forum/index"
        options={{
          title: i18n.t("tabs.forum"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={24}
              color={Colors[activeTheme].tabIcon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="forum/[categoryId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="forum/thread/[threadId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t("tabs.settings"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={Colors[activeTheme].tabIcon}
            />
          ),
        }}
      />
    </Tabs>
  );
}
