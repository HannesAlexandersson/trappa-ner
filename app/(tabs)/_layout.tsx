import i18n from "@/constants/dictonarys/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        headerShown: true,
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
          fontFamily: "Roboto",
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
              color="#005b89"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: i18n.t("tabs.account"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              size={24}
              color="#005b89"
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
              <Ionicons name="flash" size={40} color="white" />
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
        name="help"
        options={{
          title: i18n.t("tabs.help"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "help" : "help-outline"}
              size={24}
              color="#005b89"
            />
          ),
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
              color="#005b89"
            />
          ),
        }}
      />
    </Tabs>
  );
}
