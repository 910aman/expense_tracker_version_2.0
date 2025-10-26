import CustomTab from "@/components/CustomTabs";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    // <ScreenWrapper>
    <Tabs
      tabBar={(props) => <CustomTab {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
      {/* Add other tabs here */}
    </Tabs>
    // </ScreenWrapper>
  );
}
