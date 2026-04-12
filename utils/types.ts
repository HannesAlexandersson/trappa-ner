import { Image } from "react-native-reanimated/lib/typescript/Animated";

export type User = {
  id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  first_time: boolean;
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
};

export type OnboardingText = {
  title: string;
  paragraph: string;
  position: number;
};

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

export type ButtonProps = {
  children: React.ReactNode;
  variant?: "black" | "blue" | "outlined" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
  onPress?: () => void;
};

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
