// ServiceBookerApp/src/components/Header.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Theme from '../styles/Theme';

interface HeaderProps {
    title: string;
    canGoBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, canGoBack = true }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {canGoBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft size={24} color={Theme.COLORS.primary} />
                    </TouchableOpacity>
                )}
                <Text style={styles.titleText}>{title}</Text>
                <View style={styles.placeholder} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Theme.COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: Theme.COLORS.border,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 55,
        paddingHorizontal: 15,
    },
    backButton: {
        padding: 5,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Theme.COLORS.darkText,
    },
    // Used to center the title when back button is present
    placeholder: {
        width: 34, 
    }
});

export default Header;