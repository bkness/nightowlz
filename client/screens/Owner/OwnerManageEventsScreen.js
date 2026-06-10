import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NeonScreen from "../../components/common/NeonScreen";
import NeonButton from "../../components/common/NeonButton";
import ScreenTitleBlock from "../../components/common/ScreenTitleBlock";
import useSafeScreenPadding from "../../hooks/useSafeScreenPadding";
import { gradients, surfaces, typography, colors } from "../../theme";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = [
    { key: "live-music", label: "Live Music" },
    { key: "karaoke", label: "Karaoke" },
    { key: "trivia", label: "Trivia" },
    { key: "happy-hour", label: "Happy Hour" },
    { key: "dj", label: "DJ" },
    { key: "other", label: "Other" },
];

const EMPTY_FORM = {
    title: "",
    description: "",
    category: "other",
    startsAt: "",
    endsAt: "",
};

// Parses "YYYY-MM-DD HH:MM" (24h) into a Date, or null if invalid.
function parseLocalDateTime(value) {
    const text = (value || "").trim();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, y, mo, d, h, mi] = match.map(Number);
    const date = new Date(y, mo - 1, d, h, mi);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatEventDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function categoryLabel(key) {
    return CATEGORIES.find((c) => c.key === key)?.label || "Other";
}

