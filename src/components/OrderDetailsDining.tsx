import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDiningOfferById, getProfileById } from '../services/api';
import type { Screen } from '../App';
import type { DiningOffer } from '../services/api';

interface OrderDetailsDiningProps {
  onNavigate: (screen: Screen) => void;
  offerId?: string;
}

export function OrderDetailsDining({ onNavigate, offerId }: OrderDetailsDiningProps) {
  const [offer, setOffer] = useState<DiningOffer | null>(null);
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerRating, setSellerRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
      const offerData = await getDiningOfferById(offerId);
      
      if (!offerData) {
        Alert.alert('Error', 'Offer not found');
        onNavigate('home');
        return;
      }

      setOffer(offerData);

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

  const diningHallNames: Record<string, string> = {
    foothill: 'Foothill',
    cafe3: 'Cafe 3',
    clarkkerr: 'Clark Kerr',
    crossroads: 'Crossroads'
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
          <Text style={styles.title}>{diningHallNames[offer.dining_hall] || offer.dining_hall}</Text>
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
              <MaterialCommunityIcons name="calendar" size={20} color="#003262" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(offer.offer_date)}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#003262" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time Window</Text>
                <Text style={styles.detailValue}>
                  {formatTime(offer.start_time)} - {formatTime(offer.end_time)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="store" size={20} color="#003262" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dining Hall</Text>
                <Text style={styles.detailValue}>{diningHallNames[offer.dining_hall] || offer.dining_hall}</Text>
              </View>
            </View>
          </View>

          {offer.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>Additional Notes</Text>
                <Text style={styles.notesText}>{offer.notes}</Text>
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
  price: { fontSize: 32, fontWeight: '700', color: '#003262', marginBottom: 24 },
  sellerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#003262', justifyContent: 'center', alignItems: 'center' },
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
