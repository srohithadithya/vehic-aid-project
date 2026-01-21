import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Card, colors, typography, spacing } from '@vehic-aid/ui';

export default function AutoMindScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={[typography.h2, { marginBottom: spacing.md }]}>AutoMind AI Assistant</Text>
        <Text style={[typography.body, { color: colors.gray[600], marginBottom: spacing.lg }]}>
          Coming Soon - AI-powered vehicle diagnostics and booking recommendations
        </Text>
        <Button
          title="Chat with AutoMind"
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
