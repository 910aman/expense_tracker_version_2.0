import { Alert, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { BarChart } from "react-native-gifted-charts";
import Typo from "@/components/Typo";
import { useAuth } from "@/context/authContext";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transactionServices";
import Loading from "@/components/Loading";
import TransactionList from "@/components/TransactionList";

const barData = [
  {
    value: 40,
    label: "Mon",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        40
      </Typo>
    ),
  },
  {
    value: 20,
    frontColor: colors.rose,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        20
      </Typo>
    ),
  },
  {
    value: 40,
    label: "Mon",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        40
      </Typo>
    ),
  },
  {
    value: 20,
    frontColor: colors.rose,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        20
      </Typo>
    ),
  },
  {
    value: 50,
    label: "Tue",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        50
      </Typo>
    ),
  },
  {
    value: 40,
    frontColor: colors.rose,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        40
      </Typo>
    ),
  },
  {
    value: 40,
    label: "Mon",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        40
      </Typo>
    ),
  },
  {
    value: 20,
    frontColor: colors.rose,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        20
      </Typo>
    ),
  },
  {
    value: 20,
    frontColor: colors.rose,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        20
      </Typo>
    ),
  },
  {
    value: 50,
    label: "Tue",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        50
      </Typo>
    ),
  },

  {
    value: 40,
    frontColor: colors.rose,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        40
      </Typo>
    ),
  },
  {
    value: 40,
    label: "Mon",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        40
      </Typo>
    ),
  },

  {
    value: 20,
    frontColor: colors.rose,
    topLabelComponent: () => (
      <Typo size={8} style={{ marginBottom: 0 }} fontWeight={"bold"}>
        20
      </Typo>
    ),
  },
];

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testChart = []
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (activeIndex === 0) {
      getWeeklyStats();
    }
    if (activeIndex === 1) {
      getMonthlyStats();
    }
    if (activeIndex === 2) {
      getYearlyStats();
    }
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    // Get weekly stats
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const getMonthlyStats = async () => {
    // get Monthly Stats
    setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.msg);
    }
  };
  const getYearlyStats = async () => {
    // get Yearly Stats
    setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControlTab
            values={["Weekly", "Monthly", "Year"]}
            selectedIndex={activeIndex}
            onTabPress={(index) => setActiveIndex(index)}
            // tintColor={colors.neutral200}
            // backgroundCoulor={colors.neutral800}
            // appearance="dark"
            tabStyle={controlTabStyle.tabStyle}
            activeTabStyle={controlTabStyle.activeTabStyle}
            tabTextStyle={controlTabStyle.tabTextStyle}
            activeTabTextStyle={controlTabStyle.segmentFontStyle}
          />
          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix="₹"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={scale(50)}
                yAxisTextStyle={{ color: colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12),
                }}
                noOfSections={5}
                minHeight={5}
                // hideYAxisText
                // maxValue={100}
                //   isAnimated={true}
                //   animationDuration={1000}
              />
            ) : (
              <View style={styles.noChart} />
            )}
          </View>
          {chartLoading && (
            <View style={styles.chartLoadingContainer}>
              <Loading color={colors.white} />
            </View>
          )}

          {/* All Transactions according to data */}
          <View>
            <TransactionList
              title="Transactions"
              emptyListMessage="No transaction found"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const controlTabStyle = StyleSheet.create({
  tabStyle: {
    backgroundColor: colors.neutral600, // dark background for inactive tabs
    borderColor: colors.neutral700, // subtle border
    borderWidth: 1,
    paddingVertical: verticalScale(8),
    // borderRadius: radius._10,
  },

  activeTabStyle: {
    backgroundColor: colors.primary, // highlight active tab with your primary color
    borderColor: colors.primary,
  },

  tabTextStyle: {
    color: colors.neutral300, // light grey text for inactive tabs
    fontSize: scale(14),
    fontWeight: "500",
  },

  activeTabTextStyle: {
    color: colors.white, // white text for active tab
    fontSize: scale(14),
    fontWeight: "600",
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  header: {},
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
});
