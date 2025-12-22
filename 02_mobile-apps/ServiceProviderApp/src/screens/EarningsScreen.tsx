// ServiceProviderApp/src/screens/EarningsScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Clock, CheckCheck } from 'lucide-react-native';
import { getEarningsHistory } from '../api';
import { theme } from '../theme'; // Cosmic Glass Theme

interface Settlement {
    id: number;
    date: string;
    payout_amount: number;
    status: 'PROCESSED' | 'PENDING';
    transaction_count: number;
}

// Mock Data Structure
const mockSettlements: Settlement[] = [
    { id: 1, date: '2025-10-10', payout_amount: 8500.50, status: 'PROCESSED', transaction_count: 12 },
    { id: 2, date: '2025-10-11', payout_amount: 12450.00, status: 'PROCESSED', transaction_count: 18 },
    { id: 3, date: '2025-10-12', payout_amount: 5000.00, status: 'PENDING', transaction_count: 6 },
];

const EarningsScreen: React.FC = () => {
    const [totalDue, setTotalDue] = useState(5000.00);
    const [settlements, setSettlements] = useState<Settlement[]>(mockSettlements);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchEarnings = async () => {
        setIsRefreshing(true);
        try {
            // API call to fetch total due and settlement history
            const historyResponse = await getEarningsHistory();
            setTotalDue(historyResponse.total_due || 0);
            setSettlements(historyResponse.history || mockSettlements);
        } catch (error) {
            console.error('Failed to fetch earnings:', error);
            setSettlements(mockSettlements);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const renderSettlementItem = (item: Settlement) => (
        <View style={styles.settlementCard} key={item.id}>
            <View style={styles.dateStatus}>
                <Text style={styles.dateText}>Payout for {item.date}</Text>
                <View style={[styles.statusBadge, item.status === 'PROCESSED' ? styles.statusProcessed : styles.statusPending]}>
                    {item.status === 'PROCESSED' ? <CheckCheck size={12} color="#000" /> : <Clock size={12} color="#000" />}
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount Settled</Text>
                <Text style={styles.payoutAmount}>₹{item.payout_amount.toFixed(2)}</Text>
            </View>
            <Text style={styles.transactionCount}>{item.transaction_count} transactions included</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Earnings & Payouts</Text>
            </View>

            <View style={styles.dueCard}>
                <Text style={styles.dueLabel}>Total Pending Payout (Today's Earnings)</Text>
                <Text style={styles.dueAmount}>₹{totalDue.toFixed(2)}</Text>
                <Text style={styles.noteText}>Payout will be processed tonight via Daily Settlement.</Text>
            </View>

            <Text style={styles.historyTitle}>Settlement History</Text>

            <ScrollView
                style={styles.historyContainer}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchEarnings} pintColor={theme.colors.primary} />}
            >
                {settlements.map(renderSettlementItem)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 20, backgroundColor: theme.colors.surface, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },

    dueCard: {
        margin: 20,
        padding: 20,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.glass.backgroundColor,
        borderColor: theme.colors.primary,
        borderWidth: 1,
    },
    dueLabel: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 5 },
    dueAmount: { fontSize: 36, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 10 },
    noteText: { fontSize: 12, color: theme.colors.textSecondary, fontStyle: 'italic' },

    historyTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginHorizontal: 20, marginTop: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 5 },
    historyContainer: { flex: 1, paddingHorizontal: 20, marginTop: 10 },

    settlementCard: { backgroundColor: theme.colors.surface, padding: 15, borderRadius: theme.borderRadius.m, marginBottom: 15, borderWidth: 1, borderColor: theme.colors.border },
    dateStatus: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 8, marginBottom: 8 },
    dateText: { fontSize: 14, fontWeight: '600', color: theme.colors.text },

    statusBadge: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignItems: 'center' },
    statusProcessed: { backgroundColor: theme.colors.success },
    statusPending: { backgroundColor: '#F59E0B' }, // Amber
    statusText: { color: '#000', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },

    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { fontSize: 14, color: theme.colors.textSecondary },
    payoutAmount: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text }, // White text
    transactionCount: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 5 },
});

