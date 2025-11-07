import { ScrollView, StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import InputField from "@/components/Input";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import TransactionList from "@/components/TransactionList";

const SearchModal = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const constraints = useMemo(() => [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ], [user?.uid]);

  const {
    data: allTransactions,
    error,
    loading: trnasactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransaction = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description?.toLowerCase()?.includes(search?.toLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });
  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <View style={styles.inputContainer}>
          <InputField
            placeholder="Search..."
            placeholderTextColor={colors.neutral400}
            containerStyle={{ backgroundColor: colors.neutral800 }}
            value={search}
            onChangeText={(value) => setSearch(value)}
          />
        </View>
        <ScrollView contentContainerStyle={styles.form}>
          <View>
            <TransactionList
              loading={trnasactionsLoading}
              data={filteredTransaction}
              emptyListMessage="No transactions match your search keywords"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

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
    marginBottom: spacingY._15,
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
    marginBottom: spacingY._10,
  },
  imageInputContainer: {
    gap: spacingY._10,
    // flexDirection: ''
  },
});
