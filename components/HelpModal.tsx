import i18n from "@/constants/dictonarys/i18n";
import { Pressable, View } from "react-native";
import Button from "./ButtonVariants";
import Typography from "./Typography";
interface HelpModalProps {
    setShowHelp: (state: boolean) => void;
    helpKey: string;
}
const HelpModal = ({ setShowHelp, helpKey }: HelpModalProps) => {




    return (

        <Pressable
            className="flex-1 bg-black/50 justify-center items-center p-6"
            onPress={() => setShowHelp(false)}
        >
            <View className="bg-white w-full rounded-3xl p-6 shadow-xl">
                <Typography weight="700" size="lg" variant="blue" className="mb-4">
                    {i18n.t(`help.${helpKey}.title`)}
                </Typography>

                <Typography size="md" className="text-grey600 mb-6">
                    {i18n.t(`help.${helpKey}.body`)}
                </Typography>

                <Button onPress={() => setShowHelp(false)} variant="blue">
                    <Typography variant="white" className="text-center">
                        {i18n.t(`help.${helpKey}.btnText`)}
                    </Typography>
                </Button>
            </View>
        </Pressable>

    )
}

export default HelpModal;