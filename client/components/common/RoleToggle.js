import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { surfaces, typography } from "../../theme";
import colors from "../../theme/colors";

export default function RoleToggle({ value, onChange }) {
    return (
        <View style={styles.roleRow}>
            <Pressable
                onPress={() => onChange("user")}
                style={[styles.roleChip, value === "user" && styles.roleChipActive]}
            >
                <Text style={[styles.roleText, value === "user" && styles.roleTextActive]}>
                    User
                </Text>
            </Pressable>
            <Pressable
                onPress={() => onChange("owner")}
                style={[styles.roleChip, value === "owner" && styles.roleChipActive]}
            >
                <Text style={[styles.roleText, value === "owner" && styles.roleTextActive]}>
                    Owner
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    roleRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 14,
        justifyContent: "center",
    },
    roleChip: {
        ...surfaces.glassField,
        paddingHorizontal: 14,
        paddingVertical: 8,
        minWidth: 88,
        alignItems: "center",
    },
    roleChipActive: {
        borderColor: colors.neonYellow,
        shadowColor: colors.glowYellow,
        shadowOpacity: 0.22,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
    },
    roleText: {
        ...typography.caption,
        color: colors.muted,
    },
    roleTextActive: {
        color: colors.neonYellow,
    },
});
