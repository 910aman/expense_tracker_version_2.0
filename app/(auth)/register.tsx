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

const Register = () => {
  const pwdRef = useRef("");
  const emailRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    // Handle login logic here
    if (!emailRef.current || !pwdRef.current || !nameRef.current) {
      Alert.alert("Sign Up", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      nameRef.current,
      emailRef.current,
      pwdRef.current
    );
    console.log("Responses", res);
    if(!res.success){
      Alert.alert("Sign Up", res.msg || "An error occurred during sign up");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Let&apos;s
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track your expenses
          </Typo>
          <InputField
            placeholder="Enter your name"
            onChangeText={(value) => (nameRef.current = value)}
            icon={
              <Icons.UserIcon
                size={verticalScale(26)}
                color={colors.neutral300}
              />
            }
          />
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

          <Button onPress={handleSubmit} loading={isLoading}>
            <Typo size={16} fontWeight={"600"} color={colors.white}>
              Sign Up
            </Typo>
          </Button>

          {/* Footer */}
          <View style={styles.footer}>
            <Typo style={styles.footerText} size={15}>
              Already have an account?
            </Typo>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Typo
                style={styles.footerText}
                size={15}
                fontWeight={"700"}
                color={colors.primary}
              >
                Login
              </Typo>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

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
