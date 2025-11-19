import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { OnboardingScreen } from './components/OnboardingScreen';
import { IDVerificationScreen } from './components/IDVerificationScreen';
import { HomeScreen } from './components/HomeScreen';
import { SellHubScreen } from './components/SellHubScreen';
import { CreateOfferDining } from './components/CreateOfferDining';
import { CreateOfferGrubhub } from './components/CreateOfferGrubhub';
import { CreateBuyerRequest } from './components/CreateBuyerRequest';
import { BuyerRequestsScreen } from './components/BuyerRequestsScreen';
import { OrderDetailsDining } from './components/OrderDetailsDining';
import { OrderDetailsGrubhub } from './components/OrderDetailsGrubhub';
import { OrdersBuyer } from './components/OrdersBuyer';
import { OrdersSeller } from './components/OrdersSeller';
import { RatingScreen } from './components/RatingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ChatScreen } from './components/ChatScreen';

export type Screen = 
  | 'onboarding'
  | 'id-verification'
  | 'home'
  | 'sell-hub'
  | 'create-dining'
  | 'create-grubhub'
  | 'create-buyer-request'
  | 'buyer-requests'
  | 'order-details-dining'
  | 'order-details-grubhub'
  | 'orders-buyer'
  | 'orders-seller'
  | 'rating'
  | 'profile'
  | 'chat-dining'
  | 'chat-grubhub';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [bottomNav, setBottomNav] = useState<'buy' | 'sell' | 'orders' | 'profile'>('buy');

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleBottomNavChange = (tab: 'buy' | 'sell' | 'orders' | 'profile') => {
    setBottomNav(tab);
    if (tab === 'buy') setCurrentScreen('home');
    else if (tab === 'sell') setCurrentScreen('sell-hub');
    else if (tab === 'orders') setCurrentScreen('orders-buyer');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onGetStarted={() => handleNavigate('id-verification')} />
        )}
        {currentScreen === 'id-verification' && (
          <IDVerificationScreen onComplete={() => handleNavigate('home')} />
        )}
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'sell-hub' && (
          <SellHubScreen 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'create-dining' && (
          <CreateOfferDining 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'create-grubhub' && (
          <CreateOfferGrubhub 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'create-buyer-request' && (
          <CreateBuyerRequest 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'buyer-requests' && (
          <BuyerRequestsScreen 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'order-details-dining' && (
          <OrderDetailsDining onNavigate={handleNavigate} />
        )}
        {currentScreen === 'order-details-grubhub' && (
          <OrderDetailsGrubhub onNavigate={handleNavigate} />
        )}
        {currentScreen === 'orders-buyer' && (
          <OrdersBuyer 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'orders-seller' && (
          <OrdersSeller 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'rating' && (
          <RatingScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen 
            onNavigate={handleNavigate}
            activeTab={bottomNav}
            onTabChange={handleBottomNavChange}
          />
        )}
        {currentScreen === 'chat-dining' && (
          <ChatScreen onNavigate={handleNavigate} orderType="dining" />
        )}
        {currentScreen === 'chat-grubhub' && (
          <ChatScreen onNavigate={handleNavigate} orderType="grubhub" />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
