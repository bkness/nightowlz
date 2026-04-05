import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import NeonButton from '../../components/common/NeonButton';
import useSafeScreenPadding from '../../hooks/useSafeScreenPadding';
import NeonScreen from '../../components/common/NeonScreen';
import { gradients, typography, surfaces, colors } from '../../theme';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function OwnerEditBarScreen() {
    const navigation = useNavigation();
    const safePadding = useSafeScreenPadding();
    const route = useRoute();
    const { token } = useAuth();

    const barId = route.params?.barId;

    const [form, setForm] = useState({
        name: '',
        location: '',
        description: '',
        phone: '',
        website: '',
        openingHours: '',
    });

    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const nameRef = useRef(null);
    const locationRef = useRef(null);
    const descriptionRef = useRef(null);
    const phoneRef = useRef(null);
    const websiteRef = useRef(null);
    const openingHoursRef = useRef(null);

    const canSave = useMemo(() => {
        return form.name.trim().length > 1 && form.location.trim().length > 3 && !saving;
    }, [form, saving]);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        let active = true;

        async function loadBar() {
            try {
                if (!barId) {
                    if (active) setLoading(false);
                    return;
                }

                const { data } = await api.get(`/bars/${barId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!active) return;

                setForm({
                    name: data?.name || '',
                    location: data?.location || '',
                    description: data?.description || '',
                    phone: data?.phone || '',
                    website: data?.website || '',
                    openingHours: data?.openingHours || '',
                });
            } catch (err) {
                Alert.alert('Could not load bar', err.response?.data?.message || 'Please try again.');
            } finally {
                if (active) setLoading(false);
            }
        }

        loadBar();
        return () => {
            active = false;
        };
    }, [barId, token]);

    const handleSave = async () => {
        if (!canSave) return;

        try {
            setSaving(true);

            if (barId) {
                await api.put(`/bars/${barId}`, form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await api.post('/bars', form, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            Alert.alert('Success', 'Bar information saved.');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Error saving bar', err.response?.data?.message || 'Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDismiss = () => {
        setFocusedField(null);
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={handleDismiss} accessible={false}>
            <NeonScreen gradient={gradients.events} liftDistance={0}>
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, safePadding]}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                    onScrollBeginDrag={handleDismiss}
                    onTouchStart={handleDismiss}
                >
                    <Text style={styles.title}>Edit Bar Info</Text>
                    <Text style={styles.subtitle}>
                        Update the details guests will see for your venue.
                    </Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Bar Name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'name' && styles.inputFocused,
                            ]}
                            ref={nameRef}
                            returnKeyType="next"
                            onSubmitEditing={() => locationRef.current.focus()}
                            placeholder="Enter bar name"
                            placeholderTextColor={colors.muted}
                            value={form.name}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(value) => updateField('name', value)}
                        />

                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'location' && styles.inputFocused,
                            ]}
                            ref={locationRef}
                            returnKeyType="next"
                            onSubmitEditing={() => descriptionRef.current.focus()}
                            placeholder="Enter bar location"
                            placeholderTextColor={colors.muted}
                            value={form.location}
                            onFocus={() => setFocusedField('location')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(value) => updateField('location', value)}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[
                                styles.input,
                                styles.descriptionInput,
                                focusedField === 'description' && styles.inputFocused,
                            ]}
                            ref={descriptionRef}
                            returnKeyType="next"
                            onSubmitEditing={() => phoneRef.current.focus()}
                            placeholder="Enter bar description"
                            placeholderTextColor={colors.muted}
                            multiline

                            value={form.description}
                            onFocus={() => setFocusedField('description')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(value) => updateField('description', value)}
                        />

                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'phone' && styles.inputFocused,
                            ]}
                            ref={phoneRef}
                            returnKeyType="next"
                            onSubmitEditing={() => websiteRef.current.focus()}
                            placeholder="Enter phone"
                            placeholderTextColor={colors.muted}
                            keyboardType="phone-pad"
                            value={form.phone}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(value) => updateField('phone', value)}
                        />

                        <Text style={styles.label}>Website</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'website' && styles.inputFocused,
                            ]}
                            ref={websiteRef}
                            returnKeyType="next"
                            onSubmitEditing={() => openingHoursRef.current.focus()}
                            placeholder="Enter website"
                            placeholderTextColor={colors.muted}
                            keyboardType="url"
                            autoCapitalize="none"
                            value={form.website}
                            onFocus={() => setFocusedField('website')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(value) => updateField('website', value)}
                        />

                        <Text style={styles.label}>Opening Hours</Text>
                        <TextInput
                            style={[
                                styles.input,
                                focusedField === 'openingHours' && styles.inputFocused,
                            ]}
                            ref={openingHoursRef}
                            returnKeyType="done"
                            placeholder="Mon-Sun 5pm-2am"
                            placeholderTextColor={colors.muted}
                            value={form.openingHours}
                            onSubmitEditing={handleSave}
                            onFocus={() => setFocusedField('openingHours')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={(value) => updateField('openingHours', value)}
                        />
                    </View>

                    {loading ? (
                        <ActivityIndicator color={colors.neonYellow} />
                    ) : (
                        <NeonButton
                            title={saving ? 'Saving...' : 'Save Changes'}
                            onPress={handleSave}
                            disabled={!canSave}
                        />
                    )}
                </ScrollView>
            </NeonScreen>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        ...typography.screenTitle,
        marginBottom: 8,
    },
    subtitle: {
        ...typography.body,
        color: colors.neonBlue,
        textAlign: 'center',
        marginBottom: 24,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    form: {
        gap: 12,
        marginBottom: 12,
    },
    label: {
        ...typography.caption,
        marginBottom: 4,
    },
    input: {
        ...surfaces.glassField,
        color: colors.white,
        height: 48,
        paddingHorizontal: 14,
    },
    inputFocused: {
        borderColor: colors.neonYellow,
        shadowColor: colors.glowYellow,
        shadowOpacity: 0.32,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
    },
    descriptionInput: {
        minHeight: 90,
        height: 90,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
});