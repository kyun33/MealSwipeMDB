import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import { getBuyerRequests, getProfileById, acceptBuyerRequest, createOrder, auth } from '../services/api';
import type { Screen } from '../App';
import type { BuyerRequest } from '../services/api';
import { formatTime12Hour, isPastDateTime } from '../utils/timeFormat';

interface BuyerRequestsScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

interface RequestWithBuyer extends BuyerRequest {
  buyerName: string;
  buyerRating: number;
}

export function BuyerRequestsScreen({ onNavigate, activeTab, onTabChange }: BuyerRequestsScreenProps) {
  const [filterType, setFilterType] = useState<'all' | 'dining' | 'grubhub'>('all');
  const [requests, setRequests] = useState<RequestWithBuyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [filterType]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const user = await auth.getCurrentUser();
      setCurrentUserId(user?.id || null);

      const filters: any = { status: 'active' };
      if (filterType !== 'all') {
        filters.request_type = filterType;
      }

      const buyerRequests = await getBuyerRequests(filters);

      // Filter out user's own requests and past requests
      const filteredRequests = (currentUserId 
        ? buyerRequests.filter(request => request.buyer_id !== currentUserId)
        : buyerRequests
      ).filter(request => {
        // Filter out requests where date is in the past, or date is today but end time has passed
        const comparisonTime = request.end_time || request.start_time;
        if (comparisonTime && isPastDateTime(request.request_date, comparisonTime)) {
          return false;
        }
        return true;
      });

      // Fetch buyer profiles
      const requestsWithBuyers = await Promise.all(
        filteredRequests.map(async (request) => {
          const buyer = await getProfileById(request.buyer_id);
          return {
            ...request,
            buyerName: buyer?.full_name?.split(' ')[0] + ' ' + (buyer?.full_name?.split(' ')[1]?.[0] || '') + '.' || 'Buyer',
            buyerRating: buyer?.rating || 0
          };
        })
      );

      setRequests(requestsWithBuyers);
    } catch (error) {
      console.error('Error loading buyer requests:', error);
      Alert.alert('Error', 'Failed to load buyer requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (request: RequestWithBuyer) => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please sign in to accept requests');
      return;
    }

    // Prevent users from accepting their own buyer requests
    if (request.buyer_id === currentUserId) {
      Alert.alert('Error', 'You cannot accept your own request');
      return;
    }

    try {
      // Accept the buyer request
      await acceptBuyerRequest(request.id, currentUserId);

      // Create an order from the accepted request
      await createOrder({
        order_type: 'buyer_request',
        buyer_request_id: request.id,
        buyer_id: request.buyer_id,
        seller_id: currentUserId,
        item_type: request.request_type,
        dining_hall: request.dining_hall || undefined,
        restaurant: request.restaurant || undefined,
        pickup_location: request.pickup_location || undefined,
        pickup_date: request.request_date,
        pickup_time_start: request.start_time,
        pickup_time_end: request.end_time || undefined,
        price: Number(request.offer_price)
      });

      Alert.alert('Success', 'Request accepted! Order created.');
      loadRequests(); // Refresh the list
      onNavigate('orders-seller');
    } catch (error: any) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', error.message || 'Failed to accept request. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    return formatTime12Hour(timeString);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003262" />
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

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
        {requests.length === 0 ? (
          <Text style={styles.emptyText}>No buyer requests available</Text>
        ) : (
          requests.map((request) => {
            const diningHallNames: Record<string, string> = {
              foothill: 'Foothill',
              cafe3: 'Cafe 3',
              clarkkerr: 'Clark Kerr',
              crossroads: 'Crossroads'
            };
            const restaurantNames: Record<string, string> = {
              browns: 'Brown\'s Cafe',
              ladle: 'Ladle and Leaf',
              monsoon: 'Monsoon'
            };

            return (
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
                        <Text style={styles.rating}>{request.buyerRating.toFixed(1)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.priceDateContainer}>
                    <Text style={styles.price}>${Number(request.offer_price)}</Text>
                    <Text style={styles.date}>{formatDate(request.request_date)}</Text>
                  </View>
                </View>
                <Text style={styles.requestTitle}>
                  {request.request_type === 'dining' 
                    ? diningHallNames[request.dining_hall!] || request.dining_hall
                    : restaurantNames[request.restaurant!] || request.restaurant}
                </Text>
                {request.request_type === 'dining' ? (
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                    <Text style={styles.detailText}>
                      {formatTime(request.start_time)} - {request.end_time ? formatTime(request.end_time) : ''}
                    </Text>
                  </View>
                ) : (
                  <>
                    {request.pickup_location && (
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="map-marker-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{request.pickup_location}</Text>
                      </View>
                    )}
                    {request.end_time ? (
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                        <Text style={styles.detailText}>
                          Pickup: {formatTime(request.start_time)} - {formatTime(request.end_time)}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                        <Text style={styles.detailText}>Pickup: {formatTime(request.start_time)}</Text>
                      </View>
                    )}
                  </>
                )}
                {request.notes && (
                  <Text style={styles.notes}>{request.notes}</Text>
                )}
                <TouchableOpacity 
                  style={styles.acceptButton} 
                  onPress={() => handleAcceptRequest(request)}
                >
                  <Text style={styles.acceptButtonText}>Accept Request</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
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
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingVertical: 24 },
  requestCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#003262' },
  requestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  buyerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#003262', justifyContent: 'center', alignItems: 'center' },
  buyerName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 12, color: '#6B7280' },
  priceDateContainer: { alignItems: 'flex-end' },
  price: { fontSize: 24, fontWeight: '700', color: '#003262', marginBottom: 4 },
  date: { fontSize: 12, color: '#6B7280' },
  requestTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  detailText: { fontSize: 14, color: '#111827' },
  notes: { fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginTop: 8, marginBottom: 12 },
  acceptButton: { marginTop: 16, backgroundColor: '#003262', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  acceptButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
