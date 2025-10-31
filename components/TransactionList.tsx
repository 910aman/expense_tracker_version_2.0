import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { TransactionListType, TransactionType } from "@/types";
import Typo from "./Typo";
import TransactionItem from "./TransactionItem";
import Loading from "./Loading";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {

  const router = useRouter();
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/TransactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image,
        walletId: item?.walletId,
      }
    })
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlatList
          data={data}
          scrollEnabled={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          // estimatedItemSize={200}
        />
      </View>

      {!loading && data.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}
      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
    marginTop: verticalScale(10),
    // backgroundColor: "#fff",
  },
  list: {
    minHeight: 3,
    marginTop: 10
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,

    // List the background
    backgroundColor: colors.neutral800,
    padding: spacingY._20,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});