export default EarningsScreen;
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Clock, CheckCheck } from 'lucide-react-native';
import { getEarningsHistory } from '../api'; // Import API function

interface Settlement {
    id: number;
    date: string;
    payout_amount: number;
    status: 'PROCESSED' | 'PENDING';
    transaction_count: number;
}

// Mock Data Structure
const mockSettlements: Settlement[] = [
    { id: 1, date: '2025-10-10', payout_amount: 8500.50, status: 'PROCESSED', transaction_count: 12 },
    { id: 2, date: '2025-10-11', payout_amount: 12450.00, status: 'PROCESSED', transaction_count: 18 },
    { id: 3, date: '2025-10-12', payout_amount: 5000.00, status: 'PENDING', transaction_count: 6 },
];

const EarningsScreen: React.FC = () => {
    const [totalDue, setTotalDue] = useState(5000.00); // Initialize with mock pending amount
    const [settlements, setSettlements] = useState<Settlement[]>(mockSettlements);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchEarnings = async () => {
        setIsRefreshing(true);
        try {
            // API call to fetch total due and settlement history
            const historyResponse = await getEarningsHistory();

            setTotalDue(historyResponse.total_due || 0);
            setSettlements(historyResponse.history || mockSettlements);
        } catch (error) {
            console.error('Failed to fetch earnings:', error);
            // Fallback to mock data if API fails
            setSettlements(mockSettlements);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const renderSettlementItem = (item: Settlement) => (
        <View style={styles.settlementCard} key={item.id}>
            <View style={styles.dateStatus}>
                <Text style={styles.dateText}>Payout for {item.date}</Text>
                <View style={[styles.statusBadge, item.status === 'PROCESSED' ? styles.statusProcessed : styles.statusPending]}>
                    {item.status === 'PROCESSED' ? <CheckCheck size={14} color="#FFFFFF" /> : <Clock size={14} color="#FFFFFF" />}
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount Settled</Text>
                <Text style={styles.payoutAmount}>₹{item.payout_amount.toFixed(2)}</Text>
            </View>
            <Text style={styles.transactionCount}>{item.transaction_count} transactions included</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Earnings & Payouts</Text>
            </View>

            <View style={styles.dueCard}>
                <Text style={styles.dueLabel}>Total Pending Payout (Today's Earnings)</Text>
                <Text style={styles.dueAmount}>₹{totalDue.toFixed(2)}</Text>
                <Text style={styles.noteText}>Payout will be processed tonight via Daily Settlement.</Text>
            </View>

            <Text style={styles.historyTitle}>Settlement History</Text>

            <ScrollView
                style={styles.historyContainer}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={fetchEarnings} />}
            >
                {settlements.map(renderSettlementItem)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { padding: 15, backgroundColor: '#1E293B', alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },

    dueCard: { margin: 15, padding: 20, borderRadius: 10, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 5, borderWidth: 1, borderColor: '#FFD700' },
    dueLabel: { fontSize: 16, color: '#666', marginBottom: 5 },
    dueAmount: { fontSize: 36, fontWeight: 'bold', color: '#FF8C00', marginBottom: 10 },
    noteText: { fontSize: 12, color: '#999' },

    historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginHorizontal: 15, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 5 },
    historyContainer: { flex: 1, paddingHorizontal: 15, marginTop: 10 },

    settlementCard: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
    dateStatus: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 8, marginBottom: 8 },
    dateText: { fontSize: 14, fontWeight: '600', color: '#444' },

    statusBadge: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 15, alignItems: 'center' },
    statusProcessed: { backgroundColor: '#28A745' },
    statusPending: { backgroundColor: '#FF8C00' },
    statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },

    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { fontSize: 16, color: '#333' },
    payoutAmount: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
    transactionCount: { fontSize: 12, color: '#999', marginTop: 5 },
});

export default EarningsScreen;