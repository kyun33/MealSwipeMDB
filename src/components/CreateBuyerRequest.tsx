import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomNav } from './BottomNav';
import { createBuyerRequest, auth } from '../services/api';
import type { Screen } from '../App';

interface CreateBuyerRequestProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function CreateBuyerRequest({ onNavigate, activeTab, onTabChange }: CreateBuyerRequestProps) {
  const [requestType, setRequestType] = useState<'dining' | 'grubhub'>('dining');
  const [diningHall, setDiningHall] = useState<'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads' | ''>('');
  const [restaurant, setRestaurant] = useState<'browns' | 'ladle' | 'monsoon' | ''>('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [offerPrice, setOfferPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Picker visibility states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDisplayTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async () => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please sign in to create a request');
      return;
    }

    if (requestType === 'dining' && !diningHall) {
      Alert.alert('Error', 'Please select a dining hall');
      return;
    }

    if (requestType === 'grubhub' && (!restaurant || !location)) {
      Alert.alert('Error', 'Please fill in restaurant and location');
      return;
    }

    if (!offerPrice) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (requestType === 'dining' && startTime >= endTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      await createBuyerRequest({
        buyer_id: currentUserId,
        request_type: requestType,
        dining_hall: requestType === 'dining' ? diningHall as any : undefined,
        restaurant: requestType === 'grubhub' ? restaurant as any : undefined,
        pickup_location: requestType === 'grubhub' ? location : undefined,
        request_date: formatDate(date),
        start_time: formatTime(startTime),
        end_time: requestType === 'dining' ? formatTime(endTime) : undefined,
        offer_price: parseFloat(offerPrice),
        notes: notes || undefined
      });

      Alert.alert('Success', 'Buyer request created successfully!');
      onNavigate('home');
    } catch (error: any) {
      console.error('Error creating buyer request:', error);
      Alert.alert('Error', error.message || 'Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Your Request</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            onPress={() => setRequestType('dining')}
            style={[styles.typeButton, requestType === 'dining' && styles.typeButtonActive]}
          >
            <Text style={[styles.typeButtonText, requestType === 'dining' && styles.typeButtonTextActive]}>
              Dining Hall
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRequestType('grubhub')}
            style={[styles.typeButton, requestType === 'grubhub' && styles.typeButtonActive]}
          >
            <Text style={[styles.typeButtonText, requestType === 'grubhub' && styles.typeButtonTextActive]}>
              Grubhub
            </Text>
          </TouchableOpacity>
        </View>
        {requestType === 'dining' ? (
          <View>
            <Text style={styles.label}>Dining Hall</Text>
            <View style={styles.optionsContainer}>
              {(['foothill', 'cafe3', 'clarkkerr', 'crossroads'] as const).map((hall) => (
                <TouchableOpacity
                  key={hall}
                  onPress={() => setDiningHall(hall)}
                  style={[styles.optionButton, diningHall === hall && styles.optionButtonActive]}
                >
                  <Text style={[styles.optionText, diningHall === hall && styles.optionTextActive]}>
                    {hall.charAt(0).toUpperCase() + hall.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
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
          </>
        )}
        
        {/* Date Picker */}
        <View>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color="#003262" />
            <Text style={styles.pickerButtonText}>{formatDisplayDate(date)}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Start Time Picker */}
        <View>
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <MaterialCommunityIcons name="clock-outline" size={20} color="#003262" />
            <Text style={styles.pickerButtonText}>{formatDisplayTime(startTime)}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  setStartTime(selectedTime);
                }
              }}
              is24Hour={false}
            />
          )}
        </View>

        {/* End Time Picker (only for dining) */}
        {requestType === 'dining' && (
          <View>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <MaterialCommunityIcons name="clock-outline" size={20} color="#003262" />
              <Text style={styles.pickerButtonText}>{formatDisplayTime(endTime)}</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(Platform.OS === 'ios');
                  if (selectedTime) {
                    setEndTime(selectedTime);
                  }
                }}
                is24Hour={false}
              />
            )}
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Offer Price ($)"
          value={offerPrice}
          onChangeText={setOfferPrice}
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
            <Text style={styles.submitButtonText}>Post Request</Text>
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
  typeSelector: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  typeButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center' },
  typeButtonActive: { borderColor: '#003262', backgroundColor: '#DBEAFE' },
  typeButtonText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  typeButtonTextActive: { color: '#003262' },
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
