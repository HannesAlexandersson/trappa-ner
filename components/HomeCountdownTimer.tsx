import Typography from "@/components/Typography";
import i18n from "@/constants/dictonarys/i18n";
import { HomeCountdownTimerProps } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { View } from "react-native";



export const HomeCountdownTimer: React.FC<HomeCountdownTimerProps> = ({ initialData }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialData.secondsRemaining);

    useEffect(() => {
        setSecondsLeft(initialData.secondsRemaining);
    }, [initialData.secondsRemaining]);

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const timer = setInterval(() => {
            setSecondsLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    // Format seconds into HH:MM:SS
    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        }
        return `${mins}m ${secs}s`;
    };

    return (
        <View className="p-6 bg-white rounded-3xl border border-gray-100 items-center justify-center shadow-sm my-4">
            <Typography variant="black" size="sm" className="text-gray-400 uppercase tracking-widest mb-2">
                {i18n.t("home.countdownTimer.nextDoseInterval")}
            </Typography>

            {/* Main Countdown Header */}
            {secondsLeft > 0 ? (
                <Typography variant="black" className="text-4xl font-extrabold text-blue-600 my-2">
                    {formatTime(secondsLeft)}
                </Typography>
            ) : (
                <Typography variant="black" className="text-3xl font-extrabold text-green-600 my-2">
                    {i18n.t("home.countdownTimer.canTakeNextDose")}
                </Typography>
            )}

            {/* Primary Subtext */}
            {secondsLeft > 0 && (
                <Typography size="sm" className="text-gray-600 mt-1 mb-4 text-center">
                    {i18n.t("home.countDownTimer.hoursLeftToNextDose", {
                        hours: Math.ceil(secondsLeft / 3600)
                    })}
                    {initialData.nextDoseFormattedTime ? ` (${initialData.nextDoseFormattedTime})` : ""}.
                </Typography>
            )}

            {/* Secondary Stats Row */}
            <View className="mt-4 pt-4 border-t border-gray-100 w-full flex-row justify-around">
                <Typography size="sm" className="text-gray-500">
                    {i18n.t("home.countdownTimer.todayTaken")}<Typography size="sm" weight="700" className="text-gray-800">{initialData.unitsTakenToday}</Typography>
                </Typography>
                <Typography size="sm" className="text-gray-500">
                    {i18n.t("home.countdownTimer.remainingToday")}<Typography size="sm" weight="700" className="text-gray-800">{initialData.unitsRemainingToday}</Typography>
                </Typography>
            </View>
        </View>
    );
};