// ServiceBookerApp/src/navigation/ProfileStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import ProfileScreen from '../screens/ProfileScreen';
import VehicleListScreen from '../screens/VehicleListScreen'; // Placeholder for vehicle management
import SubscriptionScreen from '../screens/SubscriptionScreen'; // Placeholder for plans

const Stack = createNativeStackNavigator();

const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerTintColor: '#007bff' }}>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'My Account' }} 
      />
      <Stack.Screen 
        name="VehicleList" 
        component={VehicleListScreen} 
        options={{ title: 'My Vehicles' }} 
      />
      <Stack.Screen 
        name="SubscriptionDetails" 
        component={SubscriptionScreen} 
        options={{ title: 'Plans & Billing' }} 
      />
      {/* Placeholder for Vehicle Exchange Management Screen */}
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;