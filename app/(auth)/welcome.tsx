import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

const welcomeImage = "../../images/welcome.png";

const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Typo size={16} color={colors.neutral100} fontWeight="700">
            Sign in
          </Typo>
        </TouchableOpacity>
        <Animated.Image
          entering={FadeIn.duration(800)}
          source={require(welcomeImage)}
          style={styles.welcomeImage}
          resizeMode="contain"
        />
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000)}
            style={{ alignItems: "center" }}
          >
            <Typo size={24} color={colors.white} fontWeight="600">
              Always take control
            </Typo>
            <Typo size={24} color={colors.white} fontWeight="600">
              of your finances
            </Typo>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
            style={{ alignItems: "center", gap: 1 }}
          >
            <Typo size={17} color={colors.textLight}>
              Finances must be arranged to set a better
            </Typo>
            <Typo size={17} color={colors.textLight}>
              lifestyle in future.
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
            style={styles.buttonContainer}
          >
            {/* Button Component */}
            <Button
              onPress={() => router.push("/(tabs)/profile")}
              style={{ backgroundColor: colors.primary }}
            >
              <Typo size={22} color={colors.neutral900} fontWeight="600">
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
    backgroundColor: colors.neutral900,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    justifyContent: "center",
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingY._20,
  },
  footer: {
    backgroundColor: colors.neutral700,
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(35),
    gap: spacingY._15,
    alignItems: "center",
    shadowColor: "#dddddd",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._20,
  },
});
