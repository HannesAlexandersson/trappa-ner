import { HelpModal } from "@/components";
import Typography from "@/components/Typography";
import i18n from "@/constants/dictonarys/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable, TouchableOpacity, View } from "react-native";

interface DoseDetailsModalProps {
    handleSave: (skipDetails?: boolean) => void;
    submit: boolean;
    cravingLevel: number | null;
    setCravingLevel: (level: number) => void;
    onClose: () => void;
}

const DoseDetailsModal: React.FC<DoseDetailsModalProps> = ({
    handleSave,
    submit,
    cravingLevel,
    setCravingLevel,
    onClose,
}) => {
    const [showHelp, setShowHelp] = useState(false);
    const [helpKey, setHelpKey] = useState("");

    const openHelp = (key: string) => {
        setHelpKey(key);
        setShowHelp(true);
    };

    return (
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
            {/* Backdrop Dismiss */}
            <Pressable className="absolute inset-0" onPress={onClose} />

            {/* Main Modal Content Card */}
            <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl z-10">
                {/* Header Row with Help Icon */}
                <View className="flex-row justify-between items-center mb-2">
                    <View className="w-6" />
                    <Typography variant="black" size="lg" className="text-gray-900 text-center flex-1">
                        {i18n.t("home.countdownTimer.doseModal.title")}
                    </Typography>
                    <TouchableOpacity onPress={() => openHelp("logDoseHelp")}>
                        <Ionicons
                            name="information-circle-outline"
                            size={24}
                            color="#005b89"
                        />
                    </TouchableOpacity>
                </View>

                <Typography size="sm" className="text-grey500 mb-4 text-center">
                    {i18n.t("home.countdownTimer.doseModal.subTitle")}
                </Typography>

                {/* Craving Level Selector (1 - 5) */}
                <Typography weight="600" size="sm" className="text-gray-700 mb-2">
                    {i18n.t("home.countdownTimer.doseModal.cravingLabel")}
                </Typography>

                <View className="flex-row justify-between mb-6">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <Pressable
                            key={level}
                            onPress={() => setCravingLevel(level)}
                            className={`w-11 h-11 rounded-2xl items-center justify-center border ${cravingLevel === level
                                ? "bg-vgrBlue border-vgrBlue"
                                : "bg-grey50 border-grey200"
                                }`}
                        >
                            <Typography
                                weight="700"
                                className={cravingLevel === level ? "text-white" : "text-gray-700"}
                            >
                                {level}
                            </Typography>
                        </Pressable>
                    ))}
                </View>

                {/* Primary Action: Save with details */}
                <TouchableOpacity
                    onPress={() => handleSave(false)}
                    disabled={submit}
                    className="bg-vgrBlue py-3.5 rounded-2xl items-center mb-2 shadow-sm"
                >
                    {submit ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Typography weight="700" className="text-white text-base">
                            {i18n.t("home.countdownTimer.doseModal.saveButton")}
                        </Typography>
                    )}
                </TouchableOpacity>

                {/* Secondary Action: Skip details (Quick log) */}
                <TouchableOpacity
                    onPress={() => handleSave(true)}
                    disabled={submit}
                    className="bg-grey100 py-3.5 rounded-2xl items-center mt-2 border-hairline border-grey500"
                >
                    <Typography weight="600" className="text-grey600 text-base">
                        {i18n.t("home.countdownTimer.doseModal.skipButton")}
                    </Typography>
                </TouchableOpacity>
            </View>

            {/* Nested Help Tooltip Modal */}
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
};

export default DoseDetailsModal;