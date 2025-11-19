import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import type { Screen } from '../App';

interface SellHubScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function SellHubScreen({ onNavigate, activeTab, onTabChange }: SellHubScreenProps) {
  const tips = [
    'Be flexible with timing to attract more buyers',
    'Respond quickly to messages and requests',
    'Clear meeting instructions increase success rate',
    'Higher ratings = more buyer interest'
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sell</Text>
        <Text style={styles.headerSubtitle}>Choose how you want to sell your swipes</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Create Your Own Offer */}
        <TouchableOpacity
          onPress={() => onNavigate('create-dining')}
          style={[styles.card, styles.diningCard]}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, styles.diningIcon]}>
              <MaterialCommunityIcons name="plus-circle" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Create Your Own Offer</Text>
              <Text style={styles.cardDescription}>
                Post your available swipes with your own schedule and pricing. Buyers will come to you.
              </Text>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Dining Hall</Text>
                </View>
                <View style={[styles.badge, styles.grubhubBadge]}>
                  <Text style={styles.grubhubBadgeText}>Grubhub</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Browse Buyer Requests */}
        <TouchableOpacity
          onPress={() => onNavigate('buyer-requests')}
          style={[styles.card, styles.grubhubCardBorder]}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, styles.grubhubIcon]}>
              <MaterialCommunityIcons name="magnify" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.cardTextContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>Browse Buyer Requests</Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              </View>
              <Text style={styles.cardDescription}>
                See requests from buyers looking for swipes. Accept the ones that fit your schedule.
              </Text>
              <View style={styles.trendingContainer}>
                <MaterialCommunityIcons name="trending-up" size={16} color="#92400E" />
                <Text style={styles.trendingText}>6 active requests right now</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.infoCardsContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardPrice}>$5-8</Text>
            <Text style={styles.infoCardLabel}>Avg dining hall price</Text>
          </View>
          <View style={[styles.infoCard, styles.grubhubInfoCard]}>
            <Text style={[styles.infoCardPrice, styles.grubhubPrice]}>$8-15</Text>
            <Text style={styles.grubhubInfoCardLabel}>Avg Grubhub price</Text>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips for Selling</Text>
          <View style={styles.tipsList}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#003262',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  diningCard: {
    borderColor: '#003262',
  },
  grubhubCardBorder: {
    borderColor: '#FDB515',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diningIcon: {
    backgroundColor: '#003262',
  },
  grubhubIcon: {
    backgroundColor: '#FDB515',
  },
  cardTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  badge: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  grubhubBadge: {
    backgroundColor: '#FEF3C7',
  },
  grubhubBadgeText: {
    color: '#92400E',
  },
  trendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  grubhubInfoCard: {
    backgroundColor: '#FEF3C7',
  },
  infoCardPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#003262',
    marginBottom: 4,
  },
  grubhubPrice: {
    color: '#FDB515',
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#1E40AF',
  },
  grubhubInfoCardLabel: {
    color: '#92400E',
  },
  tipsContainer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDB515',
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
});
