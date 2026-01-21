import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, colors, spacing } from '@vehic-aid/ui';
import { SERVICE_TYPES, SERVICE_TYPE_LABELS } from '../constants';

interface EarningsData {
  id: string;
  amount: number;
  service: string;
  date: string;
  status: 'completed' | 'pending' | 'withdrawn';
}

interface MonthlyEarnings {
  month: string;
  earnings: number;
  jobs: number;
}

export default function EarningsScreen() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const MOCK_EARNINGS: EarningsData[] = [
    {
      id: '1',
      amount: 450,
      service: SERVICE_TYPES.TOWING,
      date: '2024-01-15 14:30',
      status: 'completed',
    },
    {
      id: '2',
      amount: 650,
      service: SERVICE_TYPES.MECHANIC,
      date: '2024-01-15 10:15',
      status: 'completed',
    },
    {
      id: '3',
      amount: 950,
      service: SERVICE_TYPES.FLATBED_TOWING,
      date: '2024-01-14 16:45',
      status: 'completed',
    },
    {
      id: '4',
      amount: 200,
      service: SERVICE_TYPES.FUEL_DELIVERY,
      date: '2024-01-14 09:20',
      status: 'pending',
    },
    {
      id: '5',
      amount: 350,
      service: SERVICE_TYPES.BATTERY_JUMP,
      date: '2024-01-13 15:10',
      status: 'completed',
    },
  ];

  const MONTHLY_EARNINGS: MonthlyEarnings[] = [
    { month: 'December', earnings: 78500, jobs: 112 },
    { month: 'January', earnings: 89500, jobs: 128 },
    { month: 'February', earnings: 92100, jobs: 135 },
  ];

  const totalEarnings = MOCK_EARNINGS.reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = MOCK_EARNINGS.filter((e) => e.status === 'pending').reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const withdrawnThisMonth = 65000;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    if (amount > totalEarnings - withdrawnThisMonth) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance to withdraw');
      return;
    }
    Alert.alert(
      'Withdrawal Confirmed',
      `₹${amount.toFixed(2)} will be transferred to your bank account within 24 hours`,
      [{ text: 'OK', onPress: () => setShowWithdrawModal(false) }]
    );
  };

  const renderEarningItem = ({ item }: { item: EarningsData }) => (
    <View style={styles.earningItem}>
      <View style={styles.earningLeft}>
        <Text style={styles.serviceLabel}>{SERVICE_TYPE_LABELS[item.service]}</Text>
        <Text style={styles.earnDate}>{item.date}</Text>
      </View>
      <View style={styles.earningRight}>
        <Text style={styles.earnAmount}>+₹{item.amount.toFixed(2)}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'completed' ? colors.success + '15' : colors.warning + '15',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  item.status === 'completed'
                    ? colors.success
                    : item.status === 'pending'
                      ? colors.warning
                      : colors.primary,
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderMonthlyItem = ({ item }: { item: MonthlyEarnings }) => (
    <View style={styles.monthlyItem}>
      <View style={styles.monthLeft}>
        <Text style={styles.monthLabel}>{item.month}</Text>
        <Text style={styles.jobCount}>{item.jobs} jobs</Text>
      </View>
      <Text style={styles.monthEarnings}>₹{item.earnings.toLocaleString()}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Summary Cards */}
      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Available Balance</Text>
              <Text style={styles.summaryAmount}>
                ₹{(totalEarnings - withdrawnThisMonth).toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryAmount}>₹{pendingEarnings.toFixed(2)}</Text>
            </View>
          </View>
        </Card>

        <Button
          title="Withdraw Funds"
          onPress={() => setShowWithdrawModal(true)}
          style={styles.withdrawButton}
        />

        {/* Time Range Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Earnings Overview</Text>
          <View style={styles.filterButtons}>
            {(['week', 'month', 'year'] as const).map((range) => (
              <TouchableOpacity
                key={range}
                style={[
                  styles.filterButton,
                  timeRange === range && styles.filterButtonActive,
                ]}
                onPress={() => setTimeRange(range)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    timeRange === range && styles.filterButtonTextActive,
                  ]}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Monthly Breakdown */}
        <Card style={styles.monthlyCard}>
          <Text style={styles.cardTitle}>Monthly Breakdown</Text>
          <FlatList
            data={MONTHLY_EARNINGS}
            renderItem={renderMonthlyItem}
            keyExtractor={(item) => item.month}
            scrollEnabled={false}
            nestedScrollEnabled={false}
          />
        </Card>

        {/* Recent Earnings */}
        <Card style={styles.recentCard}>
          <Text style={styles.cardTitle}>Recent Earnings</Text>
          <FlatList
            data={MOCK_EARNINGS}
            renderItem={renderEarningItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            nestedScrollEnabled={false}
          />
        </Card>

        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowWithdrawModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.gray[900]} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <Text style={styles.modalSubtitle}>
                Available Balance: ₹
                {(totalEarnings - withdrawnThisMonth).toLocaleString()}
              </Text>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Amount to Withdraw</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <RNTextInput
                    style={styles.input}
                    placeholder="Enter amount"
                    keyboardType="decimal-pad"
                    value={withdrawAmount}
                    onChangeText={setWithdrawAmount}
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>
              </View>

              <Button
                title="Confirm Withdrawal"
                onPress={handleWithdraw}
                style={styles.confirmButton}
              />

              <Button
                title="Cancel"
                onPress={() => setShowWithdrawModal(false)}
                variant="secondary"
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.gray[600],
    marginBottom: spacing.xs,
    fontWeight: '500' as const,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.md,
  },
  withdrawButton: {
    marginBottom: spacing.lg,
    backgroundColor: colors.success,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: 'white',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    textAlign: 'center',
    color: colors.gray[700],
    fontSize: 13,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  monthlyCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  recentCard: {
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  monthlyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  monthLeft: {
    flex: 1,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  jobCount: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  monthEarnings: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  earningLeft: {
    flex: 1,
  },
  earningRight: {
    alignItems: 'flex-end',
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  earnDate: {
    fontSize: 12,
    color: colors.gray[600],
  },
  earnAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    minHeight: 320,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.gray[600],
    marginBottom: spacing.lg,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray[50],
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.gray[900],
  },
  confirmButton: {
    marginBottom: spacing.md,
    backgroundColor: colors.success,
  },
});
