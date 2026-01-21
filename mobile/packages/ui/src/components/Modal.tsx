import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

interface ModalProps {
  visible: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  actionText?: string;
  onAction?: () => void;
  closeText?: string;
}

export function Modal({
  visible,
  title,
  children,
  onClose,
  actionText,
  onAction,
  closeText = 'Close',
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {title && (
            <Text style={[typography.h3, { marginBottom: spacing.md }]}>
              {title}
            </Text>
          )}

          <View style={{ marginBottom: spacing.lg }}>
            {children}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.gray[200] }]}
              onPress={onClose}
            >
              <Text style={[typography.body, { color: colors.gray[900] }]}>
                {closeText}
              </Text>
            </TouchableOpacity>

            {actionText && onAction && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={onAction}
              >
                <Text style={[typography.body, { color: colors.white }]}>
                  {actionText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '85%',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
});
