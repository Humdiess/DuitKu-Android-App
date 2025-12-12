/**
 * Button Components
 * Primary and Secondary button variants
 */

import { borderRadius, darkColors, lightColors, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { ReactNode } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        isPrimary
          ? { backgroundColor: colors.accentColor }
          : {
              backgroundColor: colors.glassBg,
              borderWidth: 1,
              borderColor: colors.glassBorder,
            },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : colors.textPrimary} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: isPrimary ? '#FFFFFF' : colors.textPrimary },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    ...typography.headline,
  },
  disabled: {
    opacity: 0.5,
  },
});
