import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo } from "react";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
// import TransactionList from "@/components/TransactionList";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { TransactionType } from "@/types";

import TransactionList from "@/components/TransactionList";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints = useMemo(() => [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ], [user?.uid]);

  const {
    data: recentTransaction,
    error,
    loading: trnasactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4, width: "90%" }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon} onPress={() => router.push("/(modals)/searchModal")}>
            <Icons.MagnifyingGlassIcon
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <HomeCard />
          </View>

          <TransactionList
            data={recentTransaction}
            loading={trnasactionsLoading}
            title="Recent Transactions"
            emptyListMessage="No Transactions added yet!"
          />
        </ScrollView>
        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/TransactionModal")}
        >
          <Icons.PlusIcon
            color={colors.black}
            weight="bold"
            size={verticalScale(24)}
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  list: {
    marginTop: 5,
    minHeight: 3,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "#fff",
  },
  searchIcon: {
    backgroundColor: colors.neutral500,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
    backgroundColor: colors.primary,
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
