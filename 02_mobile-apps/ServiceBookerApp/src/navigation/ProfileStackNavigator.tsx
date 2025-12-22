// ServiceBookerApp/src/navigation/ProfileStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import ProfileScreen from '../screens/ProfileScreen';
import VehicleListScreen from '../screens/VehicleListScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

const Stack = createNativeStackNavigator();

const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true, 
        headerTintColor: '#007bff', // Blue icon/text color
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'My Account' }} 
      />
      <Stack.Screen 
        name="VehicleList" 
        component={VehicleListScreen} 
        options={{ title: 'Manage Vehicles' }} 
      />
      <Stack.Screen 
        name="SubscriptionDetails" 
        component={SubscriptionScreen} 
        options={{ title: 'Plans & Billing' }} 
      />
      {/* Additional screens (e.g., VehicleExchangeDetails) would be added here */}
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;