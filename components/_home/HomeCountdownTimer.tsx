import Typography from "@/components/Typography";
import i18n from "@/constants/dictonarys/i18n";
import { useAuth } from "@/providers/authProviders";
import { logDoseTaken } from "@/services/treatmentPlanService";
import { HomeCountdownData, HomeCountdownTimerProps } from "@/utils/types";
import { formatTime } from "@/utils/utils";
import React, { useEffect, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import DoseDetailsModal from "./DoseDetailsModal";

export const HomeCountdownTimer: React.FC<HomeCountdownTimerProps> = ({ initialData }) => {
    // Global states
    const { user } = useAuth();

    // Local states
    const [cravingLevel, setCravingLevel] = useState<number | null>(null);
    const [data, setData] = useState<HomeCountdownData>(initialData);
    const [submitting, setSubmitting] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(initialData.secondsRemaining);

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Hooks
    useEffect(() => {
        setData(initialData);
        setSecondsLeft(initialData.secondsRemaining);
    }, [initialData]);

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const timer = setInterval(() => {
            setSecondsLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    // Handlers
    const handleSaveDose = async (skipDetails = false) => {
        if (!user?.id || submitting) return;
        setSubmitting(true);

        try {
            const extraData = skipDetails
                ? {}
                : { craving_level: cravingLevel };

            // Calls logDoseTaken which chains the dose times and updates DB
            const updatedData = await logDoseTaken(user.id, extraData);

            setData(updatedData);
            setSecondsLeft(updatedData.secondsRemaining);

            setIsModalVisible(false);
            setCravingLevel(null);
        } catch (err) {
            console.error("Failed to log dose:", err);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <View className="p-6 bg-white dark:bg-grey500 rounded-3xl border border-grey100 dark:border-grey400 items-center justify-center shadow-sm my-4">
            <Typography variant="black" size="sm" className="text-grey400 dark:text-white uppercase tracking-widest mb-2">
                {i18n.t("home.countdownTimer.nextDoseInterval")}
            </Typography>

            {/* Main Countdown Header */}
            {secondsLeft > 0 ? (
                <Typography variant="black" size="h1" weight="700" className=" font-extrabold text-blue-600 dark:text-[#85a8f2] my-2">
                    {formatTime(secondsLeft)}
                </Typography>
            ) : (
                <View className="items-center my-2 w-full">
                    <Typography variant="black" className="text-2xl font-extrabold text-green-600 dark:text-green-300 mb-3 text-center">
                        {i18n.t("home.countdownTimer.canTakeNextDose")}
                    </Typography>

                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        activeOpacity={0.8}
                        className="bg-green-600 dark:bg-green-500 px-6 py-3 rounded-2xl w-full items-center justify-center shadow-sm"
                    >
                        <Typography weight="700" className="text-white text-base">
                            {i18n.t("home.countdownTimer.takeDoseButton")}
                        </Typography>
                    </TouchableOpacity>
                </View>
            )}

            {/* Primary Subtext */}
            {secondsLeft > 0 && (
                <Typography size="sm" className="text-grey600 dark:text-white mt-1 mb-4 text-center">
                    {secondsLeft < 3600
                        ? i18n.t("home.countdownTimer.hoursLeftToNextDose")
                        : i18n.t("home.countdownTimer.hoursLeftToNextDoseOverOneHour", {
                            hours: Math.ceil(secondsLeft / 3600),
                        })}
                    {data.nextDoseFormattedTime ? ` (${data.nextDoseFormattedTime})` : ""}.
                </Typography>
            )}

            {/* Secondary Stats Row */}
            <View className="mt-4 pt-4 border-t border-grey100 w-full flex-row justify-around">
                <Typography size="sm" className="text-grey500 dark:text-white">
                    {i18n.t("home.countdownTimer.todayTaken")}
                    <Typography size="sm" weight="700" className="text-gray-800 dark:text-white">{data.unitsTakenToday}</Typography>
                </Typography>
                <Typography size="sm" className="text-grey500 dark:text-white">
                    {i18n.t("home.countdownTimer.remainingToday")}
                    <Typography size="sm" weight="700" className="text-gray-800 dark:text-white">{data.unitsRemainingToday}</Typography>
                </Typography>
            </View>

            {/* Dose Details Modal */}
            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <DoseDetailsModal
                    handleSave={handleSaveDose}
                    submit={submitting}
                    cravingLevel={cravingLevel}
                    setCravingLevel={setCravingLevel}
                    onClose={() => setIsModalVisible(false)}
                />
            </Modal>
        </View>
    );
};