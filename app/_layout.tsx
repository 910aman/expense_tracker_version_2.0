import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(modals)/profileModal" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
