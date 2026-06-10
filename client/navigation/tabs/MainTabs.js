import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
import DiscoverScreen from "../../screens/Discover/DiscoverScreen";
import MyBarsScreen from "../../screens/MyBars/MyBarsScreen";
import NeonTabIcon from "../../components/common/NeonTabIcon";
import SwipeTabWrapper from "../SwipeTabWrapper";
import { colors } from "../../theme";

// Events tab hidden for MVP — events are owner-published and surfaced on the
// bar profile. Re-add to TAB_ORDER + a <Tab.Screen> once there's a discovery feed.
const TAB_ORDER = ["Discover", "MyBars"];
const Tab = createBottomTabNavigator();

const withSwipe = (Component) => {
  return function WrappedScreen(props) {
    return (
      <SwipeTabWrapper tabOrder={TAB_ORDER}>
        <Component {...props} />
      </SwipeTabWrapper>
    );
  };
};

const DiscoverWithSwipe = withSwipe(DiscoverScreen);
const MyBarsWithSwipe = withSwipe(MyBarsScreen);

export default function MainTabs() {
  return (
    <Tab.Navigator
      detachInactiveScreens={false}
      sceneContainerStyle={{ backgroundColor: "#0a0a0a" }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        animationEnabled: true,
        animation: "fade",
        freezeOnBlur: false,
        tabBarStyle: {
          position: "absolute",
          left: 24,
          width: SCREEN_WIDTH - 118,
          bottom: 14,
          height: 88,
          borderRadius: 28,
          backgroundColor: colors.navSurface,
          borderWidth: 1,
          borderColor: colors.navBorder,
          shadowColor: "#000000",
          shadowOpacity: 0.32,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 4,
        },
        tabBarBackground: () => (
          <View style={styles.bgWrap}>
            <BlurView
              intensity={28}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["rgba(123,223,255,0.10)", "rgba(123,223,255,0)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.topSheen}
            />
            <LinearGradient
              colors={[
                "rgba(255,122,26,0)",
                "rgba(255,122,26,0.14)",
                "rgba(255,79,216,0.08)",
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.bottomGlow}
            />
          </View>
        ),
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverWithSwipe}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="search"
              label="Discover"
              focused={focused}
              color={focused ? colors.neonYellow : colors.navInactive}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyBars"
        component={MyBarsWithSwipe}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="heart"
              label="Bars"
              focused={focused}
              color={focused ? colors.neonYellow : colors.navInactive}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bgWrap: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
  },
  bottomGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 42,
  },
  topSheen: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 22,
  },
});