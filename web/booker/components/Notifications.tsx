'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number; // milliseconds, 0 for persistent
}

interface NotificationProps {
    notification: Notification;
    onClose: (id: string) => void;
}

const NotificationItem = ({ notification, onClose }: NotificationProps) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, notification.duration);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(notification.id);
        }, 300);
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5" />;
            case 'info':
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
            case 'info':
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
        }
    };

    return (
        <div
            className={clsx(
                'flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300',
                getStyles(),
                isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
            )}
        >
            <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{notification.title}</p>
                <p className="text-sm mt-1 opacity-90">{notification.message}</p>
            </div>
            <button
                onClick={handleClose}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

interface NotificationContainerProps {
    notifications: Notification[];
    onClose: (id: string) => void;
}

export function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
            <div className="space-y-3 pointer-events-auto">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={onClose}
                    />
                ))}
            </div>
        </div>
    );
}

// Hook for managing notifications
export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (
        type: NotificationType,
        title: string,
        message: string,
        duration: number = 5000
    ) => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const notification: Notification = {
            id,
            type,
            title,
            message,
            duration,
        };

        setNotifications((prev) => [...prev, notification]);
        return id;
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const success = (title: string, message: string, duration?: number) => {
        return addNotification('success', title, message, duration);
    };

    const error = (title: string, message: string, duration?: number) => {
        return addNotification('error', title, message, duration);
    };

    const info = (title: string, message: string, duration?: number) => {
        return addNotification('info', title, message, duration);
    };

    const warning = (title: string, message: string, duration?: number) => {
        return addNotification('warning', title, message, duration);
    };

    return {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        info,
        warning,
    };
}
