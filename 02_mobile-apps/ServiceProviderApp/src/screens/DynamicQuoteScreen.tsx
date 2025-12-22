
// ServiceProviderApp/src/screens/DynamicQuoteScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RefreshCcw, HardHat, DollarSign } from 'lucide-react-native';
import { submitDynamicQuote } from '../api'; // Import API function
import QuoteInput from '../components/QuoteInput'; // Import reusable input component

const COMMISSION_RATE = 0.20; // 20% platform commission (Matches backend logic)

const DynamicQuoteScreen: React.FC = () => {
    const [jobId, setJobId] = useState('102'); // Mock active job ID
    const [laborHours, setLaborHours] = useState('2');
    const [partsCost, setPartsCost] = useState('500');
    const [towingDistance, setTowingDistance] = useState('10');
    const [quoteDetails, setQuoteDetails] = useState({
        laborRate: 150.00,
        towingRate: 50.00,
        subTotal: 0,
        commission: 0,
        totalCustomerFee: 0,
        providerPayout: 0,
    });

    // Calculates and updates the quote details instantly
    const calculateQuote = () => {
        const hours = parseFloat(laborHours) || 0;
        const parts = parseFloat(partsCost) || 0;
        const distance = parseFloat(towingDistance) || 0;
        
        const laborFee = hours * quoteDetails.laborRate;
        const towingFee = distance * quoteDetails.towingRate;
        const subTotal = laborFee + parts + towingFee;

        // Financial Splits (Mirroring backend logic)
        const platformCommission = subTotal * COMMISSION_RATE;
        const providerPayout = subTotal - platformCommission;

        setQuoteDetails({
            ...quoteDetails,
            subTotal: parseFloat(subTotal.toFixed(2)),
            commission: parseFloat(platformCommission.toFixed(2)),
            providerPayout: parseFloat(providerPayout.toFixed(2)),
            totalCustomerFee: parseFloat(subTotal.toFixed(2)),
        });
    };

    // --- Submit Quote Logic ---
    const handleSubmitQuote = async () => {
        if (!jobId || quoteDetails.totalCustomerFee <= 0) {
            Alert.alert("Error", "Please enter a valid Job ID and ensure the fee is calculated.");
            return;
        }

        Alert.alert(
            "Confirm Quote",
            `Submit transparent quote of ₹${quoteDetails.totalCustomerFee} for Job #${jobId}?`,
            [
                { text: "Cancel", style: 'cancel' },
                { text: "Confirm", onPress: async () => {
                    try {
                        const payload = {
                            job_id: jobId,
                            total_amount: quoteDetails.totalCustomerFee,
                            commission_fee: quoteDetails.commission,
                            payout_amount: quoteDetails.providerPayout,
                            details: { laborHours, partsCost, towingDistance }
                        };

                        // API call to submit the dynamic quote (Customer must approve on their end)
                        await submitDynamicQuote(payload);
                        
                        Alert.alert("Success", "Quote submitted to customer for approval!");
                    } catch (error) {
                        Alert.alert("Error", "Failed to submit quote. Check connection.");
                    }
                }}
            ]
        );
    };

    // Recalculate quote whenever inputs change
    React.useEffect(() => {
        calculateQuote();
    }, [laborHours, partsCost, towingDistance]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dynamic Quote Tool</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={calculateQuote}>
                    <RefreshCcw size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Details</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Active Job ID (e.g., 102)"
                    value={jobId}
                    onChangeText={setJobId}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cost Breakdown</Text>
                <QuoteInput
                    label="Labor Hours"
                    value={laborHours}
                    onChangeText={setLaborHours}
                    icon="clock"
                    unit="hrs"
                />
                <QuoteInput
                    label="Towing Distance (km)"
                    value={towingDistance}
                    onChangeText={setTowingDistance}
                    icon="truck"
                    unit="km"
                />
                <QuoteInput
                    label="Parts Cost (₹)"
                    value={partsCost}
                    onChangeText={setPartsCost}
                    icon="dollar"
                    keyboardType="numeric"
                    unit="₹"
                />
            </View>

            <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Quote Summary</Text>
                <Text style={styles.summaryItem}>Sub-Total: ₹{quoteDetails.subTotal.toFixed(2)}</Text>
                <Text style={styles.summaryItem}>Platform Fee (20%): - ₹{quoteDetails.commission.toFixed(2)}</Text>
                <Text style={styles.summaryItem}>Your Payout: ₹{quoteDetails.providerPayout.toFixed(2)}</Text>
                <View style={styles.totalBar}>
                    <Text style={styles.totalText}>TOTAL CUSTOMER FEE</Text>
                    <Text style={styles.totalAmount}>₹{quoteDetails.totalCustomerFee.toFixed(2)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuote}>
                <Text style={styles.submitButtonText}>Submit Quote for Customer Approval</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F4F9', padding: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    refreshButton: { backgroundColor: '#FF8C00', padding: 10, borderRadius: 25 },
    section: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 5 },
    input: { flex: 1, height: 45, borderColor: '#DDD', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16 },
    
    summaryBox: { padding: 15, borderRadius: 10, backgroundColor: '#FFFBEA', borderWidth: 1, borderColor: '#FFD700' },
    summaryTitle: { fontSize: 20, fontWeight: 'bold', color: '#DAA520', marginBottom: 10 },
    summaryItem: { fontSize: 16, color: '#444', marginBottom: 5 },
    totalBar: { marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#FF8C00', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    totalAmount: { fontSize: 28, fontWeight: 'bold', color: '#FF8C00' },
    submitButton: { backgroundColor: '#28A745', padding: 18, borderRadius: 25, marginTop: 25, alignItems: 'center' },
    submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default DynamicQuoteScreen;