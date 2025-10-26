import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { colors, radius, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useAuth } from "@/context/authContext";
import Typo from "@/components/Typo";
import { Image } from "expo-image";
import BackButton from "@/components/BackButton";
import { getProfileImage } from "@/services/ImageServices";
import * as Icons from "phosphor-react-native";
import { accountOptionType } from "@/types";
import Animated, { FadeInDown } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.UserIcon size={24} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Icons.GearSixIcon size={24} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.LockIcon size={24} color={colors.white} weight="fill" />,
      // routeName: '/(modals)/profileModal',
      bgColor: colors.rose,
    },
    {
      title: "Logout",
      icon: <Icons.PowerIcon size={24} color={colors.white} weight="fill" />,
      // routeName: '/(modals)/profileModal',
      bgColor: "#e11d48",
    },
  ];
  const handleLogout = async () => {
    // Add your logout logic here
    await signOut(auth);
  };

  const handlePress = (item: accountOptionType) => {
    if (item.title === "Logout") {
      Alert.alert(`${user?.name}`,"Are you sure you want to logout?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Logout"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => handleLogout(),
          style: "destructive",
        },
      ]);
    } else {
      // For other items, navigate to their route
      if (item.routeName) {
        router.push(item.routeName);
      }
    }
  };

  const showLogoutAlert = () => {
    // eslint-disable-next-line no-unused-expressions
    Alert.alert("Confirm", "Are you sure you want to logout?"),
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Logout"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => handleLogout(),
          style: "destructive",
        },
      ];
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Profile"
          leftIcon={<BackButton />}
          style={{ paddingHorizontal: 10 }}
        />
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View>
            {/* User Image */}
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* name & email */}

          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"}>
              {user?.name}
            </Typo>
            <Typo size={14} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* Account Options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(8)}
              key={index}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.flexRow}
                onPress={() => handlePress(item)}
              >
                <View
                  style={[styles.listIcon, { backgroundColor: item?.bgColor }]}
                >
                  {item.icon && item.icon}
                </View>

                <Typo
                  size={16}
                  fontWeight="500"
                  style={{ flex: 1 }}
                  color={colors.white}
                >
                  {item.title}
                </Typo>

                <Icons.CaretRightIcon
                  size={verticalScale(20)}
                  color={colors.white}
                  weight="bold"
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    backgroundColor: colors.neutral300,
    width: verticalScale(135),
    height: verticalScale(135),
    borderRadius: 200,
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: verticalScale(30),
    paddingHorizontal: verticalScale(30),
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._10,
  },
});
