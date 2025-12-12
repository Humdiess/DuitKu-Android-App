/**
 * Categories Screen
 * Manage income and expense categories
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
import { formatCurrency } from '@/utils/currency';

import { EmptyState } from '@/components/ui/EmptyState';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingState } from '@/components/ui/LoadingState';

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.getCategories();
      return response.data;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const incomeCategories = data?.filter((cat: any) => cat.type === 'income') || [];
  const expenseCategories = data?.filter((cat: any) => cat.type === 'expense') || [];

  return (
    <LinearGradient colors={[colors.bgBase, colors.bgElevated]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Kategori
          </Text>
          <TouchableOpacity onPress={() => router.push('/modals/add-category')}>
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
            {/* Income Categories */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Pemasukan
              </Text>
              {incomeCategories.length === 0 ? (
                <GlassCard>
                  <EmptyState
                    icon="📂"
                    title="Belum ada kategori pemasukan"
                    message="Tambah kategori untuk mengorganisir pemasukan"
                  />
                </GlassCard>
              ) : (
                <View style={styles.categoryList}>
                  {incomeCategories
                    .filter((category: any) => category && category.id)
                    .map((category: any) => (
                      <View key={category.id} style={[styles.categoryPill, { borderColor: colors.glassBorder }]}>
                        <View style={styles.pillLeft}>
                          <View style={[styles.iconCircle, { backgroundColor: colors.glassBg }]}>
                            <Text style={styles.categoryIcon}>{category.icon || '📁'}</Text>
                          </View>
                          <View style={styles.pillInfo}>
                            <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                              {category.name || 'Kategori'}
                            </Text>
                            <Text style={[styles.categoryCount, { color: colors.textTertiary }]}>
                              {category.transaction_count || 0} transaksi
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.categoryAmount, { color: colors.systemGreen }]}>
                          {formatCurrency(category.total_amount || 0)}
                        </Text>
                      </View>
                    ))}
                </View>
              )}
            </View>

            {/* Expense Categories */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Pengeluaran
              </Text>
              {expenseCategories.length === 0 ? (
                <GlassCard>
                  <EmptyState
                    icon="📂"
                    title="Belum ada kategori pengeluaran"
                    message="Tambah kategori untuk mengorganisir pengeluaran"
                  />
                </GlassCard>
              ) : (
                <View style={styles.categoryList}>
                  {expenseCategories
                    .filter((category: any) => category && category.id)
                    .map((category: any) => (
                      <View key={category.id} style={[styles.categoryPill, { borderColor: colors.glassBorder }]}>
                        <View style={styles.pillLeft}>
                          <View style={[styles.iconCircle, { backgroundColor: colors.glassBg }]}>
                            <Text style={styles.categoryIcon}>{category.icon || '📁'}</Text>
                          </View>
                          <View style={styles.pillInfo}>
                            <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                              {category.name || 'Kategori'}
                            </Text>
                            <Text style={[styles.categoryCount, { color: colors.textTertiary }]}>
                              {category.transaction_count || 0} transaksi
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.categoryAmount, { color: colors.systemRed }]}>
                          {formatCurrency(category.total_amount || 0)}
                        </Text>
                      </View>
                    ))}
                </View>
              )}
            </View>

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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headline,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  categoryList: {
    gap: spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  pillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryIcon: {
    fontSize: 24,
  },
  pillInfo: {
    flex: 1,
  },
  categoryName: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryCount: {
    ...typography.caption,
    fontSize: 12,
  },
  categoryAmount: {
    ...typography.headline,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 110,
  },
});
