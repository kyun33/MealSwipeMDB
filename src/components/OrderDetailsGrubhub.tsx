import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getGrubhubOfferById, getProfileById } from '../services/api';
import type { Screen } from '../App';
import type { GrubhubOffer } from '../services/api';

interface OrderDetailsGrubhubProps {
  onNavigate: (screen: Screen) => void;
  offerId?: string;
}

export function OrderDetailsGrubhub({ onNavigate, offerId }: OrderDetailsGrubhubProps) {
  const [offer, setOffer] = useState<GrubhubOffer | null>(null);
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerRating, setSellerRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState<{ start: string; end: string } | null>(null);

  useEffect(() => {
    if (offerId) {
      loadOfferDetails();
    } else {
      setLoading(false);
    }
  }, [offerId]);

  const loadOfferDetails = async () => {
    if (!offerId) return;

    try {
      setLoading(true);
      const offerData = await getGrubhubOfferById(offerId);
      
      if (!offerData) {
        Alert.alert('Error', 'Offer not found');
        onNavigate('home');
        return;
      }

      setOffer(offerData);

      // Extract time window from notes if present
      if (offerData.notes) {
        const timeMatch = offerData.notes.match(/Time window:\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (timeMatch) {
          setTimeWindow({ start: timeMatch[1], end: timeMatch[2] });
        }
      }

      // Fetch seller profile
      const seller = await getProfileById(offerData.seller_id);
      if (seller) {
        setSellerName(seller.full_name || 'Seller');
        setSellerRating(seller.rating || 0);
      }
    } catch (error: any) {
      console.error('Error loading offer details:', error);
      Alert.alert('Error', error.message || 'Failed to load offer details. Please try again.');
      onNavigate('home');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    // Time is in HH:MM format, convert to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const restaurantNames: Record<string, string> = {
    browns: 'Browns',
    ladle: 'Ladle and Leaf',
    monsoon: 'Monsoon',
    gbc: 'GBC'
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003262" />
        <Text style={styles.loadingText}>Loading offer details...</Text>
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.errorText}>Offer not found</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offer Details</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Grubhub Meal Swipe</Text>
          <Text style={styles.price}>${offer.price}</Text>
          
          <View style={styles.sellerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{sellerName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{sellerName}</Text>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FDB515" />
                <Text style={styles.ratingText}>{sellerRating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="store" size={20} color="#FDB515" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Restaurant</Text>
                <Text style={styles.detailValue}>{restaurantNames[offer.restaurant] || offer.restaurant}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#FDB515" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(offer.offer_date)}</Text>
              </View>
            </View>

            {timeWindow && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#FDB515" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Time Window</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(timeWindow.start)} - {formatTime(timeWindow.end)}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#FDB515" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Pickup Location</Text>
                <Text style={styles.detailValue}>{offer.pickup_location}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="currency-usd" size={20} color="#FDB515" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Max Order Amount</Text>
                <Text style={styles.detailValue}>${offer.max_amount}</Text>
              </View>
            </View>
          </View>

          {offer.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>Additional Notes</Text>
                <Text style={styles.notesText}>
                  {offer.notes.replace(/Time window:\s*\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\.?\s*/g, '').trim() || offer.notes}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 24, backgroundColor: '#003262', flexDirection: 'row', alignItems: 'center', gap: 16 },
  backButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  content: { flex: 1, padding: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  price: { fontSize: 32, fontWeight: '700', color: '#FDB515', marginBottom: 24 },
  sellerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FDB515', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '600', color: '#FFFFFF' },
  sellerDetails: { flex: 1 },
  sellerName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },
  detailSection: { gap: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  detailValue: { fontSize: 16, color: '#111827' },
  notesSection: { marginTop: 8 },
  notesLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  notesText: { fontSize: 15, color: '#111827', lineHeight: 22 },
  errorText: { fontSize: 16, color: '#6B7280', textAlign: 'center', paddingVertical: 24 },
});
