import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import type { Screen } from '../App';

interface OrdersSellerProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function OrdersSeller({ onNavigate, activeTab, onTabChange }: OrdersSellerProps) {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const orders = [
    { id: 1, type: 'dining', name: 'Foothill', status: 'active', price: 6, buyer: 'Alex T.' },
    { id: 2, type: 'grubhub', name: 'Brown\'s Cafe', status: 'completed', price: 10, buyer: 'Sophie K.' },
  ];

  const filteredOrders = orders.filter(o => selectedTab === 'active' ? o.status === 'active' : o.status === 'completed');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Sales</Text>
          <TouchableOpacity onPress={() => onNavigate('orders-buyer')} style={styles.switchButton}>
            <Text style={styles.switchButtonText}>Switch to Buyer</Text>
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
              <View>
                <Text style={styles.orderName}>{order.name}</Text>
                <Text style={styles.buyerName}>Buyer: {order.buyer}</Text>
              </View>
              <Text style={styles.orderPrice}>${order.price}</Text>
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
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  orderName: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  buyerName: { fontSize: 14, color: '#6B7280' },
  orderPrice: { fontSize: 20, fontWeight: '700', color: '#003262' },
  chatButton: { backgroundColor: '#003262', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  chatButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