export default function OwnerManageEventsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const safePadding = useSafeScreenPadding();
    const { token } = useAuth();

    const barId = route.params?.barId || null;
    const barName = route.params?.barName || "your venue";
    const verified = route.params?.verified ?? false;

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const authHeader = useMemo(
        () => (token ? { Authorization: `Bearer ${token}` } : undefined),
        [token],
    );

    const loadEvents = useCallback(async () => {
        if (!barId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get("/events", {
                params: { barId, includePast: "true" },
            });
            setEvents(data.events || []);
        } catch (err) {
            console.warn("Failed to load events:", err?.message);
        } finally {
            setLoading(false);
        }
    }, [barId]);

    useFocusEffect(
        useCallback(() => {
            loadEvents();
        }, [loadEvents]),
    );

    const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
    };

    const startEdit = (event) => {
        const start = new Date(event.startsAt);
        const end = event.endsAt ? new Date(event.endsAt) : null;
        const toInput = (d) =>
            d && !Number.isNaN(d.getTime())
                ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                      d.getDate(),
                  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
                      d.getMinutes(),
                  ).padStart(2, "0")}`
                : "";
        setForm({
            title: event.title || "",
            description: event.description || "",
            category: event.category || "other",
            startsAt: toInput(start),
            endsAt: toInput(end),
        });
        setEditingId(event._id);
    };

    const handleSubmit = async () => {
        Keyboard.dismiss();
        if (!barId) {
            Alert.alert("No venue", "Create your bar in Edit Bar Info first.");
            return;
        }
        if (form.title.trim().length < 2) {
            Alert.alert("Missing title", "Give the event a title.");
            return;
        }
        const start = parseLocalDateTime(form.startsAt);
        if (!start) {
            Alert.alert("Invalid start", "Use the format YYYY-MM-DD HH:MM (e.g. 2026-06-12 21:00).");
            return;
        }
        let end = null;
        if (form.endsAt.trim()) {
            end = parseLocalDateTime(form.endsAt);
            if (!end) {
                Alert.alert("Invalid end", "Use the format YYYY-MM-DD HH:MM, or leave it blank.");
                return;
            }
            if (end < start) {
                Alert.alert("Check times", "End time can't be before the start time.");
                return;
            }
        }

        const payload = {
            barId,
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            startsAt: start.toISOString(),
            endsAt: end ? end.toISOString() : null,
        };

        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/events/${editingId}`, payload, { headers: authHeader });
            } else {
                await api.post("/events", payload, { headers: authHeader });
            }
            resetForm();
            await loadEvents();
        } catch (err) {
            Alert.alert(
                "Could not save event",
                err?.response?.data?.message || "Please try again.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (event) => {
        Alert.alert("Delete event", `Remove "${event.title}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await api.delete(`/events/${event._id}`, { headers: authHeader });
                        if (editingId === event._id) resetForm();
                        await loadEvents();
                    } catch (err) {
                        Alert.alert(
                            "Could not delete",
                            err?.response?.data?.message || "Please try again.",
                        );
                    }
                },
            },
        ]);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <NeonScreen gradient={gradients.events}>
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, safePadding]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <ScreenTitleBlock
                        title="Manage Events"
                        subtitle={`What's on at ${barName}`}
                        colors={colors}
                        style={styles.headerContainer}
                    />

                    {!barId ? (
                        <View style={styles.noticeCard}>
                            <Text style={styles.noticeTitle}>No venue yet</Text>
                            <Text style={styles.noticeCopy}>
                                Add your bar in “Edit Bar Info” before creating events.
                            </Text>
                            <NeonButton
                                title="Go Back"
                                onPress={() => navigation.goBack()}
                                style={{ marginTop: 16 }}
                            />
                        </View>
                    ) : (
                        <>
                            {!verified && (
                                <View style={styles.warnBanner}>
                                    <MaterialCommunityIcons
                                        name="shield-alert-outline"
                                        size={18}
                                        color={colors.neonYellow}
                                    />
                                    <Text style={styles.warnText}>
                                        Your venue isn’t verified yet. You can draft events, but
                                        publishing is locked until an admin verifies ownership.
                                    </Text>
                                </View>
                            )}

                            {/* Editor */}
                            <View style={styles.formCard}>
                                <Text style={styles.formHeading}>
                                    {editingId ? "Edit event" : "New event"}
                                </Text>

                                <Text style={styles.label}>Title</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Karaoke Night"
                                    placeholderTextColor={colors.muted}
                                    value={form.title}
                                    onChangeText={(v) => updateField("title", v)}
                                />

                                <Text style={styles.label}>Category</Text>
                                <View style={styles.chipRow}>
                                    {CATEGORIES.map((cat) => {
                                        const active = form.category === cat.key;
                                        return (
                                            <Pressable
                                                key={cat.key}
                                                onPress={() => updateField("category", cat.key)}
                                                style={[styles.chip, active && styles.chipActive]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.chipText,
                                                        active && styles.chipTextActive,
                                                    ]}
                                                >
                                                    {cat.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>

                                <Text style={styles.label}>Starts (YYYY-MM-DD HH:MM)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2026-06-12 21:00"
                                    placeholderTextColor={colors.muted}
                                    autoCapitalize="none"
                                    value={form.startsAt}
                                    onChangeText={(v) => updateField("startsAt", v)}
                                />

                                <Text style={styles.label}>Ends (optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2026-06-13 01:00"
                                    placeholderTextColor={colors.muted}
                                    autoCapitalize="none"
                                    value={form.endsAt}
                                    onChangeText={(v) => updateField("endsAt", v)}
                                />

                                <Text style={styles.label}>Description (optional)</Text>
                                <TextInput
                                    style={[styles.input, styles.multiline]}
                                    placeholder="Hosted by DJ Owl, free entry before 10pm."
                                    placeholderTextColor={colors.muted}
                                    multiline
                                    value={form.description}
                                    onChangeText={(v) => updateField("description", v)}
                                />

                                <NeonButton
                                    title={
                                        saving
                                            ? "Saving..."
                                            : editingId
                                              ? "Update Event"
                                              : "Add Event"
                                    }
                                    onPress={handleSubmit}
                                    disabled={saving}
                                    style={{ marginTop: 14 }}
                                />
                                {editingId ? (
                                    <Pressable onPress={resetForm} style={styles.cancelEdit}>
                                        <Text style={styles.cancelEditText}>Cancel edit</Text>
                                    </Pressable>
                                ) : null}
                            </View>

                            {/* List */}
                            <Text style={styles.listHeading}>
                                {loading
                                    ? "Loading…"
                                    : `${events.length} event${events.length === 1 ? "" : "s"}`}
                            </Text>

                            {loading ? (
                                <ActivityIndicator color={colors.neonYellow} style={{ marginTop: 16 }} />
                            ) : events.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    No events yet. Add your first one above.
                                </Text>
                            ) : (
                                events.map((event) => (
                                    <View key={event._id} style={styles.eventCard}>
                                        <View style={styles.eventTop}>
                                            <View style={styles.categoryTag}>
                                                <Text style={styles.categoryTagText}>
                                                    {categoryLabel(event.category)}
                                                </Text>
                                            </View>
                                            <Text style={styles.eventDate}>
                                                {formatEventDate(event.startsAt)}
                                            </Text>
                                        </View>
                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                        {!!event.description && (
                                            <Text style={styles.eventDesc} numberOfLines={2}>
                                                {event.description}
                                            </Text>
                                        )}
                                        <View style={styles.eventActions}>
                                            <Pressable
                                                onPress={() => startEdit(event)}
                                                style={styles.actionBtn}
                                            >
                                                <MaterialCommunityIcons
                                                    name="pencil-outline"
                                                    size={18}
                                                    color={colors.neonBlue}
                                                />
                                                <Text style={[styles.actionLabel, { color: colors.neonBlue }]}>
                                                    Edit
                                                </Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => handleDelete(event)}
                                                style={styles.actionBtn}
                                            >
                                                <MaterialCommunityIcons
                                                    name="trash-can-outline"
                                                    size={18}
                                                    color={colors.neonPink}
                                                />
                                                <Text style={[styles.actionLabel, { color: colors.neonPink }]}>
                                                    Delete
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                ))
                            )}
                        </>
                    )}
                </ScrollView>
            </NeonScreen>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerContainer: {
        marginTop: 0,
        marginBottom: 18,
    },
    noticeCard: {
        ...surfaces.neonCard,
        padding: 22,
        alignItems: "center",
    },
    noticeTitle: {
        ...typography.subheading,
        marginBottom: 8,
    },
    noticeCopy: {
        ...typography.body,
        color: colors.muted,
        textAlign: "center",
    },
    warnBanner: {
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-start",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(255, 184, 92, 0.4)",
        backgroundColor: "rgba(255, 184, 92, 0.1)",
        padding: 12,
        marginBottom: 16,
    },
    warnText: {
        ...typography.caption,
        color: colors.neonYellow,
        flex: 1,
        lineHeight: 18,
    },
    formCard: {
        ...surfaces.neonCard,
        padding: 18,
        marginBottom: 22,
    },
    formHeading: {
        ...typography.subheading,
        marginBottom: 12,
    },
    label: {
        ...typography.caption,
        marginBottom: 4,
        marginTop: 10,
    },
    input: {
        ...surfaces.formInput,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: "top",
        paddingTop: 12,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.16)",
        backgroundColor: "rgba(255,255,255,0.04)",
    },
    chipActive: {
        borderColor: colors.neonYellow,
        backgroundColor: "rgba(255, 184, 92, 0.16)",
    },
    chipText: {
        ...typography.caption,
        color: colors.muted,
        fontWeight: "700",
    },
    chipTextActive: {
        color: colors.neonYellow,
    },
    cancelEdit: {
        alignItems: "center",
        marginTop: 12,
    },
    cancelEditText: {
        ...typography.caption,
        color: colors.muted,
    },
    listHeading: {
        ...typography.caption,
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
    },
    emptyText: {
        ...typography.body,
        color: colors.muted,
        textAlign: "center",
        marginTop: 8,
    },
    eventCard: {
        ...surfaces.neonCard,
        padding: 16,
        marginBottom: 14,
    },
    eventTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    categoryTag: {
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "rgba(123, 223, 255, 0.14)",
        borderWidth: 1,
        borderColor: "rgba(123, 223, 255, 0.3)",
    },
    categoryTagText: {
        ...typography.caption,
        fontSize: 11,
        fontWeight: "700",
        color: colors.neonBlue,
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    eventDate: {
        ...typography.caption,
        color: colors.neonYellow,
        fontWeight: "700",
    },
    eventTitle: {
        ...typography.subheading,
        fontSize: 18,
        lineHeight: 24,
    },
    eventDesc: {
        ...typography.body,
        color: colors.muted,
        marginTop: 4,
    },
    eventActions: {
        flexDirection: "row",
        gap: 18,
        marginTop: 12,
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    actionLabel: {
        ...typography.caption,
        fontWeight: "700",
    },
});
