import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';
import { TextInput } from 'react-native';
import { useAuth } from '@vehic-aid/auth';
import { Ionicons } from '@expo/vector-icons';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface WalletData {
  balance: number;
  total_spent: number;
  recent_transactions: {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'credit' | 'debit';
  }[];
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  });

  const [wallet, setWallet] = useState<WalletData>({
    balance: 500,
    total_spent: 3450,
    recent_transactions: [
      { id: '1', description: 'Engine Oil Service', amount: -450, date: '2026-01-15', type: 'debit' },
      { id: '2', description: 'Wallet Recharge', amount: 1000, date: '2026-01-12', type: 'credit' },
      { id: '3', description: 'Tire Repair', amount: -300, date: '2026-01-10', type: 'debit' },
      { id: '4', description: 'Referral Bonus', amount: 250, date: '2026-01-08', type: 'credit' },
      { id: '5', description: 'Battery Service', amount: -600, date: '2026-01-05', type: 'debit' },
    ],
  });

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleAddWalletBalance = () => {
    Alert.alert(
      'Add Balance',
      'Select amount to add to your wallet',
      [
        { text: 'Cancel', onPress: () => {} },
        { text: '₹500', onPress: () => addBalance(500) },
        { text: '₹1000', onPress: () => addBalance(1000) },
        { text: '₹2000', onPress: () => addBalance(2000) },
      ]
    );
  };

  const addBalance = async (amount: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWallet({
        ...wallet,
        balance: wallet.balance + amount,
        recent_transactions: [
          {
            id: String(wallet.recent_transactions.length + 1),
            description: 'Wallet Recharge',
            amount,
            date: new Date().toISOString().split('T')[0],
            type: 'credit',
          },
          ...wallet.recent_transactions,
        ],
      });
      Alert.alert('Success', `₹${amount} added to your wallet!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add balance');
    }
  };

  const renderTransactionItem = (transaction: any) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <View
          style={[
            styles.transactionIcon,
            { backgroundColor: transaction.type === 'credit' ? colors.success + '20' : colors.primary + '20' },
          ]}
        >
          <Ionicons
            name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
            size={16}
            color={transaction.type === 'credit' ? colors.success : colors.primary}
          />
        </View>
        <View style={{ marginLeft: spacing.md, flex: 1 }}>
          <Text style={[typography.body, { fontWeight: '500' }]}>
            {transaction.description}
          </Text>
          <Text style={[typography.caption, { color: colors.gray[500], marginTop: spacing.xs }]}>
            {transaction.date}
          </Text>
        </View>
      </View>
      <Text
        style={[
          typography.body,
          {
            fontWeight: '600',
            color: transaction.type === 'credit' ? colors.success : colors.primary,
          },
        ]}
      >
        {transaction.type === 'credit' ? '+' : '-'}₹{Math.abs(transaction.amount)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Section */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle" size={60} color={colors.primary} />
          </View>
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={[typography.h3, { marginBottom: spacing.xs }]}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>
              {profile.email}
            </Text>
          </View>
        </View>
      </Card>

      {/* Edit Profile Section */}
      {isEditing ? (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>Edit Profile</Text>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              First Name
            </Text>
            <TextInput
              value={profile.first_name}
              onChangeText={(text) => setProfile({ ...profile, first_name: text })}
              style={styles.textInput}
            />
          </View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Last Name
            </Text>
            <TextInput
              value={profile.last_name}
              onChangeText={(text) => setProfile({ ...profile, last_name: text })}
              style={styles.textInput}
            />
          </View>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Email
            </Text>
            <TextInput
              value={profile.email}
              editable={false}
              style={[styles.textInput, { opacity: 0.6 }]}
            />
          </View>
          <View style={{ marginBottom: spacing.lg }}>
            <Text style={[typography.caption, { color: colors.gray[600], marginBottom: spacing.xs }]}>
              Phone
            </Text>
            <TextInput
              value={profile.phone_number}
              onChangeText={(text) => setProfile({ ...profile, phone_number: text })}
              style={styles.textInput}
            />
          </View>
          <Button
            title="Save Changes"
            onPress={handleSaveProfile}
            variant="primary"
            style={{ marginBottom: spacing.md }}
          />
          <Button
            title="Cancel"
            onPress={() => setIsEditing(false)}
            variant="outline"
          />
        </Card>
      ) : (
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.profileDetail}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>Email</Text>
            <Text style={typography.body}>{profile.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.profileDetail}>
            <Text style={[typography.caption, { color: colors.gray[500] }]}>Phone</Text>
            <Text style={typography.body}>{profile.phone_number}</Text>
          </View>
          <Button
            title="Edit Profile"
            onPress={() => setIsEditing(true)}
            variant="primary"
            style={{ marginTop: spacing.lg }}
          />
        </Card>
      )}

      {/* Wallet Section */}
      <Card style={{ marginTop: spacing.lg }}>
        <Text style={[typography.h3, { marginBottom: spacing.md }]}>💳 Wallet</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={[typography.caption, { color: colors.gray[400], marginBottom: spacing.xs }]}>
              Available Balance
            </Text>
            <Text style={[typography.h2, { color: colors.white, marginBottom: spacing.sm }]}>
              ₹{wallet.balance}
            </Text>
            <Text style={[typography.caption, { color: colors.gray[200] }]}>
              Total Spent: ₹{wallet.total_spent}
            </Text>
          </View>
          <Button
            title="Add Balance"
            onPress={handleAddWalletBalance}
            variant="secondary"
            style={styles.addBalanceBtn}
          />
        </View>

        {/* Transactions */}
        <Text style={[typography.subtitle, { marginTop: spacing.lg, marginBottom: spacing.md }]}>
          Recent Transactions
        </Text>
        {wallet.recent_transactions.slice(0, 5).map(transaction => (
          <View key={transaction.id}>
            {renderTransactionItem(transaction)}
            <View style={styles.transactionDivider} />
          </View>
        ))}

        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[typography.body, { color: colors.primary, textAlign: 'center' }]}>
            View All Transactions →
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Settings Section */}
      <Card style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
        <TouchableOpacity style={styles.settingsItem}>
          <Ionicons name="notifications" size={20} color={colors.primary} />
          <Text style={[typography.body, { marginLeft: spacing.md, flex: 1 }]}>
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingsItem}>
          <Ionicons name="help-circle" size={20} color={colors.primary} />
          <Text style={[typography.body, { marginLeft: spacing.md, flex: 1 }]}>
            Help & Support
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingsItem}>
          <Ionicons name="document" size={20} color={colors.primary} />
          <Text style={[typography.body, { marginLeft: spacing.md, flex: 1 }]}>
            Terms & Conditions
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingsItem} onPress={logout}>
          <Ionicons name="log-out" size={20} color={colors.error} />
          <Text style={[typography.body, { marginLeft: spacing.md, flex: 1, color: colors.error }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileCard: {
    marginTop: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetail: {
    paddingVertical: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.sm,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBalanceBtn: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  viewAllButton: {
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 14,
    fontFamily: 'System',
    minHeight: 44,
  },
});
