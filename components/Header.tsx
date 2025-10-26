import { StyleSheet, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { HeaderProps } from "@/types";

const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  return (
  <View style={[styles.container, style]}>
    {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
    {title && (
        <Typo size={22}
        fontWeight={"600"}
        style={{
            textAlign: 'center',
            width: leftIcon ? "83%" : "100%"
        }}>
        {title}
        </Typo>
    )}
  </View>)
};

export default Header;

const styles = StyleSheet.create({
 container: {
    width: "100%",
    flexDirection: 'row',
    alignItems: "center",
  },
  leftIcon: {
    alignSelf: 'flex-start'
  }
});
