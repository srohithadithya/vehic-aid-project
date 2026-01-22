import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AnalyticsScreen = () => {
  const [timeRange, setTimeRange] = useState('week');

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
  };

  const metricsData = [
    { label: 'Acceptance Rate', value: '94%', icon: 'check-circle', color: colors.success },
    { label: 'Completion Rate', value: '98%', icon: 'flag-checkered', color: colors.primary },
    { label: 'Avg Rating', value: '4.8★', icon: 'star', color: '#FFD700' },
    { label: 'Response Time', value: '45s', icon: 'clock-fast', color: colors.secondary },
  ];

  const earningsData = {
    values: [1200, 1900, 1400, 2200, 1800, 2400, 1600],
  };

  const jobsData = {
    values: [8, 12, 10, 15, 11, 14, 9],
  };

  const serviceTypeData = [
    { name: 'Towing', value: 28, color: colors.primary },
    { name: 'Mechanic', value: 22, color: colors.secondary },
    { name: 'Fuel', value: 18, color: colors.success },
    { name: 'Tire', value: 16, color: colors.warning },
    { name: 'Battery', value: 16, color: colors.error },
  ];

  const totalEarnings = earningsData.values.reduce((a, b) => a + b, 0);
  const totalJobs = jobsData.values.reduce((a, b) => a + b, 0);

  const MetricCard = ({ label, value, icon, color }: any) => (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
      </View>
    </View>
  );

  const TimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {['week', 'month', 'year'].map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range && styles.timeRangeButtonActive,
          ]}
          onPress={() => setTimeRange(range)}
        >
          <Text
            style={[
              styles.timeRangeText,
              timeRange === range && styles.timeRangeTextActive,
            ]}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* PERFORMANCE METRICS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>

        <View style={styles.metricsGrid}>
          {metricsData.map((metric, index) => (
            <View key={index} style={styles.metricsGridItem}>
              <MetricCard
                label={metric.label}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
              />
            </View>
          ))}
        </View>
      </View>

      {/* EARNINGS CHART */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Earnings Trend</Text>
          <TimeRangeSelector />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder}>
            <MaterialCommunityIcons name="chart-line" size={60} color={colors.primary} />
            <Text style={styles.chartPlaceholderText}>Earnings Trend Chart</Text>
            <Text style={styles.chartSubtext}>₹{totalEarnings.toLocaleString()} total</Text>
          </View>
        </View>

        <View style={styles.earningsStats}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Total</Text>
            <Text style={styles.statsValue}>₹{totalEarnings}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Average</Text>
            <Text style={styles.statsValue}>₹{Math.round(totalEarnings / 7)}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Highest</Text>
            <Text style={styles.statsValue}>₹{Math.max(...earningsData.values)}</Text>
          </View>
        </View>
      </View>

      {/* JOBS CHART */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Jobs Completed</Text>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder}>
            <MaterialCommunityIcons name="chart-bar" size={60} color={colors.primary} />
            <Text style={styles.chartPlaceholderText}>Jobs Completed Chart</Text>
            <Text style={styles.chartSubtext}>{totalJobs} jobs total</Text>
          </View>
        </View>

        <View style={styles.jobsStats}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Total</Text>
            <Text style={styles.statsValue}>{totalJobs}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Average</Text>
            <Text style={styles.statsValue}>{Math.round(totalJobs / 7)}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Peak Day</Text>
            <Text style={styles.statsValue}>Sat</Text>
          </View>
        </View>
      </View>

      {/* SERVICE TYPE BREAKDOWN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jobs by Service Type</Text>

        {serviceTypeData.map((service, index) => (
          <View key={index} style={styles.serviceTypeItem}>
            <View style={styles.serviceTypeLabel}>
              <View
                style={[
                  styles.serviceTypeColor,
                  { backgroundColor: service.color },
                ]}
              />
              <Text style={styles.serviceTypeName}>{service.name}</Text>
            </View>
            <View style={styles.serviceTypeBar}>
              <View
                style={[
                  styles.serviceTypeProgress,
                  {
                    width: `${service.value}%`,
                    backgroundColor: service.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.serviceTypeValue}>{service.value}%</Text>
          </View>
        ))}
      </View>

      {/* INSIGHTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights & Recommendations</Text>

        <View style={styles.insightCard}>
          <MaterialCommunityIcons
            name="lightbulb"
            size={28}
            color={colors.warning}
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.insightTitle}>Peak Hours Identified</Text>
          <Text style={styles.insightText}>
            You receive most jobs between 5-8 PM. Consider being extra available during these hours.
          </Text>
        </View>

        <View style={styles.insightCard}>
          <MaterialCommunityIcons
            name="trending-up"
            size={28}
            color={colors.success}
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.insightTitle}>Earnings Growth</Text>
          <Text style={styles.insightText}>
            Your earnings increased by 12% compared to last month. Keep up the great work!
          </Text>
        </View>

        <View style={styles.insightCard}>
          <MaterialCommunityIcons
            name="star"
            size={28}
            color="#FFD700"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.insightTitle}>Excellent Rating</Text>
          <Text style={styles.insightText}>
            Your 4.8★ rating puts you in the top 5% of providers. Customers love your service!
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricsGridItem: {
    width: '48%',
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricContent: {
    marginLeft: 12,
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeRangeButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  timeRangeTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  chartPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 220,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 12,
  },
  chartSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  jobsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statsItem: {
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 4,
  },
  serviceTypeItem: {
    marginBottom: 16,
  },
  serviceTypeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceTypeColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  serviceTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  serviceTypeBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  serviceTypeProgress: {
    height: '100%',
    borderRadius: 4,
  },
  serviceTypeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default AnalyticsScreen;
