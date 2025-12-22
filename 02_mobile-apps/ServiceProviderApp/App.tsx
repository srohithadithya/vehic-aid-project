// ServiceProviderApp/App.tsx - Definitive Final Code

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator'; // Assuming this correctly loads your navigation stack

function App(): React.JSX.Element {
  // Use the system's color scheme to set the status bar style
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = isDarkMode ? 'light-content' : 'dark-content';
  const logoSource = require('./src/assets/logo.png'); // Updated path

  return (
    // SafeAreaProvider is necessary for modern React Native applications
    <SafeAreaProvider>
      <StatusBar barStyle={backgroundStyle} />

      {/* AppNavigator component contains the NavigationContainer, 
        which wraps the entire app routing structure.
      */}
      <AppNavigator />

    </SafeAreaProvider>
  );
}

// Ensure the application is exported only once
export default App;