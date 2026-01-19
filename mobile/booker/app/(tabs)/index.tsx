import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooking } from '../../src/context/BookingContext';
import ServiceSelection from '../../components/wizard/ServiceSelection';
import VehicleInfo from '../../components/wizard/VehicleInfo';
import LocationConfirm from '../../components/wizard/LocationConfirm';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';

export default function BookingWizardScreen() {
  const { state } = useBooking();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <ServiceSelection />;
      case 2:
        return <VehicleInfo />;
      case 3:
        return <LocationConfirm />;
      default:
        return <ServiceSelection />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.wizardContainer}>
        {renderStep()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wizardContainer: {
    flex: 1,
  },
});
