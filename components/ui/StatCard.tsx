/**
 * StatCard Component
 * Dashboard statistics card
 */

import { darkColors, lightColors, spacing, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: string;
  color?: string;
}

export function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const changeColor = change && change > 0 ? colors.systemGreen : colors.systemRed;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
      <Text style={[styles.value, { color: color || colors.textPrimary }]}>
        {value}
      </Text>
      {change !== undefined && (
        <Text style={[styles.change, { color: changeColor }]}>
          {change > 0 ? '+' : ''}{change.toFixed(1)}%
        </Text>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  icon: {
    fontSize: 22,
  },
  value: {
    ...typography.stat,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  change: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '700',
  },
});
