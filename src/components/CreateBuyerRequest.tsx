import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import type { Screen } from '../App';

interface CreateBuyerRequestProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function CreateBuyerRequest({ onNavigate, activeTab, onTabChange }: CreateBuyerRequestProps) {
  const [requestType, setRequestType] = useState<'dining' | 'grubhub'>('dining');
  const [diningHall, setDiningHall] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // Handle submission
    onNavigate('home');
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
          <TextInput
            style={styles.input}
            placeholder="Dining Hall Name"
            value={diningHall}
            onChangeText={setDiningHall}
          />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Restaurant Name"
              value={restaurant}
              onChangeText={setRestaurant}
            />
            <TextInput
              style={styles.input}
              placeholder="Pickup Location"
              value={location}
              onChangeText={setLocation}
            />
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="Time Window"
          value={time}
          onChangeText={setTime}
        />
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
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Post Request</Text>
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
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 16, backgroundColor: '#FFFFFF' },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#003262', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
