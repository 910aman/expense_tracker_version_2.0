import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";

export default function CustomTab({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabbarIcons: any = {
    index: (isFoucsed: boolean) => (
      <Icons.HouseIcon
        size={verticalScale(30)}
        weight={isFoucsed ? "fill" : "regular"}
        color={isFoucsed ? colors.primary : colors.neutral400}
      />
    ),
    statistics: (isFoucsed: boolean) => (
      <Icons.ChartBarIcon
        size={verticalScale(30)}
        weight={isFoucsed ? "fill" : "regular"}
        color={isFoucsed ? colors.primary : colors.neutral400}
      />
    ),
    wallet: (isFoucsed: boolean) => (
      <Icons.WalletIcon
        size={verticalScale(30)}
        weight={isFoucsed ? "fill" : "regular"}
        color={isFoucsed ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFoucsed: boolean) => (
      <Icons.UserIcon
        size={verticalScale(30)}
        weight={isFoucsed ? "fill" : "regular"}
        color={isFoucsed ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    height: Platform.OS === "android" ? verticalScale(60) : verticalScale(70),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  buttons: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabbarItem: {
    marginBottom: Platform.OS === "android" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
  },
});
