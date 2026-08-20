import i18n, { translations } from "@/constants/dictonarys/i18n";
import { getLocales } from "expo-localization";
import Toast from "react-native-toast-message";
import { EventProps } from "./types";


export const setUserLocale = (language: string | null) => {
  if (language && language in translations) {
    i18n.locale = language;
    return;
  }

  const systemLocale = getLocales()[0]?.languageCode;

  if (systemLocale && systemLocale in translations) {
    i18n.locale = systemLocale;
    return;
  }

  i18n.locale = "en";
};

//format date strings
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format seconds into HH:MM:SS
export const formatTime = (totalSeconds: number) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
};

//utility function to combine class names
export const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// Helper function to convert Base64 string to Blob
export const base64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64.split(",")[1]); // Decode Base64
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};

// Function to show the notification
export const showNotification = (newEvent: EventProps) => {
  Toast.show({
    type: "success",
    text1: "Nytt meddelande!",
    text2: "Du har fått ett nytt svar på en fråga.",
    position: "top",
  });
};

export const truncateText = (text: string, length: number) => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const timeOptions = [
  "05:00", "05:30", "06:00", "06:30",
  "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00",
];