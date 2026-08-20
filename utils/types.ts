import { TouchableOpacityProps } from "react-native";
import { Image } from "react-native-reanimated/lib/typescript/Animated";

export type UpdateUserProfile = {
  first_name?: string;
  last_name?: string;
  language?: string;
};

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  language: string | null;
};

export interface DailyDoseStatus {
  unitsTakenToday: number;
  unitsRemainingToday: number;
  nextDoseTime: Date | null;
  canTakeDoseNow: boolean;
}

export interface PlanConfig {
  N0: number;          // Initial daily doses (e.g., 20)
  r: number;           // Daily reduction rate (e.g., 0.05 to 0.08)
  T_awake: number;     // Awake hours per day (default: 16)
  day: number;         // Current day offset (0 = Day 1)
  previousNd?: number; // Dose count from previous day (for plateau checks)
  plateauDays?: number;// How many consecutive days we've been at this count
}

export interface DaySchedule {
  day: number;
  Nd: number;             // Target doses for today
  IdMinutes: number;      // Target interval in minutes
  plateauDays: number;    // Updated plateau counter
  timeSlots: string[];    // Array of ISO time strings or "HH:mm" targets
}

export interface HomeCountdownState {
  unitsTakenToday: number;
  unitsAllowedToday: number;
  unitsRemainingToday: number;
  secondsRemaining: number;
  canTakeDoseNow: boolean;
  nextDoseFormattedTime: string | null;
}
export interface HomeCountdownData {
  targetPouches: number;
  intervalMinutes: number;
  scheduleTimes: string[];
  unitsTakenToday: number;
  unitsRemainingToday: number;
  secondsRemaining: number;
  canTakeDoseNow: boolean;
  nextDoseFormattedTime: string | null;
}

export interface HomeCountdownTimerProps {
  initialData: HomeCountdownData;
}

export type User = {
  id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  first_time: boolean;
  language: string;
};

export type EventSource = {
  id: number;
  date: string;
  type: string;
  title: string;
  icon: Image;
};

export type EventProps = {
  id: string | null;
  date: Date | null;
  event_type: string | null;
  event_name: string | null;
  profile_id: string | null;
};

export interface MediaStore {
  getPhotoForAvatar?: boolean;
  selectedMedia: string | null;
  selectedMediaFile: string | null;
  setSelectedMedia: (file: string | null) => void;
  setSelectedMediaFile: (file: string | null) => void;
  userMediaFiles: ({ file }: { file: string }) => string | null;
  mediaData: mediaDataProps;
  setMediaData: (newData: mediaDataProps) => void;
  handleSelect: (fileUrl: string) => void;
  setGetPhotoForAvatar: (value: boolean) => void;
}

export interface UserStore {
  id: string | null;
  first_name: string;
  last_name: string;
  user_email: string;
  getUserData: (id: string) => Promise<void>;
  updateUser: (updates: Partial<UserStore>) => void;
  clearUser: () => void;
}

export interface FullViewModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  editUser: (
    id: string,
    firstname: string,
    lastname: string,
    email: string,
  ) => Promise<void>;
  /* fetchUserEntries: (limitEntries: boolean, id: string | null) => Promise<DiaryEntry[] | undefined>; */
  // Returns the updated user object or throws an error
  createTreatmentPlan: (formData: any) => Promise<void>;
};

export type OnboardingText = {
  title: string;
  paragraph: string;
  position: number;
};

/* export interface OnboardingData {
  consumptionType: "smoker" | "snus" | null;
  mgNicotinePerDay: number;
  unitsPerDay: number;
  aggressiveness: number; // 1-5
  useExternalTools: boolean;
  toolType: "patch" | "gum" | "none";
  toolStrength: string;
} */
export interface OnboardingData {
  // Core Consumption
  consumptionType: "smoker" | "snus" | null;
  mgNicotinePerDay: number;
  unitsPerDay: number;
  aggressiveness: number; // 1-5

  // General External Tools (Original)
  useExternalTools: boolean;
  toolType: "patch" | "gum" | "none";
  toolStrength: string;

  // Specific UI Tool State (Fixes your JSX errors)
  usePatch: boolean;
  patchStrength: number; // 21, 14, 7, or 0
  useGum: boolean;
  gumStrength: number;   // 4, 2, or 0

  // Algorithm & Schedule Fields
  awakeHours?: number;    // e.g., 16
  wakeUpTime?: string;    // e.g., "07:00"
  reductionRate?: number; // e.g., 0.06
  startDate?: string;     // ISO string
  endDate?: string;       // ISO string e.g., "2026-09-16"
}

export type VersionDescriptions = {
  version: string;
  paragraph: string;
  position: number;
};

export type mediaDataProps = {
  images: string[];
  drawings: string[];
  videos: string[];
};

export type AccountVersion = {
  version?: string;
  welcomeText?: string;
  questionButtonText?: string;
  diaryButtonText?: string;
  questionText?: string;
};

export type RoundCheckmarkProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export type CheckmarkOptions = {
  id: number;
  label: string;
};

export type TypographyProps = {
  children: React.ReactNode;
  variant?: "black" | "white" | "blue";
  weight?: "300" | "400" | "500" | "600" | "700";
  size?: "sm" | "md" | "lg" | "xl" | "h1" | "h2" | "h3";
  className?: string;
};


export interface ButtonProps extends TouchableOpacityProps {
  variant?: "black" | "blue" | "outlined" | "white";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

export type FilelikeObject = {
  uri: string;
  name: string;
  type: string;
};

export type MediaUpload = {
  type: string;
  url: string;
  uri?: string;
};
