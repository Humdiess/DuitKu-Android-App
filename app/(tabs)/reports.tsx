/**
 * Reports Screen
 * Financial reports and analytics
 */

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

import { darkColors, lightColors, spacing, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import { formatCurrency } from '@/utils/currency';
import { getCurrentMonth, getCurrentYear } from '@/utils/date';

import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatCard } from '@/components/ui/StatCard';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function ReportsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', selectedYear, selectedMonth],
    queryFn: async () => {
      const response = await api.getReports(selectedYear, selectedMonth);
      return response.data;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const stats = data?.stats || {
    income: 0,
    expense: 0,
    balance: 0,
    count: 0,
  };

  const categoryBreakdown = data?.category_breakdown?.items || [];

  return (
    <LinearGradient colors={[colors.bgBase, colors.bgElevated]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Laporan
          </Text>
        </View>

        {/* Month/Year Selector */}
        <View style={styles.selector}>
          <TouchableOpacity
            style={[styles.selectorButton, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}
          >
            <Text style={[styles.selectorText, { color: colors.textPrimary }]}>
              {MONTHS[selectedMonth - 1]} {selectedYear}
            </Text>
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
            {/* Summary Stats */}
            <View style={styles.statsGrid}>
              <StatCard
                title="Pemasukan"
                value={formatCurrency(stats.income)}
                icon="📈"
                color={colors.systemGreen}
              />
              <StatCard
                title="Pengeluaran"
                value={formatCurrency(stats.expense)}
                icon="📉"
                color={colors.systemRed}
              />
            </View>

            <View style={styles.statsGrid}>
              <StatCard
                title="Saldo"
                value={formatCurrency(stats.balance)}
                icon="💰"
              />
              <StatCard
                title="Transaksi"
                value={stats.count.toString()}
                icon="📝"
              />
            </View>

            {/* Category Breakdown */}
            <GlassCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Pengeluaran per Kategori
              </Text>
              {categoryBreakdown.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Belum ada data
                </Text>
              ) : (
                <View style={styles.breakdown}>
                  {categoryBreakdown
                    .filter((item: any) => item && item.id)
                    .map((item: any) => (
                      <View key={item.id} style={styles.breakdownItem}>
                        <View style={styles.breakdownHeader}>
                          <View style={styles.categoryInfo}>
                            <Text style={styles.categoryIcon}>{item.icon || '📁'}</Text>
                            <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                              {item.name || 'Kategori'}
                            </Text>
                          </View>
                          <Text style={[styles.categoryAmount, { color: colors.textPrimary }]}>
                            {formatCurrency(item.spent || 0)}
                          </Text>
                        </View>
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
                                  width: `${Math.min(item.percentage || 0, 100)}%`,
                                  backgroundColor: colors.systemRed,
                                },
                              ]}
                            />
                          </View>
                          <Text style={[styles.percentage, { color: colors.textSecondary }]}>
                            {(item.percentage || 0).toFixed(0)}%
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              )}
            </GlassCard>

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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.title,
    fontSize: 32,
  },
  selector: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  selectorButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  selectorText: {
    ...typography.headline,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headline,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  breakdown: {
    gap: spacing.md,
  },
  breakdownItem: {
    marginBottom: spacing.sm,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '600',
  },
  categoryAmount: {
    ...typography.body,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    ...typography.caption,
    minWidth: 40,
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 110,
  },
});
