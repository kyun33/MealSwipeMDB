import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getOrderById, getProfileById, completeOrder, markOrderAsReceived, auth } from '../services/api';
import type { Screen } from '../App';
import type { Order } from '../services/api';

interface OrderDetailsGrubhubProps {
  onNavigate: (screen: Screen, orderId?: string) => void;
  orderId?: string;
}

export function OrderDetailsGrubhub({ onNavigate, orderId }: OrderDetailsGrubhubProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [buyer, setBuyer] = useState<{ name: string; email: string } | null>(null);
  const [seller, setSeller] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [markingReceived, setMarkingReceived] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const user = await auth.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Please sign in to view order details');
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);

      const orderData = await getOrderById(orderId);
      if (!orderData) {
        Alert.alert('Error', 'Order not found');
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // Load buyer and seller profiles
      const [buyerProfile, sellerProfile] = await Promise.all([
        getProfileById(orderData.buyer_id),
        getProfileById(orderData.seller_id)
      ]);

      if (buyerProfile) {
        setBuyer({ name: buyerProfile.full_name, email: buyerProfile.email });
      }
      if (sellerProfile) {
        setSeller({ name: sellerProfile.full_name, email: sellerProfile.email });
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderId || !order) return;

    Alert.alert(
      'Complete Order',
      'Are you sure you want to mark this order as completed? The buyer will need to confirm receipt.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'default',
          onPress: async () => {
            try {
              setCompleting(true);
              const updatedOrder = await completeOrder(orderId);
              setOrder(updatedOrder);
              
              Alert.alert('Success', 'Order marked as completed! Waiting for buyer confirmation.');
            } catch (error: any) {
              console.error('Error completing order:', error);
              Alert.alert('Error', error.message || 'Failed to complete order. Please try again.');
            } finally {
              setCompleting(false);
            }
          }
        }
      ]
    );
  };

  const handleMarkAsReceived = async () => {
    if (!orderId || !order) return;

    Alert.alert(
      'Mark as Received',
      'Have you received your order? This will close the order and allow you to rate your experience.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Received',
          style: 'default',
          onPress: async () => {
            try {
              setMarkingReceived(true);
              const updatedOrder = await markOrderAsReceived(orderId);
              setOrder(updatedOrder);
              
              Alert.alert(
                'Success',
                'Order marked as received! Would you like to rate your experience?',
                [
                  { text: 'Later', style: 'cancel' },
                  {
                    text: 'Rate Now',
                    onPress: () => {
                      onNavigate('rating', orderId);
                    }
                  }
                ]
              );
            } catch (error: any) {
              console.error('Error marking order as received:', error);
              Alert.alert('Error', error.message || 'Failed to mark order as received. Please try again.');
            } finally {
              setMarkingReceived(false);
            }
          }
        }
      ]
    );
  };

  const getRestaurantName = (restaurant?: string) => {
    const restaurantNames: Record<string, string> = {
      browns: 'Brown\'s Cafe',
      ladle: 'Ladle and Leaf',
      monsoon: 'Monsoon',
      goldenbear: 'Golden Bear Cafe'
    };
    return restaurantNames[restaurant || ''] || restaurant || 'Restaurant';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    // Convert "HH:MM:SS" or "HH:MM" to 12-hour format with AM/PM
    const timePart = timeString.substring(0, 5); // Get "HH:MM"
    const [hours, minutes] = timePart.split(':').map(Number);
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003262" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Order not found</Text>
      </View>
    );
  }

  const isSeller = currentUserId === order.seller_id;
  const isBuyer = currentUserId === order.buyer_id;
  const canComplete = isSeller && order.status === 'confirmed';
  const canMarkReceived = isBuyer && order.status === 'completed';
  const canRate = order.status === 'delivered';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => onNavigate(currentUserId === order?.buyer_id ? 'orders-buyer' : 'orders-seller')} 
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Order Status */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Information</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="store" size={20} color="#003262" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Restaurant</Text>
              <Text style={styles.infoValue}>{getRestaurantName(order.restaurant)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#003262" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{formatDate(order.pickup_date)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#003262" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Pickup Time</Text>
              <Text style={styles.infoValue}>
                {formatTime(order.pickup_time_start)}
                {order.pickup_time_end ? ` - ${formatTime(order.pickup_time_end)}` : ''}
              </Text>
            </View>
          </View>
          {order.pickup_location && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#003262" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Pickup Location</Text>
                <Text style={styles.infoValue}>{order.pickup_location}</Text>
              </View>
            </View>
          )}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="currency-usd" size={20} color="#003262" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>${Number(order.price)}</Text>
            </View>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Participants</Text>
          {buyer && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={20} color="#003262" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Buyer</Text>
                <Text style={styles.infoValue}>{buyer.name}</Text>
                <Text style={styles.infoSubtext}>{buyer.email}</Text>
              </View>
            </View>
          )}
          {seller && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={20} color="#003262" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Seller</Text>
                <Text style={styles.infoValue}>{seller.name}</Text>
                <Text style={styles.infoSubtext}>{seller.email}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Complete Order Button - For sellers */}
        {canComplete && (
          <TouchableOpacity
            onPress={handleCompleteOrder}
            disabled={completing}
            style={[styles.completeButton, completing && styles.completeButtonDisabled]}
          >
            {completing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Complete Order</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Mark as Received Button - For buyers */}
        {canMarkReceived && (
          <TouchableOpacity
            onPress={handleMarkAsReceived}
            disabled={markingReceived}
            style={[styles.completeButton, markingReceived && styles.completeButtonDisabled]}
          >
            {markingReceived ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="package-variant" size={20} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Mark as Received</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Rate Order Button - For both buyer and seller when delivered */}
        {canRate && (
          <TouchableOpacity
            onPress={() => onNavigate('rating', orderId)}
            style={[styles.completeButton, { backgroundColor: '#FDB515' }]}
          >
            <MaterialCommunityIcons name="star" size={20} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>Rate Order</Text>
          </TouchableOpacity>
        )}

        {/* Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => onNavigate('chat-grubhub', orderId)}
        >
          <MaterialCommunityIcons name="message-text" size={20} color="#003262" />
          <Text style={styles.chatButtonText}>Open Chat</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#003262',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  content: { flex: 1 },
  contentContainer: { padding: 24, gap: 16 },
  statusCard: { marginBottom: 8 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, fontWeight: '500', color: '#6B7280', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '600', color: '#111827' },
  infoSubtext: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  completeButtonDisabled: { backgroundColor: '#9CA3AF' },
  completeButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#003262',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  chatButtonText: { fontSize: 16, fontWeight: '600', color: '#003262' },
});
