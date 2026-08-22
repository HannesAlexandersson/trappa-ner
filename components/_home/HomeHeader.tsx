import i18n from "@/constants/dictonarys/i18n";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export const HomeHeader = ({ first_name }: { first_name: string }) => {
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        // Hide the welcome message after 10 seconds (10000ms)
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 10000);

        // Clean up timer if component unmounts early
        return () => clearTimeout(timer);
    }, []);

    if (!showWelcome) return null;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text style={{ fontSize: 24 }} className="text-black font-roboto dark:text-white">
                {i18n.t("home.greeting", { name: first_name })}
            </Text>
        </View>
    );
};