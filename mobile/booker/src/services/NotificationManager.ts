import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiClient } from '../api/client';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: 'your-project-id' // Ideally from Constants.expoConfig.extra.eas.projectId
        })).data;

        console.log("Expo Push Token:", token);

        // Register token with backend
        try {
            await apiClient.post('/users/notifications/register/', { token, platform: Platform.OS });
        } catch (e) {
            console.error("Failed to register push token with backend", e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export function setupNotificationListeners(
    onReceived: (notification: Notifications.Notification) => void,
    onResponse: (response: Notifications.NotificationResponse) => void
) {
    const notificationListener = Notifications.addNotificationReceivedListener(onReceived);
    const responseListener = Notifications.addNotificationResponseReceivedListener(onResponse);

    return () => {
        notificationListener.remove();
        responseListener.remove();
    };
}
