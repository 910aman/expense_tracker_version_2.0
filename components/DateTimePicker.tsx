import React, { useState } from "react";
import { Platform, View, Pressable, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TransactionType } from "@/types";
import { colors, radius, spacingY } from "@/constants/theme";
import Typo from "./Typo";
import { verticalScale } from "@/utils/styling";

export const CustomDateTimePicker = () => {
  const [show, setShow] = useState(false);
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const onChange = (event: any, selectedDate?: Date) => {
    // Android: user pressed cancel
    if (Platform.OS === "android" && event.type === "dismissed") {
      setShow(false);
      return;
    }

    if (selectedDate) {
      // setDate(selectedDate);
      setTransaction((prev) => ({ ...prev, date: selectedDate }));
    }

    // Close picker after selection (for Android)
    if (Platform.OS === "android") {
      setShow(false);
    }
  };

  const showMode = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      {/* <Button onPress={() => showMode()} title={date.toLocaleDateString()} /> */}
      {/* <Button onPress={() => showMode("time")} title="Show Time Picker" /> */}
      <Pressable style={styles.dateInput} onPress={() => showMode()}>
        <Typo size={14}>{(transaction.date as Date).toLocaleDateString()}</Typo>
      </Pressable>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          themeVariant="dark"
          value={transaction.date as Date}
          textColor={colors.white}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
});
