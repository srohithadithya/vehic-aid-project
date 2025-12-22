// ServiceProviderApp/src/components/StatusToggle.tsx

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { Power } from 'lucide-react-native';
import { updateProviderStatus } from '../api'; // Assumed import from api/index.ts

interface StatusToggleProps {
  initialStatus: boolean;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ initialStatus }) => {
  const [isEnabled, setIsEnabled] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSwitch = async () => {
    // Only toggle if not currently loading
    if (isLoading) return;

    const newState = !isEnabled;
    setIsLoading(true);
    
    // --- Mock Location Data for Demo ---
    // In a real app, you would use Geolocation API here:
    const mockLat = 28.6139 + (newState ? 0.01 : 0); 
    const mockLng = 77.2090 + (newState ? 0.01 : 0);
    
    try {
        // Send status and current location to the backend
        await updateProviderStatus(newState, mockLat, mockLng);
        setIsEnabled(newState); // Commit change only after successful API call
        
    } catch (error) {
        console.error("Failed to update status:", error);
        // Revert UI state on failure
        alert(`Failed to go ${newState ? 'Online' : 'Offline'}. Check network.`);
        
    } finally {
        setIsLoading(false);
    }
  };

  const statusText = isEnabled ? 'ONLINE - Accepting Jobs' : 'OFFLINE - Unavailable';
  const statusColor = isEnabled ? '#28A745' : '#6C757D';

  return (
    <View style={styles.container}>
      <View style={styles.statusDisplay}>
        <Power size={20} color={statusColor} />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {isLoading ? 'UPDATING...' : statusText}
        </Text>
      </View>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#007bff' : '#F4F3F4'}
        ios_backgroundColor="#3E3E3E"
        onValueChange={toggleSwitch}
        value={isEnabled}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator style={styles.spinner} size="small" color="#007bff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statusDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  spinner: {
      marginLeft: 10,
  }
});

export default StatusToggle;