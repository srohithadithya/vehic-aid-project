// ServiceProviderApp/src/components/SectionHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#007bff',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  divider: {
    height: 3,
    backgroundColor: '#DEE2E6',
    borderRadius: 5,
  }
});

export default SectionHeader;