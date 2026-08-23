import { ButtonProps } from "@/utils/types";
import { cn } from "@/utils/utils";
import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

const buttonVariants = {
  black: "bg-black border border-black",
  blue: "bg-vgrBlue border border-vgrBlue",
  outlined: "bg-white border border-black active:bg-blue active:text-white",
  white: "bg-white border border-white",
  darkThemedSelected: "bg-darkSurface border border-white",
  darkThemedUnselected: "bg-semiDarkBg border-white text-darkTextSecondary"
};

const buttonSizes = {
  sm: "px-2 py-2",
  md: "px-4 py-2",
  lg: "px-5 py-4",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "outlined",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  onPress,
  ...props
}) => {
  const isInteractionDisabled = disabled || loading;

  const spinnerColor =
    variant === "black" || variant === "blue" ? "#FFFFFF" : "#000000";

  return (
    <TouchableOpacity
      disabled={isInteractionDisabled}
      className={cn(
        buttonVariants[variant],
        buttonSizes[size],
        "rounded-lg items-center justify-center flex-row",
        isInteractionDisabled ? "opacity-50" : "",
        className,
      )}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;