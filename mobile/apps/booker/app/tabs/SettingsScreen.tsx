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

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

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

  const handlePasswordChange = () => {
    Alert.alert('Change Password', 'Password change feature would be implemented here');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy Policy content would be displayed here');
  };

  const handleTermsConditions = () => {
    Alert.alert('Terms & Conditions', 'Terms & Conditions content would be displayed here');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action is irreversible.',
      [
        { text: 'Cancel', onPress: () => {} },
        { text: 'Delete', onPress: () => Alert.alert('Account deleted'), style: 'destructive' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {} },
        { text: 'Logout', onPress: () => Alert.alert('Logged out successfully'), style: 'destructive' },
      ]
    );
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
      {/* DISPLAY SETTINGS */}
      <SectionHeader title="DISPLAY & APPEARANCE" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon="moon-waning-crescent"
          label="Dark Mode"
          value={darkMode}
          isSwitch={true}
          onToggle={setDarkMode}
        />
        <Divider />
        <SettingItem
          icon="translate"
          label="Language"
          value={language}
          onPress={() => {
            Alert.alert('Select Language', '', [
              { text: 'English', onPress: () => setLanguage('English') },
              { text: 'Hindi', onPress: () => setLanguage('Hindi') },
              { text: 'Telugu', onPress: () => setLanguage('Telugu') },
              { text: 'Cancel' },
            ]);
          }}
        />
      </View>

      {/* NOTIFICATIONS */}
      <SectionHeader title="NOTIFICATIONS" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon="bell"
          label="Push Notifications"
          value={notifications}
          isSwitch={true}
          onToggle={setNotifications}
        />
        <Divider />
        <SettingItem
          icon="email"
          label="Email Notifications"
          value={emailNotifications}
          isSwitch={true}
          onToggle={setEmailNotifications}
        />
        <Divider />
        <SettingItem
          icon="message-text"
          label="SMS Notifications"
          value={smsNotifications}
          isSwitch={true}
          onToggle={setSmsNotifications}
        />
      </View>

      {/* SECURITY */}
      <SectionHeader title="SECURITY & PRIVACY" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon="lock"
          label="Change Password"
          value="•••••••"
          onPress={handlePasswordChange}
        />
        <Divider />
        <SettingItem
          icon="shield-check"
          label="Privacy Policy"
          value=""
          onPress={handlePrivacyPolicy}
        />
        <Divider />
        <SettingItem
          icon="file-document"
          label="Terms & Conditions"
          value=""
          onPress={handleTermsConditions}
        />
      </View>

      {/* APP INFO */}
      <SectionHeader title="APP INFORMATION" />
      <View style={styles.settingsGroup}>
        <SettingItem
          icon="information"
          label="App Version"
          value="1.0.0"
          onPress={() => {}}
        />
        <Divider />
        <SettingItem
          icon="bug"
          label="Report Bug"
          value=""
          onPress={() => Alert.alert('Bug Report', 'Open email client to report bugs')}
        />
        <Divider />
        <SettingItem
          icon="star"
          label="Rate App"
          value=""
          onPress={() => Alert.alert('Rate VehicAid', 'Open App Store to rate')}
        />
      </View>

      {/* ACCOUNT */}
      <SectionHeader title="ACCOUNT" />
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="logout" size={24} color={colors.warning} />
            <Text style={[styles.settingLabel, { color: colors.warning }]}>Logout</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.lightGray} />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={handleDeleteAccount}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="delete-forever" size={24} color={colors.error} />
            <Text style={[styles.settingLabel, { color: colors.error }]}>Delete Account</Text>
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

export default SettingsScreen;
