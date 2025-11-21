import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomNav } from './BottomNav';
import { getMyProfile, auth } from '../services/api';
import { supabase } from '../services/supabase';
import type { Screen } from '../App';
import type { Profile } from '../services/api';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function ProfileScreen({ onNavigate, activeTab, onTabChange }: ProfileScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      const userProfile = await getMyProfile();
      if (!userProfile) {
        // User not authenticated or no profile found/created
        setProfile(null);
        return;
      }
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      // Don't show alert for profile loading errors, just set to null
      // The UI will show appropriate message
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onNavigate('login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003262" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>
          {isAuthenticated 
            ? 'Unable to load profile. Please try refreshing or contact support.' 
            : 'No profile found. Please sign in.'}
        </Text>
        {isAuthenticated && (
          <TouchableOpacity 
            style={[styles.submitButton, { marginTop: 16, paddingHorizontal: 24 }]} 
            onPress={loadProfile}
          >
            <Text style={styles.submitButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const rating = profile.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profile.full_name)}</Text>
          </View>
          <Text style={styles.name}>{profile.full_name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons 
                key={star} 
                name={star <= fullStars ? 'star' : (star === fullStars + 1 && hasHalfStar ? 'star-half-full' : 'star-outline')} 
                size={24} 
                color="#FDB515" 
              />
            ))}
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.total_sales || 0}</Text>
              <Text style={styles.statLabel}>Sales</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.total_purchases || 0}</Text>
              <Text style={styles.statLabel}>Purchases</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.total_ratings || 0}</Text>
              <Text style={styles.statLabel}>Ratings</Text>
            </View>
          </View>
        </View>
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('orders-buyer')}>
            <MaterialCommunityIcons name="receipt" size={24} color="#003262" />
            <Text style={styles.menuText}>My Orders</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="credit-card" size={24} color="#003262" />
            <Text style={styles.menuText}>Payment Methods</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={24} color="#003262" />
            <Text style={styles.menuText}>Help & Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="#DC2626" />
            <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  header: { paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24, backgroundColor: '#003262' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, gap: 24 },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#003262', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 28, fontWeight: '600', color: '#FFFFFF' },
  name: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 16 },
  ratingText: { fontSize: 16, fontWeight: '600', color: '#111827', marginLeft: 8 },
  statsContainer: { flexDirection: 'row', gap: 24, marginTop: 8 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#003262', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280' },
  menuSection: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 16 },
  menuText: { flex: 1, fontSize: 16, color: '#111827' },
  logoutText: { color: '#DC2626' },
  submitButton: { backgroundColor: '#003262', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
