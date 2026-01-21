import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '@vehic-aid/ui';
import { EnhancedButtonComponent } from '@vehic-aid/ui';

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank';
  name: string;
  last4?: string;
  isDefault: boolean;
  balance?: number;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

const PaymentScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'methods' | 'history'>('wallet');
  const [walletBalance, setWalletBalance] = useState(2450.50);
  const [walletAnimValue] = useState(new Animated.Value(0));
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa Card',
      last4: '4242',
      isDefault: true,
      balance: 5000,
    },
    {
      id: '2',
      type: 'card',
      name: 'Mastercard',
      last4: '5555',
      isDefault: false,
      balance: 3000,
    },
    {
      id: '3',
      type: 'wallet',
      name: 'VehicAid Wallet',
      isDefault: false,
      balance: walletBalance,
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'debit',
      amount: 85.50,
      description: 'Oil Change Service',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '2',
      type: 'credit',
      amount: 150.00,
      description: 'Cashback Reward',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '3',
      type: 'debit',
      amount: 45.00,
      description: 'Tire Inspection',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '4',
      type: 'credit',
      amount: 50.00,
      description: 'Referral Bonus',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(walletAnimValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleAddFunds = async () => {
    setLoading(true);
    // Simulate adding funds
    setTimeout(() => {
      setWalletBalance(prev => prev + 100);
      setLoading(false);
    }, 1000);
  };

  const handleWithdraw = async () => {
    setLoading(true);
    // Simulate withdrawal
    setTimeout(() => {
      if (walletBalance >= 50) {
        setWalletBalance(prev => prev - 50);
      }
      setLoading(false);
    }, 1000);
  };

  const renderWalletCard = () => (
    <LinearGradient
      colors={['#667EEA', '#764BA2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.walletCard}
    >
      <View style={styles.walletContent}>
        <Text style={styles.walletLabel}>Total Balance</Text>
        <Animated.Text
          style={[
            styles.walletAmount,
            {
              opacity: walletAnimValue,
              transform: [
                {
                  scale: walletAnimValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          ₹{walletBalance.toFixed(2)}
        </Animated.Text>
        <View style={styles.walletActions}>
          <TouchableOpacity style={styles.walletActionBtn}>
            <Text style={styles.walletActionText}>See Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.methodCard,
        method.isDefault && styles.methodCardDefault,
        shadows.sm,
      ]}
    >
      <View style={styles.methodHeader}>
        <View>
          <Text style={styles.methodName}>{method.name}</Text>
          {method.last4 && (
            <Text style={styles.methodSubtext}>•••• {method.last4}</Text>
          )}
        </View>
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>
      {method.balance !== undefined && (
        <View style={styles.methodBalance}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>₹{method.balance}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderTransaction = (transaction: Transaction) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            {
              backgroundColor:
                transaction.type === 'credit'
                  ? colors.success
                  : colors.error,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 18,
              color:
                transaction.type === 'credit'
                  ? colors.success
                  : colors.error,
            }}
          >
            {transaction.type === 'credit' ? '📥' : '📤'}
          </Text>
        </View>
        <View>
          <Text style={styles.transactionDesc}>
            {transaction.description}
          </Text>
          <Text style={styles.transactionTime}>
            {formatTime(transaction.timestamp)}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            {
              color:
                transaction.type === 'credit'
                  ? colors.success
                  : colors.black,
            },
          ]}
        >
          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                transaction.status === 'completed'
                  ? colors.success
                  : colors.warning,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  transaction.status === 'completed'
                    ? colors.success
                    : colors.warning,
              },
            ]}
          >
            {transaction.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
        <Text style={styles.headerSubtitle}>Manage your payments & wallet</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['wallet', 'methods', 'history'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'wallet' && (
          <View style={styles.section}>
            {renderWalletCard()}

            <View style={styles.actionButtons}>
              <EnhancedButtonComponent
                title={loading ? 'Adding...' : 'Add Funds'}
                onPress={handleAddFunds}
                loading={loading}
                size="large"
                fullWidth
                variant="primary"
                style={{ marginBottom: spacing.md }}
              />
              <EnhancedButtonComponent
                title={loading ? 'Processing...' : 'Withdraw'}
                onPress={handleWithdraw}
                loading={loading}
                size="large"
                fullWidth
                variant="secondary"
              />
            </View>

            {/* Quick Stats */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, shadows.sm]}>
                <Text style={styles.statLabel}>Spent This Month</Text>
                <Text style={styles.statValue}>₹2,450</Text>
              </View>
              <View style={[styles.statCard, shadows.sm]}>
                <Text style={styles.statLabel}>Cashback Earned</Text>
                <Text style={styles.statValue}>₹245</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'methods' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            {paymentMethods.map(renderPaymentMethod)}

            <EnhancedButtonComponent
              title="Add New Payment Method"
              onPress={() => {}}
              variant="outline"
              fullWidth
              style={styles.addMethodButton}
            />
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            {transactions.length > 0 ? (
              <FlatList
                data={transactions}
                renderItem={({ item }) => renderTransaction(item)}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No transactions yet
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.gray[500],
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.gray[500],
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  walletCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  walletContent: {
    justifyContent: 'center',
  },
  walletLabel: {
    ...typography.caption,
    color: '#E8E8E8',
    marginBottom: spacing.sm,
  },
  walletAmount: {
    ...typography.h1,
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  walletActions: {
    flexDirection: 'row',
  },
  walletActionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: spacing.md,
  },
  walletActionText: {
    ...typography.caption,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.black,
    marginBottom: spacing.lg,
  },
  methodCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  methodCardDefault: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  methodName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.black,
  },
  methodSubtext: {
    ...typography.caption,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  defaultBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  defaultBadgeText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  methodBalance: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: spacing.md,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.gray[500],
  },
  balanceAmount: {
    ...typography.subtitle,
    color: colors.black,
    marginTop: spacing.xs,
  },
  addMethodButton: {
    marginTop: spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionDesc: {
    ...typography.body,
    fontWeight: '600' as const,
    color: colors.black,
  },
  transactionTime: {
    ...typography.caption,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...typography.body,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.bodySmall,
    fontWeight: '600' as const,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.gray[500],
  },
});

export default PaymentScreen;
