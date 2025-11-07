import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import { TransactionType, WalletType } from "@/types";
import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "@/components/ImageUpload";
import { deleteWallet } from "@/services/walletService";
import * as Icons from "phosphor-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { useAuth } from "@/context/authContext";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { CustomDateTimePicker } from "@/components/DateTimePicker";
import Input from "@/components/Input";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionServices";

const TransactionModal = () => {
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const query: any = useMemo(() => {
    return user?.uid
      ? [where("uid", "==", user.uid), orderBy("created", "desc")]
      : null;
  }, [user?.uid]);

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", query);

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId: string;
  };

  const oldTransaction: paramType = useLocalSearchParams();

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        description: oldTransaction?.description || "",
        category: oldTransaction.category || "",
        date: new Date(oldTransaction.date),
        walletId: oldTransaction.walletId,
        image: oldTransaction?.image || "",
      });
    }
  }, [oldTransaction?.id]);

  // useEffect(() => {
  //   if (!oldTransaction || !oldTransaction.id) return;
  //   setTransaction((prev) => ({
  //     ...prev,
  //     ...oldTransaction,
  //     amount: Number(oldTransaction.amount),
  //     date: new Date(oldTransaction.date),
  //   }));
  // }, [oldTransaction, oldTransaction.id]); // ✅ Only reacts when id changes, not on object reference change

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } =
      transaction;
    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields");
      return;
    }

    console.log("Goog to go");
    const transactionData = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
    };
    console.log("Transaction data", transactionData);

    if (oldTransaction?.id) transactionData.uid = oldTransaction.id;
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);

    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg ?? "Something went wrong");
    }
  };
  //     let { type, image } = transaction;
  //     if (!type.trim() || !image) {
  //       Alert.alert("Wallet", "Please fill all the fields");
  //       return;
  //     }

  //     const data: WalletType = {
  //       name,
  //       image,
  //       uid: user?.uid,
  //     };

  //     if (oldTransaction?.id) data.id = oldTransaction?.id;
  //     setLoading(true);
  //     // const res = await (data);
  //     const res = await createOrUpdateWallet(data);
  //     setLoading(false);
  //     if (res.success) {
  //       //Update user
  //       router.back();
  //     } else {
  //       Alert.alert("Wallet", res.msg);
  //     }
  //   };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;

    try {
      setLoading(true);
      const res = await deleteTransaction(
        oldTransaction.id,
        oldTransaction.walletId
      );
      setLoading(false);

      if (res?.success) {
        router.push("/(tabs)");
      } else {
        Alert.alert("Transaction", res?.msg || "Failed to delete wallet");
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
      "Are you sure you want to do delete this transaction?",
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
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={
            <BackButton style={{ backgroundColor: colors.neutral500 }} />
          }
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          {/* Transaction Type */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Transaction Type
            </Typo>
            {/* Dropdown */}
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              inputSearchStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              itemTextStyle={styles.dropdownItemText}
              activeColor={colors.neutral600}
              data={transactionTypes}
              value={transaction?.type}
              //   placeholder="Select Wallet"
              //   search
              maxHeight={300}
              labelField="label"
              valueField="value"
              onChange={(item) => {
                // setValue(item.value);
                // setIsFocus(false);
                setTransaction({ ...transaction, type: item.value || "" });
              }}
            />
          </View>

          {/* Wallet */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Wallet
            </Typo>
            {/* Dropdown */}
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              inputSearchStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              itemTextStyle={styles.dropdownItemText}
              activeColor={colors.neutral600}
              data={wallets.map((wallet) => ({
                label: `${wallet.name} (${wallet.amount})`,
                value: wallet?.id,
              }))}
              value={transaction?.walletId}
              placeholder="Select Wallet"
              maxHeight={300}
              labelField="label"
              valueField="value"
              onChange={(item) => {
                // setValue(item.value);
                // setIsFocus(false);
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
            />
          </View>

          {/* Expense Category Item */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Expense Category
              </Typo>
              {/* Dropdown */}
              <Dropdown
                style={styles.dropdownContainer}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                itemTextStyle={styles.dropdownItemText}
                activeColor={colors.neutral600}
                data={Object.values(expenseCategories)}
                placeholder="Select Category"
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({ ...transaction, category: item.value });
                }}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                <CustomDateTimePicker />
                {/* <DateTimePicker
                  testID="dateTimePicker"
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChange}
                /> */}
                {/* {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )} */}
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Amount
            </Typo>
            <Input
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/, "")),
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Description
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (Optional)
              </Typo>
            </View>
            <Input
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}>
                Receipt
              </Typo>
              <Typo color={colors.neutral500} size={14}>
                (Optional)
              </Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
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
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              paddingHorizontal: spacingX._15,
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
          loading={loading}
          style={{ flex: 1, backgroundColor: colors.primary }}
          onPress={onSubmit}
        >
          <Typo fontWeight={"700"} color={colors.black}>
            {oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    bottom: 20,
    backgroundColor: colors.neutral800,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
    gap: scale(12),
  },
  inputContainer: {
    gap: spacingY._10,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    // backgroundColor: colors.rose,
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingY._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.neutral400,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingHorizontal: spacingY._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },

  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },

  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },

  dropdownPlaceholder: {
    color: colors.white,
  },

  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
    color: colors.white,
  },

  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
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
  imageInputContainer: {
    gap: spacingY._10,
    // flexDirection: ''
  },
});
