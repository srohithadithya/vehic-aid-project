import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SubscriptionDetailsScreen = () => {
  // Track selected plan for future upgrades/downgrades
  // const [selectedPlan, setSelectedPlan] = useState('Basic');

  const colors = {
    primary: '#FF6B35',
    secondary: '#004E89',
    background: '#F8F9FA',
    text: '#2C3E50',
    lightGray: '#E0E0E0',
    white: '#FFFFFF',
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    gold: '#FFD700',
  };

  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: '/month',
      color: '#95A5A6',
      benefits: [
        'Unlimited bookings',
        'Basic support',
        'Service history',
        'No discounts',
      ],
      current: false,
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '₹99',
      period: '/month',
      color: colors.primary,
      benefits: [
        '10% discount on all services',
        'Priority support',
        'Service history',
        'Saved payment methods',
        'Monthly invoices',
      ],
      current: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹199',
      period: '/month',
      color: colors.secondary,
      benefits: [
        '20% discount on all services',
        '24/7 premium support',
        'Service history',
        'Saved payment methods',
        'Monthly invoices',
        'Free cancellation up to 1 hour',
        'Priority job assignment',
      ],
      current: false,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '₹349',
      period: '/month',
      color: colors.gold,
      benefits: [
        '30% discount on all services',
        'Dedicated account manager',
        'Service history',
        'Unlimited saved payment methods',
        'Weekly reports',
        'Free cancellation up to 2 hours',
        'Priority job assignment',
        'Free roadside assistance',
        'Free tire change service',
      ],
      current: false,
    },
  ];

  const currentPlan = plans.find(p => p.current);

  const handleUpgrade = (plan: any) => {
    Alert.alert(
      `Upgrade to ${plan.name}`,
      `Confirm upgrade to ${plan.name} plan (${plan.price}${plan.period})?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Upgrade',
          onPress: () => Alert.alert('Success', `Upgraded to ${plan.name} plan!`),
        },
      ]
    );
  };

  const handleDowngrade = (plan: any) => {
    Alert.alert(
      `Downgrade to ${plan.name}`,
      `Confirm downgrade to ${plan.name} plan? You will lose premium benefits.`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Downgrade',
          onPress: () => Alert.alert('Success', `Downgraded to ${plan.name} plan!`),
          style: 'destructive',
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure? You will lose all premium benefits.',
      [
        { text: 'Keep', onPress: () => {} },
        {
          text: 'Cancel Subscription',
          onPress: () => Alert.alert('Subscription cancelled', 'Valid until 31 Dec 2026'),
          style: 'destructive',
        },
      ]
    );
  };

  const PlanCard = ({ plan, index }: { plan: any; index: number }) => {
    const isCurrentPlan = plan.current;
    const isPremium = plan.color !== '#95A5A6';

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.planCard,
          isCurrentPlan && { borderWidth: 3, borderColor: plan.color },
        ]}
      >
        {isCurrentPlan && (
          <View style={[styles.currentBadge, { backgroundColor: plan.color }]}>
            <Text style={styles.currentBadgeText}>Current Plan</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
          <View>
            <Text style={[styles.planPrice, { color: plan.color }]}>
              {plan.price}
            </Text>
            <Text style={styles.planPeriod}>{plan.period}</Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          {plan.benefits.map((benefit: string, i: number) => (
            <View key={i} style={styles.benefitItem}>
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={plan.color}
              />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {!isCurrentPlan && (
          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: plan.color }]}
            onPress={() => handleUpgrade(plan)}
          >
            <Text style={styles.upgradeButtonText}>
              {plan.price === '₹0' ? 'Downgrade' : 'Upgrade'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* CURRENT PLAN DETAILS */}
      <LinearGradient
        colors={[currentPlan?.color || '#95A5A6', colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.currentPlanSection}
      >
        <Text style={styles.sectionTitle}>Current Plan</Text>
        <View style={styles.planDetailsCard}>
          <View style={styles.planDetailsHeader}>
            <Text style={styles.planDetailsName}>{currentPlan?.name}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {currentPlan?.name === 'Basic'
                  ? '10% OFF'
                  : currentPlan?.name === 'Premium'
                  ? '20% OFF'
                  : '30% OFF'}
              </Text>
            </View>
          </View>

          <Text style={styles.expiryDate}>Expires on: 31 Dec 2026</Text>
          <Text style={styles.renewalText}>Auto-renewal enabled</Text>

          <TouchableOpacity
            style={styles.manageButton}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.manageButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* PLAN COMPARISON */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Compare Plans</Text>

        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} index={index} />
          ))}
        </View>
      </View>

      {/* USAGE STATISTICS */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Plan Benefits Used</Text>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="percent"
              size={28}
              color={colors.primary}
            />
            <Text style={styles.statLabel}>Discount Used</Text>
            <Text style={styles.statValue}>₹2,450</Text>
            <Text style={styles.statSubtext}>This month</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="book-open"
              size={28}
              color={colors.primary}
            />
            <Text style={styles.statLabel}>Bookings</Text>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statSubtext}>This month</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="clock"
              size={28}
              color={colors.primary}
            />
            <Text style={styles.statLabel}>Free Cancellations</Text>
            <Text style={styles.statValue}>2/3</Text>
            <Text style={styles.statSubtext}>Remaining</Text>
          </View>
        </View>
      </View>

      {/* PAYMENT METHOD */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Payment Method</Text>

        <View style={styles.paymentCard}>
          <MaterialCommunityIcons
            name="credit-card"
            size={40}
            color={colors.primary}
          />
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentMethod}>Visa ending in 4242</Text>
            <Text style={styles.paymentSubtext}>Renews on 31 Dec 2026</Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="pencil"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  currentPlanSection: {
    padding: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  planDetailsCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 16,
  },
  planDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planDetailsName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  discountBadge: {
    backgroundColor: '#FFE5CC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  renewalText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  manageButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  currentBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
  },
  planPrice: {
    fontSize: 22,
    fontWeight: '700',
  },
  planPeriod: {
    fontSize: 12,
    color: '#999',
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#2C3E50',
    marginLeft: 8,
    flex: 1,
  },
  upgradeButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 11,
    color: '#CCC',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  paymentSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default SubscriptionDetailsScreen;
