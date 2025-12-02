import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import { getDiningOffers, getGrubhubOffers, getProfileById, createOrder, updateDiningOffer, updateGrubhubOffer, auth } from '../services/api';
import type { Screen } from '../App';
import type { DiningOffer, GrubhubOffer } from '../services/api';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

interface ListingWithSeller {
  id: string;
  name: string;
  price: number;
  rating: number;
  sellerName: string;
  timeWindow?: string;
  pickupTime?: string;
  location?: string;
  offer: DiningOffer | GrubhubOffer;
}

export function HomeScreen({ onNavigate, activeTab, onTabChange }: HomeScreenProps) {
  const [diningListings, setDiningListings] = useState<ListingWithSeller[]>([]);
  const [grubhubListings, setGrubhubListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Reload data when the screen becomes active (user navigates back to buy tab)
  useEffect(() => {
    if (activeTab === 'buy') {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await auth.getCurrentUser();
      setCurrentUserId(user?.id || null);

      // Fetch active offers
      const [diningOffers, grubhubOffers] = await Promise.all([
        getDiningOffers({ status: 'active' }),
        getGrubhubOffers({ status: 'active' })
      ]);

      // Filter out user's own offers
      const filteredDiningOffers = currentUserId 
        ? diningOffers.filter(offer => offer.seller_id !== currentUserId)
        : diningOffers;
      const filteredGrubhubOffers = currentUserId 
        ? grubhubOffers.filter(offer => offer.seller_id !== currentUserId)
        : grubhubOffers;

      // Fetch seller profiles for dining offers
      const diningWithSellers = await Promise.all(
        filteredDiningOffers.map(async (offer) => {
          const seller = await getProfileById(offer.seller_id);
          const diningHallNames: Record<string, string> = {
            foothill: 'Foothill',
            cafe3: 'Cafe 3',
            clarkkerr: 'Clark Kerr',
            crossroads: 'Crossroads'
          };
          return {
            id: offer.id,
            name: diningHallNames[offer.dining_hall] || offer.dining_hall,
            price: Number(offer.price),
            rating: seller?.rating || 0,
            sellerName: seller?.full_name?.split(' ')[0] + ' ' + (seller?.full_name?.split(' ')[1]?.[0] || '') + '.' || 'Seller',
            timeWindow: `${offer.start_time}–${offer.end_time}`,
            offer
          };
        })
      );

      // Fetch seller profiles for grubhub offers
      const grubhubWithSellers = await Promise.all(
        filteredGrubhubOffers.map(async (offer) => {
          const seller = await getProfileById(offer.seller_id);
          
          // Extract time window from notes if present
          let timeWindow: string | undefined;
          if (offer.notes) {
            const timeMatch = offer.notes.match(/Time window:\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
            if (timeMatch) {
              timeWindow = `${timeMatch[1]}–${timeMatch[2]}`;
            }
          }
          
          return {
            id: offer.id,
            name: 'Grubhub Meal Swipe',
            price: Number(offer.price),
            rating: seller?.rating || 0,
            sellerName: seller?.full_name?.split(' ')[0] + ' ' + (seller?.full_name?.split(' ')[1]?.[0] || '') + '.' || 'Seller',
            location: offer.pickup_location,
            timeWindow: timeWindow,
            offer
          };
        })
      );

      setDiningListings(diningWithSellers);
      setGrubhubListings(grubhubWithSellers);
    } catch (error) {
      console.error('Error loading offers:', error);
      Alert.alert('Error', 'Failed to load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwipe = async (offer: DiningOffer | GrubhubOffer, type: 'dining' | 'grubhub') => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please sign in to request a swipe');
      return;
    }

    // Prevent users from requesting their own offers
    if (offer.seller_id === currentUserId) {
      Alert.alert('Error', 'You cannot request your own offer');
      return;
    }

    try {
      if (type === 'dining') {
        const diningOffer = offer as DiningOffer;
        
        // Create the order
        await createOrder({
          order_type: 'dining_offer',
          dining_offer_id: diningOffer.id,
          buyer_id: currentUserId,
          seller_id: diningOffer.seller_id,
          item_type: 'dining',
          dining_hall: diningOffer.dining_hall,
          pickup_date: diningOffer.offer_date,
          pickup_time_start: diningOffer.start_time,
          pickup_time_end: diningOffer.end_time,
          price: Number(diningOffer.price)
        });
        
        // Immediately remove from local state for instant UI update (before update call)
        setDiningListings(prev => prev.filter(listing => listing.id !== diningOffer.id));
        
        // Mark the offer as sold so it disappears from the buy page (non-blocking)
        // If this fails, the offer is already removed from UI, so it's fine
        updateDiningOffer(diningOffer.id, { status: 'sold' }).catch(err => {
          console.warn('Failed to update dining offer status (non-critical):', err);
        });
      } else {
        const grubhubOffer = offer as GrubhubOffer;
        
        // Extract time window from notes
        let pickupTimeStart = '12:00';
        let pickupTimeEnd: string | undefined;
        if (grubhubOffer.notes) {
          const timeMatch = grubhubOffer.notes.match(/Time window:\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          if (timeMatch) {
            pickupTimeStart = timeMatch[1];
            pickupTimeEnd = timeMatch[2];
          }
        }
        
        // Create the order
        await createOrder({
          order_type: 'grubhub_offer',
          grubhub_offer_id: grubhubOffer.id,
          buyer_id: currentUserId,
          seller_id: grubhubOffer.seller_id,
          item_type: 'grubhub',
          restaurant: grubhubOffer.restaurant,
          pickup_location: grubhubOffer.pickup_location,
          pickup_date: grubhubOffer.offer_date,
          pickup_time_start: pickupTimeStart,
          pickup_time_end: pickupTimeEnd,
          price: Number(grubhubOffer.price)
        });
        
        // Immediately remove from local state for instant UI update (before update call)
        setGrubhubListings(prev => prev.filter(listing => listing.id !== grubhubOffer.id));
        
        // Mark the offer as sold so it disappears from the buy page (non-blocking)
        // If this fails, the offer is already removed from UI, so it's fine
        updateGrubhubOffer(grubhubOffer.id, { status: 'sold' }).catch(err => {
          console.warn('Failed to update grubhub offer status (non-critical):', err);
        });
      }
      
      Alert.alert('Success', 'Order created successfully!');
      // Reload data to refresh the offers list (in case user navigates back)
      loadData();
      onNavigate('orders-buyer');
    } catch (error: any) {
      console.error('Error creating order:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      Alert.alert(
        'Error Creating Order', 
        error.message || error.details || 'Failed to create order. Please try again.\n\nIf this persists, the order may have been created - please check your orders.'
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003262" />
        <Text style={styles.loadingText}>Loading offers...</Text>
      </View>
    );
  }

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
          
          {diningListings.length === 0 ? (
            <Text style={styles.emptyText}>No dining hall offers available</Text>
          ) : (
            <View style={styles.listingsContainer}>
              {diningListings.map((listing) => (
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
                        <Text style={styles.ratingText}>{listing.rating.toFixed(1)}</Text>
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
                    onPress={() => handleRequestSwipe(listing.offer, 'dining')}
                  >
                    <Text style={styles.requestButtonText}>Request Swipe</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Grubhub Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grubhub Orders</Text>
          
          {grubhubListings.length === 0 ? (
            <Text style={styles.emptyText}>No Grubhub offers available</Text>
          ) : (
            <View style={styles.listingsContainer}>
              {grubhubListings.map((listing) => (
                <TouchableOpacity
                  key={listing.id}
                  style={[styles.listingCard, styles.grubhubCard]}
                  onPress={() => onNavigate('order-details-grubhub')}
                >
                  <View style={styles.listingHeader}>
                    <View style={[styles.listingInfo, styles.flex1]}>
                      <Text style={styles.listingName}>{listing.name}</Text>
                      <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={16} color="#FDB515" />
                        <Text style={styles.ratingText}>{listing.rating.toFixed(1)}</Text>
                        <Text style={styles.sellerText}> • {listing.sellerName}</Text>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>${listing.price}</Text>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    {listing.location && (
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="map-marker-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{listing.location}</Text>
                      </View>
                    )}
                    {listing.timeWindow && (
                      <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#111827" />
                        <Text style={styles.detailText}>{listing.timeWindow}</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.requestButton, styles.grubhubButton]}
                    onPress={() => handleRequestSwipe(listing.offer, 'grubhub')}
                  >
                    <Text style={styles.requestButtonText}>Request Order</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
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
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 24,
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
