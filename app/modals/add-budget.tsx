/**
 * Add Budget Modal
 * Form to add new budget
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Toast } from '@/components/ui/Toast';
import { borderRadius, darkColors, lightColors, spacing, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import { formatDateForAPI } from '@/utils/date';

export default function AddBudgetModal() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const queryClient = useQueryClient();

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [threshold, setThreshold] = useState('80');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const { data: categories } = useQuery({
    queryKey: ['categories', 'expense'],
    queryFn: async () => {
      const response = await api.getCategories('expense');
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setToast({ visible: true, message: 'Budget berhasil ditambahkan!', type: 'success' });
      setTimeout(() => router.back(), 1500);
    },
    onError: (error: any) => {
      setToast({ visible: true, message: error.message || 'Gagal menambahkan budget', type: 'error' });
    },
  });

  const handleSubmit = () => {
    if (!amount || !categoryId) {
      setToast({ visible: true, message: 'Mohon isi semua field yang diperlukan', type: 'error' });
      return;
    }

    createMutation.mutate({
      category_id: categoryId,
      amount: parseInt(amount.replace(/[^0-9]/g, ''), 10),
      period,
      start_date: formatDateForAPI(new Date()),
      alert_threshold: parseInt(threshold, 10),
    });
  };

  return (
    <LinearGradient colors={[colors.bgBase, colors.bgElevated]} style={styles.gradient}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Tambah Budget
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Kategori Pengeluaran</Text>
            <View style={styles.categoryGrid}>
              {categories?.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    categoryId === cat.id && { backgroundColor: colors.accentColor },
                    categoryId !== cat.id && { backgroundColor: colors.glassBg, borderColor: colors.glassBorder, borderWidth: 1 },
                  ]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[styles.categoryName, { color: categoryId === cat.id ? '#FFFFFF' : colors.textPrimary }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* Amount */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Jumlah Budget</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
          </GlassCard>

          {/* Period */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Periode</Text>
            <View style={styles.periodSelector}>
              {['weekly', 'monthly', 'yearly'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodButton,
                    period === p && { backgroundColor: colors.accentColor },
                    period !== p && { backgroundColor: colors.glassBg, borderColor: colors.glassBorder, borderWidth: 1 },
                  ]}
                  onPress={() => setPeriod(p as any)}
                >
                  <Text style={[styles.periodText, { color: period === p ? '#FFFFFF' : colors.textSecondary }]}>
                    {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* Alert Threshold */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Peringatan Saat Mencapai (%)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.glassBorder }]}
              value={threshold}
              onChangeText={setThreshold}
              placeholder="80"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
          </GlassCard>

          <Button
            onPress={handleSubmit}
            loading={createMutation.isPending}
            style={styles.submitButton}
          >
            Simpan Budget
          </Button>

          <View style={{ height: 40 }} />
        </ScrollView>
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.title,
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryItem: {
    width: '30%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  categoryName: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  amountInput: {
    ...typography.stat,
    fontSize: 48,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  periodText: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
