import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Screen } from '../App';

interface RatingScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function RatingScreen({ onNavigate }: RatingScreenProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('orders-buyer')} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Your Experience</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>How was your experience?</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <MaterialCommunityIcons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color="#FDB515"
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Add a comment (optional)"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.submitButton} onPress={() => onNavigate('orders-buyer')}>
          <Text style={styles.submitButtonText}>Submit Rating</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 24, backgroundColor: '#003262', flexDirection: 'row', alignItems: 'center', gap: 16 },
  backButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 24 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  textInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, minHeight: 100, marginBottom: 24, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#003262', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
