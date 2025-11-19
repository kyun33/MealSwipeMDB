import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomNav } from './BottomNav';
import { createGrubhubOffer, auth } from '../services/api';
import type { Screen } from '../App';

interface CreateOfferGrubhubProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function CreateOfferGrubhub({ onNavigate, activeTab, onTabChange }: CreateOfferGrubhubProps) {
  const [restaurant, setRestaurant] = useState<'browns' | 'ladle' | 'monsoon' | ''>('');
  const [location, setLocation] = useState('');
  const [offerDate, setOfferDate] = useState<Date>(new Date());
  const [maxAmount, setMaxAmount] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await auth.getCurrentUser();
      setCurrentUserId(user?.id || null);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmit = async () => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please sign in to create an offer');
      return;
    }

    if (!restaurant || !location || !maxAmount || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await createGrubhubOffer({
        seller_id: currentUserId,
        restaurant: restaurant as any,
        pickup_location: location,
        offer_date: formatDate(offerDate),
        max_amount: parseFloat(maxAmount),
        price: parseFloat(price),
        notes: notes || undefined
      });

      Alert.alert('Success', 'Grubhub offer created successfully!');
      onNavigate('sell-hub');
    } catch (error: any) {
      console.error('Error creating grubhub offer:', error);
      Alert.alert('Error', error.message || 'Failed to create offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('sell-hub')} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Grubhub Offer</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.label}>Restaurant</Text>
          <View style={styles.optionsContainer}>
            {(['browns', 'ladle', 'monsoon'] as const).map((rest) => (
              <TouchableOpacity
                key={rest}
                onPress={() => setRestaurant(rest)}
                style={[styles.optionButton, restaurant === rest && styles.optionButtonActive]}
              >
                <Text style={[styles.optionText, restaurant === rest && styles.optionTextActive]}>
                  {rest === 'browns' ? 'Brown\'s Cafe' : rest === 'ladle' ? 'Ladle and Leaf' : 'Monsoon'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Pickup Location"
          value={location}
          onChangeText={setLocation}
        />
        
        {/* Date Picker */}
        <View>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color="#003262" />
            <Text style={styles.pickerButtonText}>{formatDisplayDate(offerDate)}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={offerDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setOfferDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Max Order Amount ($)"
          value={maxAmount}
          onChangeText={setMaxAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Price ($)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Additional Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Offer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 24, backgroundColor: '#003262', flexDirection: 'row', alignItems: 'center', gap: 16 },
  backButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, gap: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 8 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  optionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  optionButtonActive: { borderColor: '#003262', backgroundColor: '#DBEAFE' },
  optionText: { fontSize: 14, color: '#6B7280' },
  optionTextActive: { color: '#003262', fontWeight: '600' },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, backgroundColor: '#FFFFFF' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#003262', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
