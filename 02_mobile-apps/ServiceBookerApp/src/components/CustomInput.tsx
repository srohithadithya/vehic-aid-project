// ServiceBookerApp/src/components/CustomInput.tsx

import React from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardTypeOptions } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import * as Theme from '../styles/Theme';

interface CustomInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    Icon: LucideIcon;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    error?: string | null;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
    placeholder, 
    value, 
    onChangeText, 
    Icon, 
    secureTextEntry = false, 
    keyboardType = 'default',
    error 
}) => {
    return (
        <View style={styles.container}>
            <View style={[styles.inputGroup, error && styles.inputError]}>
                <Icon size={20} color={error ? Theme.COLORS.danger : Theme.COLORS.darkText} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    placeholderTextColor={Theme.COLORS.gray}
                    autoCapitalize="none"
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.COLORS.white,
        borderRadius: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: Theme.COLORS.border,
    },
    inputError: {
        borderColor: Theme.COLORS.danger,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: Theme.COLORS.darkText,
    },
    errorText: {
        color: Theme.COLORS.danger,
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    }
});

export default CustomInput;