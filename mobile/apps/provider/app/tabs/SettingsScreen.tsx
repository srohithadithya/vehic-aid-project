import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProviderSettingsScreen = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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

  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const SettingItem = ({ icon, label, value, onPress, isSwitch = false, onToggle }: { icon: string; label: string; value: any; onPress?: () => void; isSwitch?: boolean; onToggle?: (value: boolean) => void }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={isSwitch ? undefined : onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons name={icon as any} size={24} color={colors.primary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={value ? colors.primary : '#f4f3f4'}
        />
      ) : (
        <View style={styles.settingRight}>
          <Text style={styles.settingValue}>{value}</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </View>
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const Divider = () => <View style={styles.divider} />;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: darkMode ? '#1A1A1A' : colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* AVAILABILITY */}
      <SectionHeader title="AVAILABILITY" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon="home-check"
          label="Online Status"
          value={isAvailable}
          isSwitch={true}
          onToggle={setIsAvailable}
        />
        <Divider />
        <SettingItem
          icon="auto-fix"
          label="Auto Accept Jobs"
          value={autoAccept}
          isSwitch={true}
          onToggle={setAutoAccept}
        />
      </View>

      {/* NOTIFICATIONS */}
      <SectionHeader title="NOTIFICATIONS & ALERTS" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon="volume-high"
          label="Sound Notifications"
          value={soundEnabled}
          isSwitch={true}
          onToggle={setSoundEnabled}
        />
        <Divider />
        <SettingItem
          icon="vibrate"
          label="Vibration Alerts"
          value={true}
          isSwitch={true}
          onToggle={() => {}}
        />
      </View>

      {/* SERVICES */}
      <SectionHeader title="SERVICES OFFERED" />
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="tools" size={24} color={colors.primary} />
            <Text style={styles.settingLabel}>Manage Services</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="clock-time-four" size={24} color={colors.primary} />
            <Text style={styles.settingLabel}>Work Schedule</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      </View>

      {/* ACCOUNT & VERIFICATION */}
      <SectionHeader title="ACCOUNT & VERIFICATION" />
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="bank-transfer" size={24} color={colors.primary} />
            <Text style={styles.settingLabel}>Bank Details</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="file-document-check" size={24} color={colors.primary} />
            <Text style={styles.settingLabel}>Verify Documents</Text>
          </View>
          <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
        </TouchableOpacity>
      </View>

      {/* DISPLAY SETTINGS */}
      <SectionHeader title="DISPLAY" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon="moon-waning-crescent"
          label="Dark Mode"
          value={darkMode}
          isSwitch={true}
          onToggle={setDarkMode}
        />
      </View>

      {/* SUPPORT & INFO */}
      <SectionHeader title="SUPPORT & INFORMATION" />
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="help-circle" size={24} color={colors.primary} />
            <Text style={styles.settingLabel}>Help & Support</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="file-document" size={24} color={colors.primary} />
            <Text style={styles.settingLabel}>Terms & Conditions</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="shield-check" size={24} color={colors.primary} />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      </View>

      {/* ACCOUNT */}
      <SectionHeader title="ACCOUNT" />
      <View style={styles.settingsGroup}>
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomWidth: 0 }]}
          onPress={() => Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel' },
            { text: 'Logout', style: 'destructive' },
          ])}
        >
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="logout" size={24} color={colors.warning} />
            <Text style={[styles.settingLabel, { color: colors.warning }]}>Logout</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default ProviderSettingsScreen;
