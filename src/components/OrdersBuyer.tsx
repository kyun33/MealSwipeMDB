import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import { getOrders, auth } from '../services/api';
import type { Screen } from '../App';
import type { Order } from '../services/api';

interface OrdersBuyerProps {
  onNavigate: (screen: Screen, orderId?: string) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function OrdersBuyer({ onNavigate, activeTab, onTabChange }: OrdersBuyerProps) {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [selectedTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const user = await auth.getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setCurrentUserId(user.id);

      const allOrders = await getOrders({ buyer_id: user.id });
      const filtered = allOrders.filter(o => 
        selectedTab === 'active' 
          ? ['pending', 'confirmed', 'completed'].includes(o.status) // 'completed' = seller completed, waiting for buyer
          : ['delivered', 'cancelled'].includes(o.status) // 'delivered' = buyer confirmed receipt
      );

      setOrders(filtered);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const getOrderName = (order: Order) => {
    if (order.item_type === 'dining') {
      const diningHallNames: Record<string, string> = {
        foothill: 'Foothill',
        cafe3: 'Cafe 3',
        clarkkerr: 'Clark Kerr',
        crossroads: 'Crossroads'
      };
      return diningHallNames[order.dining_hall!] || order.dining_hall || 'Dining Hall';
    } else {
      const restaurantNames: Record<string, string> = {
        browns: 'Brown\'s Cafe',
        ladle: 'Ladle and Leaf',
        monsoon: 'Monsoon'
      };
      return restaurantNames[order.restaurant!] || order.restaurant || 'Restaurant';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003262" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity onPress={() => onNavigate('orders-seller')} style={styles.switchButton}>
            <Text style={styles.switchButtonText}>Switch to Seller</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setSelectedTab('active')}
            style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('completed')}
            style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>No {selectedTab} orders</Text>
        ) : (
          orders.map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.orderCard} 
              onPress={() => onNavigate(order.item_type === 'dining' ? 'chat-dining' : 'chat-grubhub', order.id)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderName}>{getOrderName(order)}</Text>
                <Text style={styles.orderPrice}>${Number(order.price)}</Text>
              </View>
              <View style={styles.orderDetails}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
                <Text style={styles.orderTime}>
                  {formatTime(order.pickup_time_start)}
                  {order.pickup_time_end ? ` - ${formatTime(order.pickup_time_end)}` : ''}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, styles[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof typeof styles] as any]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.chatButton} 
                onPress={() => onNavigate(order.item_type === 'dining' ? 'chat-dining' : 'chat-grubhub', order.id)}
              >
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
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
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 24, backgroundColor: '#003262' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  switchButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  switchButtonText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  tabTextActive: { color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, gap: 16 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingVertical: 24 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderName: { fontSize: 18, fontWeight: '600', color: '#111827' },
  orderPrice: { fontSize: 20, fontWeight: '700', color: '#003262' },
  orderDetails: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  orderTime: { fontSize: 14, color: '#6B7280' },
  statusContainer: { marginBottom: 16 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  statusPending: { color: '#F59E0B' },
  statusConfirmed: { color: '#3B82F6' },
  statusCompleted: { color: '#10B981' },
  statusDelivered: { color: '#059669' },
  statusCancelled: { color: '#EF4444' },
  chatButton: { backgroundColor: '#003262', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  chatButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
