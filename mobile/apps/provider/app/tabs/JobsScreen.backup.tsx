import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';

export default function JobsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={[typography.h2, { marginBottom: spacing.md }]}>Available Jobs</Text>
        <Text style={[typography.body, { color: colors.gray[600], marginBottom: spacing.lg }]}>
          Coming Soon - Real-time job feed will appear here
        </Text>
        <Button
          title="Refresh Jobs"
          onPress={() => {}}
          variant="primary"
        />
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
  },
  card: {
    marginTop: spacing.lg,
  },
});
