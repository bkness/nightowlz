import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import DiscoverScreen from "../screens/Discover/DiscoverScreen";
import EventsScreen from "../screens/Events/EventsScreen";
import MyBarsScreen from "../screens/MyBars/MyBarsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import NeonTabIcon from "../components/common/NeonTabIcon";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  // Helper to get glow color by route name
  const getGlowColor = (routeName) => {
    switch (routeName) {
      case "Discover":
        return colors.glowYellow;
      case "Events":
        return colors.glowPink;
      case "MyBars":
        return colors.glowViolet; // more visible violet for Bars
      case "Settings":
        return colors.glowBlue;
      default:
        return colors.glowYellow;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 0,
          height: 120,
          borderRadius: 28,
          backgroundColor: "rgba(20,20,40,0.65)",
          borderWidth: 0,
          borderColor: colors.neonYellow,
          shadowColor: colors.glowYellow,
          shadowOpacity: 0.7,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 0 },
          // overflow: "hidden", // allow shadow/glow to show at corners
          shadowRadius: 36, // more pronounced glow
          shadowOpacity: 0.95,
          elevation: 16,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={40}
            tint="dark"
            style={{ flex: 1, borderRadius: 28 }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="search"
              label="Discover"
              focused={focused}
              color={focused ? colors.neonYellow : colors.muted}
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
              name="calendar"
              label="Events"
              focused={focused}
              color={focused ? colors.neonPink : colors.muted}
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
              name="heart"
              label="Bars"
              focused={focused}
              color={focused ? colors.neonOrange : colors.muted}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <NeonTabIcon
              name="person"
              label="Profile"
              focused={focused}
              color={focused ? colors.neonBlue : colors.muted}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
