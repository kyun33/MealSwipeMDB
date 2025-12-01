import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createRating, getOrderById, updateOrder, auth } from '../services/api';
import type { Screen } from '../App';
import type { Order } from '../services/api';

interface RatingScreenProps {
  onNavigate: (screen: Screen) => void;
  orderId?: string;
}

export function RatingScreen({ onNavigate, orderId }: RatingScreenProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      const user = await auth.getCurrentUser();
      setCurrentUserId(user?.id || null);

      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  const handleSubmit = async () => {
    if (!orderId || !currentUserId || !order) {
      Alert.alert('Error', 'Missing order information');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    try {
      setLoading(true);
      const ratedUserId = order.buyer_id === currentUserId ? order.seller_id : order.buyer_id;
      const isBuyer = order.buyer_id === currentUserId;

      // Create the rating
      await createRating({
        order_id: orderId,
        rater_id: currentUserId,
        rated_user_id: ratedUserId,
        rating,
        review_text: comment || undefined
      });

      // Update the order to mark that the buyer or seller has rated
      await updateOrder(orderId, {
        [isBuyer ? 'buyer_rated' : 'seller_rated']: true
      });

      Alert.alert('Success', 'Rating submitted successfully!');
      
      // Navigate to the appropriate orders screen
      onNavigate(isBuyer ? 'orders-buyer' : 'orders-seller');
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', error.message || 'Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => onNavigate(order?.buyer_id === currentUserId ? 'orders-buyer' : 'orders-seller')} 
          style={styles.backButton}
        >
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
        <TouchableOpacity 
          style={[styles.submitButton, (loading || rating === 0) && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading || rating === 0}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          )}
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
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
