// ServiceBookerApp/src/components/ServiceButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import * as Theme from '../styles/Theme'; // Assuming Theme file is defined for colors

interface ServiceButtonProps {
    label: string;
    Icon: LucideIcon;
    color: string;
    onPress: () => void;
    disabled?: boolean;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ label, Icon, color, onPress, disabled = false }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: disabled ? Theme.COLORS.lightGray : Theme.COLORS.white }]}
            onPress={onPress}
            disabled={disabled}
        >
            <Icon size={30} color={color} />
            <Text style={[styles.label, { color: Theme.COLORS.darkText }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 90,
        height: 90,
        borderRadius: 15,
        marginHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
});

export default ServiceButton;