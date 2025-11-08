import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { ImageBackground } from "expo-image";
import Typo from "./Typo";
import * as Icons from "phosphor-react-native";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

const HomeCard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const constraints = useMemo(
    () => [where("uid", "==", user?.uid), orderBy("created", "desc")],
    [user?.uid]
  );

  const query: any = user?.uid ? constraints : null;

  const {
    data: wallets,
    error,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", query);

  const cleanNumber = (value: any) => {
    return Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTotals = () => {
    if (!wallets?.length) return { balance: 0, income: 0, expense: 0 };
    // console.log("====================================");
    // console.log("Wallets", wallets);
    // console.log("====================================");
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance += cleanNumber(item.amount) || 0;
        totals.income += cleanNumber(item.totalIncome) || 0;
        totals.expense += cleanNumber(item.totalExpense) || 0;
        return totals;
      },
      { balance: 0, income: 0, expense: 0 }
    );
  };
  const totals = useMemo(() => getTotals(), [getTotals]);

  return (
    <ImageBackground
      source={require("../images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/statistics")}
        style={styles.container}
      >
        <View>
          {/* total balance */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} size={17} fontWeight={"600"}>
              Total Balance
            </Typo>
            <Icons.DotsThreeOutlineIcon
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"bold"}>
            ₹ {walletLoading ? "-----" : totals?.balance?.toFixed(2)}
          </Typo>
        </View>
        <View style={styles.stats}>
          {/* Income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUpIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo fontWeight={"700"} size={16} color={colors.neutral700}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight={"600"}>
                ₹ {walletLoading ? "-----" : totals?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>
          {/* Expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDownIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo fontWeight={"600"} size={16} color={colors.neutral700}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.rose} fontWeight={"600"}>
                ₹ {walletLoading ? "-----" : totals?.expense?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral300,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
