import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import type { Screen } from '../App';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

const diningHallListings = [
  {
    id: 1,
    name: 'Foothill',
    price: 6,
    rating: 4.8,
    timeWindow: '5:30–7:00 PM',
    sellerName: 'Sarah M.'
  },
  {
    id: 2,
    name: 'Cafe 3',
    price: 7,
    rating: 4.9,
    timeWindow: '6:00–8:00 PM',
    sellerName: 'Alex K.'
  },
  {
    id: 3,
    name: 'Clark Kerr',
    price: 6,
    rating: 4.7,
    timeWindow: '5:00–6:30 PM',
    sellerName: 'Jordan T.'
  },
  {
    id: 4,
    name: 'Crossroads',
    price: 8,
    rating: 5.0,
    timeWindow: '6:30–8:00 PM',
    sellerName: 'Taylor P.'
  },
];

const grubhubListings = [
  {
    id: 1,
    restaurant: 'Brown\'s Cafe',
    location: 'Unit 3 Lobby',
    price: 10,
    rating: 4.9,
    pickupTime: '6:45 PM',
    sellerName: 'Emma W.'
  },
  {
    id: 2,
    restaurant: 'Ladle and Leaf',
    location: 'Crossroads Entrance',
    price: 12,
    rating: 4.8,
    pickupTime: '7:15 PM',
    sellerName: 'Chris L.'
  },
  {
    id: 3,
    restaurant: 'Monsoon',
    location: 'Unit 1 Front Desk',
    price: 11,
    rating: 5.0,
    pickupTime: '6:30 PM',
    sellerName: 'Maya S.'
  },
];

export function HomeScreen({ onNavigate, activeTab, onTabChange }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buy Swipes</Text>
        <Text style={styles.headerSubtitle}>Find meal swipes from other Cal students</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Post Your Request CTA */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            onPress={() => onNavigate('create-buyer-request')}
            style={styles.ctaButton}
          >
            <View style={styles.ctaIconContainer}>
              <MaterialCommunityIcons name="plus-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Can't find what you need?</Text>
              <Text style={styles.ctaSubtitle}>Post your request and let sellers come to you</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#003262" />
          </TouchableOpacity>
        </View>

        {/* Dining Hall Swipes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dining Hall Swipe-ins</Text>
          
          <View style={styles.listingsContainer}>
            {diningHallListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.listingCard}
                onPress={() => onNavigate('order-details-dining')}
              >
                <View style={styles.listingHeader}>
                  <View style={styles.listingInfo}>
                    <Text style={styles.listingName}>{listing.name}</Text>
                    <View style={styles.ratingContainer}>
                      <MaterialCommunityIcons name="star" size={16} color="#FDB515" />
                      <Text style={styles.ratingText}>{listing.rating}</Text>
                      <Text style={styles.sellerText}> • {listing.sellerName}</Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${listing.price}</Text>
                  </View>
                </View>

                <View style={styles.timeContainer}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                  <Text style={styles.timeText}>{listing.timeWindow}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.requestButton, styles.diningButton]}
                  onPress={() => {}}
                >
                  <Text style={styles.requestButtonText}>Request Swipe</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Grubhub Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grubhub Orders</Text>
          
          <View style={styles.listingsContainer}>
            {grubhubListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={[styles.listingCard, styles.grubhubCard]}
                onPress={() => onNavigate('order-details-grubhub')}
              >
                <View style={styles.listingHeader}>
                  <View style={[styles.listingInfo, styles.flex1]}>
                    <Text style={styles.listingName}>{listing.restaurant}</Text>
                    <View style={styles.ratingContainer}>
                      <MaterialCommunityIcons name="star" size={16} color="#FDB515" />
                      <Text style={styles.ratingText}>{listing.rating}</Text>
                      <Text style={styles.sellerText}> • {listing.sellerName}</Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>${listing.price}</Text>
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{listing.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                    <Text style={styles.detailText}>Pickup: {listing.pickupTime}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.requestButton, styles.grubhubButton]}
                  onPress={() => {}}
                >
                  <Text style={styles.requestButtonText}>Request Order</Text>
                </TouchableOpacity>
              </TouchableOpacity>
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
    paddingBottom: 16,
  },
  ctaContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#003262',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ctaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#003262',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003262',
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  listingsContainer: {
    gap: 12,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  grubhubCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  listingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listingInfo: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  listingName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sellerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003262',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#111827',
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  requestButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diningButton: {
    backgroundColor: '#003262',
  },
  grubhubButton: {
    backgroundColor: '#FDB515',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
