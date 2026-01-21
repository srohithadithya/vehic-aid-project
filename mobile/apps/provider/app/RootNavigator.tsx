import { useAuth } from '@vehic-aid/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@vehic-aid/ui';

// Auth Screens
import LoginScreen from './auth/LoginScreen';
import SignupScreen from './auth/SignupScreen';

// Main Screens
import DashboardScreen from './tabs/DashboardScreen';
import JobsScreen from './tabs/JobsScreen';
import EarningsScreen from './tabs/EarningsScreen';
import HistoryScreen from './tabs/HistoryScreen';
import ProfileScreen from './tabs/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let icon: 'home' | 'briefcase' | 'cash' | 'list' | 'person' = 'home';

          if (route.name === 'Dashboard') icon = 'home';
          else if (route.name === 'Jobs') icon = 'briefcase';
          else if (route.name === 'Earnings') icon = 'cash';
          else if (route.name === 'History') icon = 'list';
          else if (route.name === 'Profile') icon = 'person';

          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{ title: 'Available Jobs' }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ title: 'Earnings' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
}
