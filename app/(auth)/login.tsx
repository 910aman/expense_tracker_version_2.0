import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import ScreenWrapper from "@/components/ScreenWrapper";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import InputField from "@/components/Input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

const Login = () => {
  const pwdRef = useRef("");
  const emailRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { login: loginUser } = useAuth();
  const handleSubmit = async () => {
    // Handle login logic here
     try {
      const res = await loginUser(emailRef.current, pwdRef.current);
      console.log("Response:", res);

      // Check if login failed
      if (!res || !res.success) {
        Alert.alert("Login Failed", res?.msg || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>
          <InputField
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
              />
            }
          />

          <InputField
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (pwdRef.current = value)}
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
              />
            }
          />
          <Typo style={styles.forgotPassword} size={14} fontWeight={"500"}>
            Forgot Password?
          </Typo>

          <Button onPress={handleSubmit} loading={isLoading}>
            <Typo size={16} fontWeight={"600"} color={colors.white}>
              Login
            </Typo>
          </Button>

          {/* Footer */}
          <View style={styles.footer}>
            <Typo style={styles.footerText} size={15}>
              Don&apos;t have an account?
            </Typo>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Typo
                style={styles.footerText}
                size={15}
                fontWeight={"700"}
                color={colors.primary}
              >
                Sign Up
              </Typo>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
