import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";
import { gradients, surfaces, typography } from "../../theme";
import { useTheme } from "../../theme/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

const QUICK_ACTIONS = [
    {
        title: "Edit Bar Info",
        description: "Update your venue name, hours, photos, and location details.",
    },
    {
        title: "Manage Events",
        description: "Create, feature, and clean up upcoming events in one place.",
    },
    {
        title: "Specials & Offers",
        description: "Publish temporary promos and happy hour specials fast.",
    },
];

function formatLastUpdated(updatedAt) {
    if (!updatedAt) return "Last updated: not yet";

    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) return "Last updated: unknown";

    return `Last updated: ${date.toLocaleString()}`;
}

export default function OwnerDashboardScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { colors } = useTheme();
    const { role, user, token } = useAuth();
    const isOwner = role === "owner";
    const initialBarId = route.params?.barId || null;
    const [ownerBar, setOwnerBar] = useState(null);
    const displayName = user?.username?.trim() || "Bar Owner";
    const handle = user?.username?.trim()
        ? `@${user.username.trim().toLowerCase()}`
        : "@owner";

    useFocusEffect(
        useCallback(() => {
            let active = true;

            async function loadOwnerBar() {
                if (!user?.id) return;

                try {
                    const { data } = await api.get(`/bars/owner/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (active) {
                        setOwnerBar(data || null);
                    }
                } catch (_error) {
                    if (active) {
                        setOwnerBar(null);
                    }
                }
            }

            loadOwnerBar();

            return () => {
                active = false;
            };
        }, [token, user?.id]),
    );

    const activeBarId = ownerBar?._id || initialBarId || null;

    const actions = useMemo(() => {
        return QUICK_ACTIONS.map((action) => {
            if (action.title !== "Edit Bar Info") return action;

            if (ownerBar?.name) {
                const locationText = ownerBar.location ? ` - ${ownerBar.location}` : "";
                return {
                    ...action,
                    description: `${ownerBar.name}${locationText}`,
                    meta: formatLastUpdated(ownerBar.updatedAt),
                };
            }

            return {
                ...action,
                description: "Add your venue details to start your owner profile.",
                meta: formatLastUpdated(null),
            };
        });
    }, [ownerBar]);

    const handleActionPress = (title) => {
        if (title === "Edit Bar Info") {
            if (activeBarId) {
                navigation.navigate("OwnerEditBar", { barId: activeBarId });
            } else {
                navigation.navigate("OwnerEditBar");
            }
            return;
        }

        if (title === "Manage Events") {
            if (activeBarId) {
                navigation.navigate("OwnerManageEvents", {
                    barId: activeBarId,
                    barName: ownerBar?.name || "your venue",
                    verified: ownerBar?.verified ?? false,
                });
            } else {
                Alert.alert(
                    "Add your venue first",
                    "Create your bar in Edit Bar Info before adding events.",
                );
            }
            return;
        }

        if (title === "Specials & Offers") {
            Alert.alert("Coming soon", "Specials & offers are on the roadmap.");
        }
    };

    return (
        <NeonScreen gradient={gradients.settings}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
                alwaysBounceVertical={false}
                overScrollMode="never"
            >
                <ScreenTitleBlock
                    title="Owner Dashboard"
                    subtitle="Run your bar presence, events, and promos from one place"
                    colors={colors}
                    style={styles.headerContainer}
                />

                <View style={styles.heroCard}>
                    <Text style={[typography.subheading, styles.heroName]}>{displayName}</Text>
                    <Text style={[typography.caption, { color: colors.neonBlue }]}>{handle}</Text>
                    <View style={[styles.ownerBadge, { borderColor: colors.neonYellow }]}>
                        <Text style={[styles.ownerBadgeText, { color: colors.neonYellow }]}>OWNER</Text>
                    </View>
                    <Text style={[typography.body, styles.heroCopy]}>
                        Temporary control center for bar owners. This is the right place to
                        stage owner-only tools before full bar management ships.
                    </Text>
                </View>

                {!isOwner ? (
                    <View style={styles.noticeCard}>
                        <Text style={[typography.subheading, styles.noticeTitle]}>
                            Owner access required
                        </Text>
                        <Text style={[typography.body, styles.noticeCopy]}>
                            This preview is reserved for accounts signed in with the owner role.
                        </Text>
                        <NeonButton
                            title="Back To Profile"
                            onPress={() => navigation.goBack()}
                            style={styles.primaryButton}
                        />
                    </View>
                ) : (
                    <>
                        <View style={styles.metricsRow}>
                            <View style={styles.metricCard}>
                                <Text style={[typography.heading, styles.metricValue]}>3</Text>
                                <Text style={[typography.caption, styles.metricLabel]}>Draft Tools</Text>
                            </View>
                            <View style={styles.metricCard}>
                                <Text style={[typography.heading, styles.metricValue]}>1</Text>
                                <Text style={[typography.caption, styles.metricLabel]}>Bar Linked</Text>
                            </View>
                            <View style={styles.metricCard}>
                                <Text style={[typography.heading, styles.metricValue]}>Soon</Text>
                                <Text style={[typography.caption, styles.metricLabel]}>Live Analytics</Text>
                            </View>
                        </View>
                        <View style={styles.actionsWrap}>
                            {actions.map((action) => (
                                <Pressable
                                    key={action.title}
                                    onPress={() => handleActionPress(action.title)}
                                    android_ripple={{ color: "rgba(255,255,255,0.12)" }}
                                    style={({ pressed }) => [
                                        styles.actionCard,
                                        pressed && styles.actionCardPressed,

                                    ]}

                                    accessibilityRole="button"
                                >
                                    <Text style={[typography.subheading, styles.actionTitle]}>
                                        {action.title}
                                    </Text>
                                    <Text style={[typography.body, styles.actionCopy]}>
                                        {action.description}
                                    </Text>
                                    {action.meta ? (
                                        <Text style={[typography.caption, styles.actionMeta]}>
                                            {action.meta}
                                        </Text>
                                    ) : null}
                                </Pressable>
                            ))}
                        </View>

                        <NeonButton
                            title="Preview Public Bar Profile"
                            onPress={() =>
                                navigation.navigate("BarProfile", {
                                    bar: ownerBar
                                        ? {
                                              _id: ownerBar._id,
                                              name: ownerBar.name,
                                              neighborhood: ownerBar.location,
                                              openingHours: ownerBar.openingHours,
                                              phone: ownerBar.phone,
                                              website: ownerBar.website,
                                              lat: ownerBar.coordinates?.lat ?? undefined,
                                              lon: ownerBar.coordinates?.lng ?? undefined,
                                          }
                                        : undefined,
                                })
                            }
                            style={styles.primaryButton}
                        />
                        <NeonButton
                            title="Owner Settings"
                            onPress={() => navigation.navigate("SettingsScreen")}
                            style={styles.secondaryButton}
                        />
                    </>
                )}
            </ScrollView>
        </NeonScreen >
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    headerContainer: {
        marginTop: 0,
        marginBottom: 20,
    },
    heroCard: {
        ...surfaces.neonCard,
        alignItems: "center",
        paddingVertical: 24,
        paddingHorizontal: 18,
    },
    heroName: {
        textAlign: "center",
    },
    ownerBadge: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
    },
    ownerBadgeText: {
        ...typography.caption,
        letterSpacing: 0.8,
    },
    heroCopy: {
        marginTop: 14,
        textAlign: "center",
    },
    noticeCard: {
        ...surfaces.neonCard,
        marginTop: 16,
        paddingVertical: 22,
        paddingHorizontal: 18,
        alignItems: "center",
    },
    noticeTitle: {
        textAlign: "center",
    },
    noticeCopy: {
        marginTop: 8,
        textAlign: "center",
    },
    metricsRow: {
        flexDirection: "row",
        width: "100%",
        marginTop: 18,
        gap: 10,
    },
    metricCard: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(123, 223, 255, 0.22)",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        paddingVertical: 12,
        alignItems: "center",
    },
    metricValue: {
        fontSize: 24,
        lineHeight: 30,
    },
    metricLabel: {
        marginTop: 2,
        textAlign: "center",
    },
    actionsWrap: {
        marginTop: 18,
        gap: 12,
    },
    actionCard: {
        ...surfaces.neonCard,
        paddingVertical: 18,
        paddingHorizontal: 16,
    },
    actionCardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
    actionTitle: {
        marginBottom: 6,
    },
    actionCopy: {
        color: "#D7DEF5",
    },
    actionMeta: {
        marginTop: 8,
        color: "#9AB1E4",
    },
    primaryButton: {
        marginTop: 18,
    },
    secondaryButton: {
        marginTop: 12,
        marginBottom: 8,
    },
});