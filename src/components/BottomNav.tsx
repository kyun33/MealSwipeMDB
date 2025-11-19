import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BottomNavProps {
  activeTab: 'buy' | 'sell' | 'orders' | 'profile';
  onTabChange: (tab: 'buy' | 'sell' | 'orders' | 'profile') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'buy' as const, icon: 'shopping' as const, label: 'Buy' },
    { id: 'sell' as const, icon: 'plus-circle' as const, label: 'Sell' },
    { id: 'orders' as const, icon: 'receipt' as const, label: 'Orders' },
    { id: 'profile' as const, icon: 'account' as const, label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tab}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={24}
                color={isActive ? '#003262' : '#9CA3AF'}
              />
              <Text style={[
                styles.tabLabel,
                { color: isActive ? '#003262' : '#9CA3AF', fontWeight: isActive ? '600' : '500' }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontSize: 11,
  },
});
