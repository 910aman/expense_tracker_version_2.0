import { StyleSheet, Text, TextStyle, View } from "react-native";
import React, { version } from "react";
import { colors } from "@/constants/theme";
import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {

    const textStyle: TextStyle = {
      fontSize: size? verticalScale(size) : verticalScale(18),
      color: color,
      fontWeight: fontWeight,
    };
    
  return (<Text style={[textStyle,style]} {...textProps}>{children}</Text>);
};

export default Typo;

const styles = StyleSheet.create({});
