/**
 * Transactions Screen
 * List of all transactions with filters
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
import { formatDateShort } from '@/utils/date';

import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { TransactionItem } from '@/components/ui/TransactionItem';

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['transactions', filter],
    queryFn: async () => {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.getTransactions(params);
      return response.data;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <LinearGradient colors={[colors.bgBase, colors.bgElevated]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Transaksi
          </Text>
          <TouchableOpacity onPress={() => router.push('/modals/add-transaction')}>
            <Ionicons name="add-circle" size={28} color={colors.accentColor} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === 'all' ? colors.accentColor : colors.glassBg,
                borderColor: colors.glassBorder,
              },
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === 'all' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === 'income' ? colors.systemGreen : colors.glassBg,
                borderColor: colors.glassBorder,
              },
            ]}
            onPress={() => setFilter('income')}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === 'income' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Pemasukan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === 'expense' ? colors.systemRed : colors.glassBg,
                borderColor: colors.glassBorder,
              },
            ]}
            onPress={() => setFilter('expense')}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === 'expense' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Pengeluaran
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
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
            <GlassCard>
              {!data || data.length === 0 ? (
                <EmptyState
                  icon="📭"
                  title="Belum ada transaksi"
                  message="Mulai catat transaksi Anda"
                />
              ) : (
                <View>
                  {data
                    .filter((transaction: any) => transaction && transaction.id)
                    .map((transaction: any) => (
                      <TransactionItem
                        key={transaction.id}
                        id={transaction.id}
                        type={transaction.type || 'expense'}
                        amount={transaction.amount || 0}
                        description={transaction.description || 'Transaksi'}
                        date={formatDateShort(transaction.date)}
                        category={transaction.category}
                      />
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
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    ...typography.caption,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  bottomSpacer: {
    height: 110,
  },
});
