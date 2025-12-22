// ServiceBookerApp/src/services/locationService.ts

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

interface Coords {
    latitude: number;
    longitude: number;
}

const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
    }

    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
};

export const getCurrentLocation = async (): Promise<Coords> => {
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
        throw new Error("Location permission denied by the user.");
    }

    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                // Error codes 1: PERMISSION_DENIED, 2: POSITION_UNAVAILABLE, 3: TIMEOUT
                reject(new Error(`Geolocation error (${error.code}): ${error.message}`));
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    });
};