import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import type { Screen } from '../App';

interface BuyerRequestsScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function BuyerRequestsScreen({ onNavigate, activeTab, onTabChange }: BuyerRequestsScreenProps) {
  const [filterType, setFilterType] = useState<'all' | 'dining' | 'grubhub'>('all');

  const buyerRequests = [
    { id: 1, type: 'dining' as const, buyerName: 'Alex T.', buyerRating: 4.9, diningHall: 'Crossroads', date: 'Today', timeWindow: '6:00 PM - 7:30 PM', offerPrice: 7, notes: 'Need swipe for dinner.' },
    { id: 2, type: 'grubhub' as const, buyerName: 'Sophie K.', buyerRating: 5.0, restaurant: 'Brown\'s Cafe', location: 'Unit 2 Lobby', date: 'Tomorrow', pickupTime: '7:00 PM', offerPrice: 11, notes: 'Order under $12.' },
  ];

  const filteredRequests = filterType === 'all' ? buyerRequests : buyerRequests.filter(req => req.type === filterType);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buyer Requests</Text>
        <Text style={styles.headerSubtitle}>Accept requests from buyers looking for swipes</Text>
        <View style={styles.filterContainer}>
          {(['all', 'dining', 'grubhub'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              style={[styles.filterButton, filterType === type && styles.filterButtonActive]}
            >
              <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
                {type === 'all' ? 'All' : type === 'dining' ? 'Dining Hall' : 'Grubhub'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.buyerInfo}>
                <View style={styles.avatar}>
                  <MaterialCommunityIcons name="account" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.buyerName}>{request.buyerName}</Text>
                  <View style={styles.ratingContainer}>
                    <MaterialCommunityIcons name="star" size={14} color="#FDB515" />
                    <Text style={styles.rating}>{request.buyerRating}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.price}>${request.offerPrice}</Text>
            </View>
            <Text style={styles.requestTitle}>
              {request.type === 'dining' ? request.diningHall : request.restaurant}
            </Text>
            {request.type === 'dining' ? (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                <Text style={styles.detailText}>{request.timeWindow}</Text>
              </View>
            ) : (
              <>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{request.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                  <Text style={styles.detailText}>Pickup: {request.pickupTime}</Text>
                </View>
              </>
            )}
            <TouchableOpacity style={styles.acceptButton} onPress={() => onNavigate('orders-seller')}>
              <Text style={styles.acceptButtonText}>Accept Request</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24, backgroundColor: '#003262' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 16 },
  filterContainer: { flexDirection: 'row', gap: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  filterButtonActive: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  filterTextActive: { color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, gap: 16 },
  requestCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#003262' },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  buyerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#003262', justifyContent: 'center', alignItems: 'center' },
  buyerName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 12, color: '#6B7280' },
  price: { fontSize: 24, fontWeight: '700', color: '#003262' },
  requestTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  detailText: { fontSize: 14, color: '#111827' },
  acceptButton: { marginTop: 16, backgroundColor: '#003262', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  acceptButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
