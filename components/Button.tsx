import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { CustomButtonProps } from "@/types";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Loading from "./Loading";

const Button = ({ style, onPress, loading, children }: CustomButtonProps) => {
  if (loading) {
    return (
      <View style={[style, styles.button]}>
        <Loading />
      </View>
    );
  }
  return (
    <TouchableOpacity
      style={[style, styles.button]}
      onPress={onPress}
      disabled={loading}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
});
