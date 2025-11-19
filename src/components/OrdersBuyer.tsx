import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import type { Screen } from '../App';

interface OrdersBuyerProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function OrdersBuyer({ onNavigate, activeTab, onTabChange }: OrdersBuyerProps) {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const orders = [
    { id: 1, type: 'dining', name: 'Crossroads', status: 'active', price: 6, time: '6:30 PM' },
    { id: 2, type: 'grubhub', name: 'Brown\'s Cafe', status: 'completed', price: 10, time: '7:00 PM' },
  ];

  const filteredOrders = orders.filter(o => selectedTab === 'active' ? o.status === 'active' : o.status === 'completed');

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
        {filteredOrders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => onNavigate('chat-dining')}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderName}>{order.name}</Text>
              <Text style={styles.orderPrice}>${order.price}</Text>
            </View>
            <View style={styles.orderDetails}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
              <Text style={styles.orderTime}>{order.time}</Text>
            </View>
            <TouchableOpacity style={styles.chatButton} onPress={() => onNavigate('chat-dining')}>
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderName: { fontSize: 18, fontWeight: '600', color: '#111827' },
  orderPrice: { fontSize: 20, fontWeight: '700', color: '#003262' },
  orderDetails: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  orderTime: { fontSize: 14, color: '#6B7280' },
  chatButton: { backgroundColor: '#003262', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  chatButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
