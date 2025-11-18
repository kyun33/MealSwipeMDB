import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SellHubScreen from '../screens/SellHubScreen';
import BuyerRequestsScreen from '../screens/BuyerRequestsScreen';
import OrdersBuyer from '../screens/OrdersBuyer';
import OrdersSeller from '../screens/OrdersSeller';
import ChatScreen from '../screens/ChatScreen';
import CreateBuyerRequest from '../screens/CreateBuyerRequest';
import CreateOfferDining from '../screens/CreateOfferDining';
import CreateOfferGrubhub from '../screens/CreateOfferGrubhub';
import OrderDetailsDining from '../screens/OrderDetailsDining';
import OrderDetailsGrubhub from '../screens/OrderDetailsGrubhub';
import ProfileScreen from '../screens/ProfileScreen';
import RatingScreen from '../screens/RatingScreen';
import IDVerificationScreen from '../screens/IDVerificationScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import BottomNav from '../components/BottomNav';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="SellHub" component={SellHubScreen} />
        <Tab.Screen name="BuyerRequests" component={BuyerRequestsScreen} />
        <Tab.Screen name="OrdersBuyer" component={OrdersBuyer} />
        <Tab.Screen name="OrdersSeller" component={OrdersSeller} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="CreateBuyerRequest" component={CreateBuyerRequest} />
        <Tab.Screen name="CreateOfferDining" component={CreateOfferDining} />
        <Tab.Screen name="CreateOfferGrubhub" component={CreateOfferGrubhub} />
        <Tab.Screen name="OrderDetailsDining" component={OrderDetailsDining} />
        <Tab.Screen name="OrderDetailsGrubhub" component={OrderDetailsGrubhub} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Rating" component={RatingScreen} />
        <Tab.Screen name="IDVerification" component={IDVerificationScreen} />
        <Tab.Screen name="Onboarding" component={OnboardingScreen} />
      </Tab.Navigator>
  );
};

export default RootNavigator;