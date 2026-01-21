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
import BookScreen from './tabs/BookScreen';
import HistoryScreen from './tabs/HistoryScreen';
import ProfileScreen from './tabs/ProfileScreen';
import AutoMindScreen from './tabs/AutoMindScreen';
import VehiclesScreen from './tabs/VehiclesScreen';

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

// Dashboard Stack with nested navigation
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="Vehicles"
        component={VehiclesScreen}
        options={{ title: 'My Vehicles' }}
      />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let icon: 'home' | 'add-circle' | 'sparkles' | 'list' | 'person' = 'home';

          if (route.name === 'Dashboard') icon = 'home';
          else if (route.name === 'Book') icon = 'add-circle';
          else if (route.name === 'AutoMind') icon = 'sparkles';
          else if (route.name === 'History') icon = 'list';
          else if (route.name === 'Profile') icon = 'person';

          return <Ionicons name={icon as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{ title: 'Book Service' }}
      />
      <Tab.Screen
        name="AutoMind"
        component={AutoMindScreen}
        options={{ title: 'AutoMind AI' }}
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

