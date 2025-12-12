/**
 * TransactionItem Component
 * List item for displaying transaction
 */

import { darkColors, lightColors, spacing, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatCurrency } from '@/utils/currency';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransactionItemProps {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category?: {
    id: number;
    name: string;
    icon: string;
    color: string;
  } | null;
  onPress?: () => void;
}

export function TransactionItem({
  type,
  amount,
  description,
  date,
  category,
  onPress,
}: TransactionItemProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const amountColor = type === 'income' ? colors.systemGreen : colors.systemRed;
  const amountPrefix = type === 'income' ? '+' : '-';

  // Default values if category is missing
  const categoryIcon = category?.icon || '📝';
  const categoryName = category?.name || 'Umum';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, { borderBottomColor: colors.separator }]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{categoryIcon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textPrimary }]}>
          {description}
        </Text>
        <Text style={[styles.category, { color: colors.textTertiary }]}>
          {categoryName} • {date}
        </Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {amountPrefix} {formatCurrency(amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 26,
  },
  content: {
    flex: 1,
  },
  description: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    ...typography.caption,
    fontSize: 13,
  },
  amount: {
    ...typography.headline,
    fontSize: 17,
    fontWeight: '700',
  },
});
