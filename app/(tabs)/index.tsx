/**
 * Dashboard Screen
 * Main dashboard with stats, chart, and recent transactions
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
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import { formatCompactCurrency } from '@/utils/currency';
import { formatDateShort } from '@/utils/date';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatCard } from '@/components/ui/StatCard';
import { TransactionItem } from '@/components/ui/TransactionItem';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.getDashboard();
      return response.data;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const stats = data?.stats || {
    income: 0,
    expense: 0,
    balance: 0,
    count: 0,
    income_change: 0,
    expense_change: 0,
  };

  const recentTransactions = data?.recent_transactions || [];

  return (
    <LinearGradient colors={[colors.bgBase, colors.bgElevated]} style={styles.gradient}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Selamat datang,
            </Text>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {user?.name || 'User'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={logout}
            style={[styles.logoutButton, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Pemasukan"
            value={formatCompactCurrency(stats.income)}
            change={stats.income_change}
            icon="📈"
            color={colors.systemGreen}
          />
          <StatCard
            title="Pengeluaran"
            value={formatCompactCurrency(stats.expense)}
            change={stats.expense_change}
            icon="📉"
            color={colors.systemRed}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Saldo"
            value={formatCompactCurrency(stats.balance)}
            icon="💰"
          />
          <StatCard
            title="Transaksi"
            value={stats.count.toString()}
            icon="📝"
          />
        </View>

        {/* Recent Transactions */}
        <GlassCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Transaksi Terbaru
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={[styles.seeAll, { color: colors.accentColor }]}>
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon="📭"
              title="Belum ada transaksi"
              message="Mulai catat transaksi Anda"
            />
          ) : (
            <View>
              {recentTransactions
                .filter((transaction: any) => transaction && transaction.id)
                .slice(0, 5)
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

        {/* Quick Actions */}
        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Aksi Cepat
          </Text>
          <View style={styles.quickActions}>
            <Button style={styles.actionButton} onPress={() => router.push('/modals/add-transaction')}>
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.actionText}> Tambah Transaksi</Text>
            </Button>
          </View>
        </GlassCard>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.caption,
    fontSize: 14,
  },
  userName: {
    ...typography.title,
    fontSize: 32,
    marginTop: spacing.xs,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headline,
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    ...typography.caption,
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  bottomSpacer: {
    height: 110,
  },
});
