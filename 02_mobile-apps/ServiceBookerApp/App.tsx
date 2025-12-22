// ServiceProviderApp/App.tsx - Definitive Final Code
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator'; // <--- CRITICAL: Your custom router

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={backgroundStyle} />
      {/* This is the component that holds ALL your app logic */}
      <AppNavigator /> 
    </SafeAreaProvider>
  );
}

export default App; // <--- The correct, single export