import { useRef } from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainTabs from "../tabs/MainTabs";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import BarProfileScreen from "../../screens/BarProfile/BarProfileScreen";
import OwnerDashboardScreen from "../../screens/Owner/OwnerDashboardScreen";
import OwnerEditBarScreen from "../../screens/Owner/OwnerEditBarScreen";
import OwnerManageEventsScreen from "../../screens/Owner/OwnerManageEventsScreen";
import MyBarsScreen from "../../screens/MyBars/MyBarsScreen";
import DiscoverScreen from "../../screens/Discover/DiscoverScreen";
import SearchFAB from "../../components/search/SearchFAB";
import GlobalSearchSheet from "../../components/search/GlobalSearchSheet";
import AppDrawerContent from "../../components/navigation/AppDrawerContent";
import OwlMenuButton from "../../components/navigation/OwlMenuButton";
import { baseStackScreenOptions } from "../options/stackOptions";
import colors from "../../theme/colors";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainTabsWithSearch() {
    const sheetRef = useRef(null);
    return (
        <View style={{ flex: 1 }}>
            <MainTabs />
            <OwlMenuButton />
            <SearchFAB onPress={() => sheetRef.current?.expand()} />
            <GlobalSearchSheet ref={sheetRef} />
        </View>
    );
}

function HomeTabsWithDrawer() {
    return (
        <Drawer.Navigator
            id="AppDrawer"
            drawerContent={(props) => <AppDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: "front",
                drawerPosition: "left",
                drawerStyle: {
                    width: 300,
                    backgroundColor: colors.background,
                },
                overlayColor: "rgba(0,0,0,0.6)",
                swipeEdgeWidth: 28,
            }}
        >
            <Drawer.Screen name="Tabs" component={MainTabsWithSearch} />
        </Drawer.Navigator>
    );
}

export default function MainStack() {
    return (
        <Stack.Navigator screenOptions={baseStackScreenOptions}>
            <Stack.Screen
                name="HomeTabs"
                component={HomeTabsWithDrawer}
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
            <Stack.Screen
                name="OwnerManageEvents"
                component={OwnerManageEventsScreen}
                options={{
                    title: "Manage Events",
                    animation: "fade_from_bottom",
                }}
            />
        </Stack.Navigator>
    );
}
