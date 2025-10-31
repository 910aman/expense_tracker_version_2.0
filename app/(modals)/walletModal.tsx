import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import InputField from "@/components/Input";
import { WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/context/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageUpload from "@/components/ImageUpload";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import * as Icons from "phosphor-react-native";

const WalletModal = () => {
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
      });
    }
  }, [oldWallet]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log("result.assets Value = ", result.assets);

    if (!result.canceled) {
      //   setWallet({ ...wallet, image: result.assets[0].uri });
    }
  };

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };

    if (oldWallet?.id) data.id = oldWallet?.id;
    setLoading(true);
    // const res = await (data);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    if (res.success) {
      //Update user
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;

    try {
      setLoading(true);
      const res = await deleteWallet(oldWallet.id);
      setLoading(false);

      if (res?.success) {
        router.push("/(tabs)/wallet");
      } else {
        Alert.alert("Wallet", res?.msg || "Failed to delete wallet");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Delete wallet error:", error);
      Alert.alert("Wallet", "Something went wrong while deleting the wallet");
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this? \n This action will remove all the transactions related to this wallet",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <InputField
              placeholder="Wallet Name"
              value={wallet?.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Upload Image"
            />
          </View>
          {/* <InputField
              placeholder="Salary"
              value={wallet?.email}
              onChangeText={(value) => setWallet({ ...wallet, email: value })}
            />
          </View>
          <View style={styles.imageInputContainer}>
            <Typo color={colors.neutral200}>Proof of Transaction</Typo>
           */}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldWallet?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              paddingHorizontal: spacingX._15,
              // backgroundColor: colors.neutral900,
              backgroundColor: colors.rose,
            }}
          >
            <Icons.TrashIcon
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button
          onPress={onSubmit}
          loading={loading}
          style={{ flex: 1, backgroundColor: colors.primary }}
        >
          <Typo fontWeight={"700"} color={colors.black}>
            {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    bottom: 20,
    gap: scale(12),
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  imageInputContainer: {
    gap: spacingY._10,
    // flexDirection: ''
  },
});
