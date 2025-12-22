// ServiceBookerApp/src/navigation/MainTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Map, User } from 'lucide-react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

import { theme } from '../theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary, // Neon Cyan
        tabBarInactiveTintColor: theme.colors.textSecondary, // Slate
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          backgroundColor: theme.colors.background, // Deep Midnight
          borderTopColor: theme.colors.border,
          borderTopWidth: 1
        },
        tabBarIcon: ({ color, size }) => {
          let IconComponent;
          if (route.name === 'Home') {
            IconComponent = Map;
          } else if (route.name === 'ProfileStack') {
            IconComponent = User;
          }
          return IconComponent ? <IconComponent color={color} size={size} /> : null;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Command Center' }}
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