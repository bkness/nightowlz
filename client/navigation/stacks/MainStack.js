import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "../tabs/MainTabs";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import BarProfileScreen from "../../screens/BarProfile/BarProfileScreen";
import OwnerDashboardScreen from "../../screens/Owner/OwnerDashboardScreen";
import OwnerEditBarScreen from "../../screens/Owner/OwnerEditBarScreen";
import MyBarsScreen from "../../screens/MyBars/MyBarsScreen";
import DiscoverScreen from "../../screens/Discover/DiscoverScreen";
import { baseStackScreenOptions } from "../options/stackOptions";

const Stack = createNativeStackNavigator();

export default function MainStack() {
    return (
        <Stack.Navigator screenOptions={baseStackScreenOptions}>
            <Stack.Screen
                name="HomeTabs"
                component={MainTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Discover"
                component={DiscoverScreen}
                options={{
                    title: "Discover",
                    animation: "fade_from_bottom",
                }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: "Profile",
                }}
            />
            <Stack.Screen
                name="BarProfile"
                component={BarProfileScreen}
                options={{
                    title: "Bar Profile",
                    headerBackTitle: "Back",
                    animation: "fade_from_bottom",
                }}
            />
            <Stack.Screen
                name="MyBars"
                component={MyBarsScreen}
                options={{
                    title: "My Bars",
                    headerBackTitle: "Back",
                    animation: "fade_from_bottom",
                }}
            />
            <Stack.Screen
                name="OwnerDashboard"
                component={OwnerDashboardScreen}
                options={{
                    title: "Owner Dashboard",
                    animation: "fade_from_bottom",
                }}
            />
            <Stack.Screen
                name="OwnerEditBar"
                component={OwnerEditBarScreen}
                options={{
                    title: "Edit Bar",
                    animation: "fade_from_bottom",
                }}
            />
        </Stack.Navigator>
    );
}