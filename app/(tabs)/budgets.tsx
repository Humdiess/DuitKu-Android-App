/**
 * Budgets Screen
 * Budget tracking with progress bars
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { borderRadius, darkColors, lightColors, spacing, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import { formatCurrency } from '@/utils/currency';

import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { router } from 'expo-router';

export default function BudgetsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await api.getBudgets();
      return response.data;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return colors.systemRed;
    if (percentage >= 70) return colors.systemOrange;
    return colors.systemGreen;
  };

  return (
    <LinearGradient colors={[colors.bgBase, colors.bgElevated]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Budget
          </Text>
          <TouchableOpacity onPress={() => router.push('/modals/add-budget')}>
            <Ionicons name="add-circle" size={28} color={colors.accentColor} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <LoadingState />
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {!data || data.length === 0 ? (
              <GlassCard>
                <EmptyState
                  icon="💵"
                  title="Belum ada budget"
                  message="Buat budget untuk mengontrol pengeluaran"
                />
              </GlassCard>
            ) : (
              <View style={styles.budgetList}>
                {data
                  .filter((budget: any) => budget && budget.id && budget.category)
                  .map((budget: any) => (
                    <GlassCard key={budget.id} style={styles.budgetCard}>
                      <View style={styles.budgetHeader}>
                        <View style={styles.categoryInfo}>
                          <Text style={styles.categoryIcon}>{budget.category?.icon || '💵'}</Text>
                          <View>
                            <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                              {budget.category?.name || 'Kategori'}
                            </Text>
                            <Text style={[styles.period, { color: colors.textTertiary }]}>
                              {budget.period_label || 'Bulanan'}
                            </Text>
                          </View>
                        </View>
                        {budget.is_exceeded && (
                          <Ionicons name="warning" size={24} color={colors.systemRed} />
                        )}
                      </View>

                    <View style={styles.amounts}>
                      <View style={styles.amountRow}>
                        <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
                          Terpakai
                        </Text>
                        <Text style={[styles.amountValue, { color: colors.systemRed }]}>
                          {formatCurrency(budget.spent)}
                        </Text>
                      </View>
                      <View style={styles.amountRow}>
                        <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
                          Budget
                        </Text>
                        <Text style={[styles.amountValue, { color: colors.textPrimary }]}>
                          {formatCurrency(budget.amount)}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { backgroundColor: colors.fillPrimary },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(budget.percentage, 100)}%`,
                              backgroundColor: getProgressColor(budget.percentage),
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.percentage, { color: getProgressColor(budget.percentage) }]}>
                        {budget.percentage.toFixed(0)}%
                      </Text>
                    </View>

                    <Text style={[styles.remaining, { color: colors.textSecondary }]}>
                      Sisa: {formatCurrency(budget.remaining)}
                    </Text>
                  </GlassCard>
                ))}
              </View>
            )}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.title,
    fontSize: 32,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  budgetList: {
    gap: spacing.md,
  },
  budgetCard: {
    padding: spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    ...typography.headline,
    fontWeight: '700',
  },
  period: {
    ...typography.caption,
  },
  amounts: {
    marginBottom: spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  amountLabel: {
    ...typography.body,
  },
  amountValue: {
    ...typography.body,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  percentage: {
    ...typography.caption,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },
  remaining: {
    ...typography.caption,
  },
  bottomSpacer: {
    height: 110,
  },
});
