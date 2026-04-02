import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import DiscoverScreen from "../screens/Discover/DiscoverScreen";
import EventsScreen from "../screens/Events/EventsScreen";
import MyBarsScreen from "../screens/MyBars/MyBarsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import NeonTabIcon from "../components/common/NeonTabIcon";
import NightOwlzIcon from "../components/common/NightOwlzIcon";
import SwipeTabWrapper from "./SwipeTabWrapper";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

const withSwipe = (Component) => {
  return function WrappedScreen(props) {
    return (
      <SwipeTabWrapper>
        <Component {...props} />
      </SwipeTabWrapper>
    );
  };
};

const DiscoverWithSwipe = withSwipe(DiscoverScreen);
const EventsWithSwipe = withSwipe(EventsScreen);
const MyBarsWithSwipe = withSwipe(MyBarsScreen);
const ProfileWithSwipe = withSwipe(ProfileScreen);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        animationEnabled: false,
        sceneContainerStyle: {
          backgroundColor: "#0a0a0a",
        },
        tabBarStyle: {
          position: "absolute",
          left: 24,
          right: 24,
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
        name="Events"
        component={EventsWithSwipe}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="calendar"
              label="Events"
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
      <Tab.Screen
        name="Profile"
        component={ProfileWithSwipe}
        options={{
          tabBarIcon: ({ focused }) => (
            <NightOwlzIcon
              size={48}
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
