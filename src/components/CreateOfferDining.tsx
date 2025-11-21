import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, ActivityIndicator, Platform, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomNav } from './BottomNav';
import { createDiningOffer, auth } from '../services/api';
import type { Screen } from '../App';

interface CreateOfferDiningProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function CreateOfferDining({ onNavigate, activeTab, onTabChange }: CreateOfferDiningProps) {
  const [diningHall, setDiningHall] = useState<'foothill' | 'cafe3' | 'clarkkerr' | 'crossroads' | ''>('');
  const [offerDate, setOfferDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [price, setPrice] = useState('');
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
    // Round to nearest minute and format as HH:MM (no seconds)
    const roundedDate = new Date(date);
    roundedDate.setSeconds(0, 0);
    const hours = String(roundedDate.getHours()).padStart(2, '0');
    const minutes = String(roundedDate.getMinutes()).padStart(2, '0');
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
      Alert.alert('Error', 'Please sign in to create an offer');
      return;
    }

    if (!diningHall || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      await createDiningOffer({
        seller_id: currentUserId,
        dining_hall: diningHall as any,
        offer_date: formatDate(offerDate),
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        price: parseFloat(price),
        notes: notes || undefined
      });

      Alert.alert('Success', 'Dining offer created successfully!');
      onNavigate('sell-hub');
    } catch (error: any) {
      console.error('Error creating dining offer:', error);
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
        <Text style={styles.headerTitle}>Create Dining Offer</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.label}>Dining Hall</Text>
          <View style={styles.optionsContainer}>
            {(['foothill', 'cafe3', 'clarkkerr', 'crossroads'] as const).map((hall) => {
              const diningHallNames: Record<string, string> = {
                foothill: 'Foothill',
                cafe3: 'Cafe 3',
                clarkkerr: 'Clark Kerr',
                crossroads: 'Crossroads'
              };
              return (
                <TouchableOpacity
                  key={hall}
                  onPress={() => setDiningHall(hall)}
                  style={[styles.optionButton, diningHall === hall && styles.optionButtonActive]}
                >
                  <Text style={[styles.optionText, diningHall === hall && styles.optionTextActive]}>
                    {diningHallNames[hall] || hall}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

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
          {Platform.OS === 'ios' && showStartTimePicker && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showStartTimePicker}
              onRequestClose={() => setShowStartTimePicker(false)}
            >
              <Pressable 
                style={styles.modalOverlay}
                onPress={() => setShowStartTimePicker(false)}
              >
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      if (selectedTime) {
                        setStartTime(selectedTime);
                      }
                    }}
                    is24Hour={false}
                    minuteInterval={1}
                  />
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowStartTimePicker(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          )}
          {Platform.OS === 'android' && showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(false);
                if (event.type !== 'dismissed' && selectedTime) {
                  setStartTime(selectedTime);
                }
              }}
              is24Hour={false}
              minuteInterval={1}
            />
          )}
        </View>

        {/* End Time Picker */}
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
          {Platform.OS === 'ios' && showEndTimePicker && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={showEndTimePicker}
              onRequestClose={() => setShowEndTimePicker(false)}
            >
              <Pressable 
                style={styles.modalOverlay}
                onPress={() => setShowEndTimePicker(false)}
              >
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      if (selectedTime) {
                        setEndTime(selectedTime);
                      }
                    }}
                    is24Hour={false}
                    minuteInterval={1}
                  />
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowEndTimePicker(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          )}
          {Platform.OS === 'android' && showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(false);
                if (event.type !== 'dismissed' && selectedTime) {
                  setEndTime(selectedTime);
                }
              }}
              is24Hour={false}
              minuteInterval={1}
            />
          )}
        </View>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#003262',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
