import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiscoverScreen from "../screens/Discover/DiscoverScreen";
import EventsScreen from "../screens/Events/EventsScreen";
import MyBarsScreen from "../screens/MyBars/MyBarsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import NeonTabIcon from "../components/common/NeonTabIcon";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 6,
        },
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
              label="My Bars"
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
