import React from "react";
import { TextInput, StyleSheet } from "react-native";

type CustomTextInputProps = {
  value: string | undefined;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  style?: any;
};

const CustomTextInput = ({
  value,
  onChangeText,
  keyboardType,
  style,
  ...props
}: CustomTextInputProps) => {
  return (
    <TextInput
      value={value}
      keyboardType={keyboardType || "default"}
      onChangeText={onChangeText}
      style={[styles.input, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
});

export default CustomTextInput;
