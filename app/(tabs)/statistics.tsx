import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";

const Statistics = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" leftIcon={<BackButton />} />
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
