import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet } from "react-native";
import DiscoverScreen from "../screens/Discover/DiscoverScreen";
import EventsScreen from "../screens/Events/EventsScreen";
import MyBarsScreen from "../screens/MyBars/MyBarsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import NeonTabIcon from "../components/common/NeonTabIcon";
import LoginScreen from "../screens/Auth/LoginScreen";
import { colors } from "../theme";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const SPECKLES = [
  { left: "10%", top: 8, size: 4, opacity: 0.55 },
  { left: "18%", top: 16, size: 3, opacity: 0.42 },
  { left: "25%", top: 10, size: 5, opacity: 0.35 },
  { left: "36%", top: 18, size: 4, opacity: 0.58 },
  { left: "49%", top: 12, size: 3, opacity: 0.48 },
  { left: "61%", top: 15, size: 4, opacity: 0.4 },
  { left: "72%", top: 9, size: 5, opacity: 0.5 },
  { left: "84%", top: 16, size: 3, opacity: 0.44 },
];

function TabBarAtmosphere() {
  return (
    <View style={styles.bgWrap} pointerEvents="none">
      <LinearGradient
        colors={[
          "rgba(255, 64, 0, 0.12)",
          "rgba(255, 136, 0, 0.1)",
          "rgba(255, 90, 40, 0.06)",
          "rgba(0,0,0,0)",
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.speckleGlow}
      />
      {SPECKLES.map((dot, idx) => (
        <View
          key={idx}
          style={[
            styles.speck,
            {
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
            },
          ]}
        />
      ))}
      <BlurView intensity={48} tint="dark" style={styles.blur} />
    </View>
  );
}

export default function TabNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 14,
          height: 78,
          borderRadius: 24,
          backgroundColor: "rgba(20, 12, 38, 0.84)",
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.glowPurple,
          shadowOpacity: 0.38,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 0 },
          elevation: 10,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarBackground: () => <TabBarAtmosphere />,
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="beer-outline"
              label="Discover"
              focused={focused}
              color={focused ? colors.neonOrange : colors.muted}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="calendar-outline"
              label="Events"
              focused={focused}
              color={focused ? colors.neonOrange : colors.muted}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyBars"
        component={MyBarsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="ticket-outline"
              label="Bars"
              focused={focused}
              color={focused ? colors.neonOrange : colors.muted}
            />
          ),
        }}
      />
      <Tab.Screen
        name={user ? "Profile" : "Login"}
        component={user ? ProfileScreen : LoginScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name={user ? "person-outline" : "log-in-outline"}
              label={user ? "Profile" : "Login"}
              focused={focused}
              color={focused ? colors.neonOrange : colors.muted}
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
    borderRadius: 24,
    overflow: "hidden",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  speckleGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  speck: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FF8F2D",
    shadowColor: "#FF5722",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
