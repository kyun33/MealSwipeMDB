import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import { getDiningOffers, getGrubhubOffers } from '../services/api';
import type { Screen } from '../App';

interface SellHubScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function SellHubScreen({ onNavigate, activeTab, onTabChange }: SellHubScreenProps) {
  const [avgDiningPrice, setAvgDiningPrice] = useState<string>('$7');
  const [avgGrubhubPrice, setAvgGrubhubPrice] = useState<string>('$7');
  const [loadingPrices, setLoadingPrices] = useState(true);

  const tips = [
    'Be flexible with timing to attract more buyers',
    'Respond quickly to messages and requests',
    'Clear meeting instructions increase success rate',
    'Higher ratings = more buyer interest'
  ];

  useEffect(() => {
    loadAveragePrices();
  }, []);

  const loadAveragePrices = async () => {
    try {
      setLoadingPrices(true);
      const [diningOffers, grubhubOffers] = await Promise.all([
        getDiningOffers({ status: 'active' }),
        getGrubhubOffers({ status: 'active' })
      ]);

      // Calculate average dining hall price
      if (diningOffers.length > 0) {
        const prices = diningOffers.map(o => Number(o.price)).filter(p => !isNaN(p) && p > 0);
        if (prices.length > 0) {
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setAvgDiningPrice(`$${min.toFixed(0)}-${max.toFixed(0)}`);
        } else {
          setAvgDiningPrice('$7');
        }
      } else {
        setAvgDiningPrice('$7');
      }

      // Calculate average grubhub price
      if (grubhubOffers.length > 0) {
        const prices = grubhubOffers.map(o => Number(o.price)).filter(p => !isNaN(p) && p > 0);
        if (prices.length > 0) {
          const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setAvgGrubhubPrice(`$${min.toFixed(0)}-${max.toFixed(0)}`);
        } else {
          setAvgGrubhubPrice('$7');
        }
      } else {
        setAvgGrubhubPrice('$7');
      }
    } catch (error) {
      console.error('Error loading average prices:', error);
      setAvgDiningPrice('$7');
      setAvgGrubhubPrice('$7');
    } finally {
      setLoadingPrices(false);
    }
  };

  const handleCreateOfferPress = () => {
    Alert.alert(
      'Choose Offer Type',
      'What type of offer would you like to create?',
      [
        {
          text: 'Dining Hall',
          onPress: () => onNavigate('create-dining'),
          style: 'default'
        },
        {
          text: 'Grubhub',
          onPress: () => onNavigate('create-grubhub'),
          style: 'default'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

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
          onPress={handleCreateOfferPress}
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
            {loadingPrices ? (
              <ActivityIndicator size="small" color="#003262" />
            ) : (
              <Text style={styles.infoCardPrice}>{avgDiningPrice}</Text>
            )}
            <Text style={styles.infoCardLabel}>Avg dining hall price</Text>
          </View>
          <View style={[styles.infoCard, styles.grubhubInfoCard]}>
            {loadingPrices ? (
              <ActivityIndicator size="small" color="#FDB515" />
            ) : (
              <Text style={[styles.infoCardPrice, styles.grubhubPrice]}>{avgGrubhubPrice}</Text>
            )}
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
