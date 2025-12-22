// ServiceBookerApp/src/navigation/MainTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Map, User, Settings, List, DollarSign } from 'lucide-react-native';

// Screens
import HomeScreen from '../screens/HomeScreen'; // This will be replaced by JobQueueScreen
import JobQueueScreen from '../screens/JobQueueScreen'; // New screen
import EarningsScreen from '../screens/EarningsScreen'; // New screen
import ProfileStackNavigator from './ProfileStackNavigator';

import { theme } from '../theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.success, // Neon Green for Providers
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1
        },
        tabBarIcon: ({ color, size }) => {
          let IconComponent;
          if (route.name === 'Dashboard') {
            IconComponent = List;
          } else if (route.name === 'Earnings') {
            IconComponent = DollarSign;
          } else if (route.name === 'ProfileStack') {
            IconComponent = User;
          }
          return IconComponent ? <IconComponent color={color} size={size} /> : null;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={JobQueueScreen}
        options={{ title: 'My Jobs' }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ title: 'Earnings' }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;