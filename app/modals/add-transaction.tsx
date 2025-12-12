/**
 * Add Transaction Modal
 * Form to add new income or expense transaction
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
import { borderRadius, darkColors, lightColors, spacing, typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import { formatDateForAPI } from '@/utils/date';

export default function AddTransactionModal() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const queryClient = useQueryClient();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [date] = useState(new Date());
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const { data: categories } = useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      const response = await api.getCategories(type);
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setToast({ visible: true, message: 'Transaksi berhasil ditambahkan!', type: 'success' });
      setTimeout(() => router.back(), 1500);
    },
    onError: (error: any) => {
      setToast({ visible: true, message: error.message || 'Gagal menambahkan transaksi', type: 'error' });
    },
  });

  const handleSubmit = () => {
    if (!amount || !description || !categoryId) {
      setToast({ visible: true, message: 'Mohon isi semua field yang diperlukan', type: 'error' });
      return;
    }

    createMutation.mutate({
      type,
      amount: parseInt(amount.replace(/[^0-9]/g, ''), 10),
      description,
      category_id: categoryId,
      date: formatDateForAPI(date),
      notes,
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
            Tambah Transaksi
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Type Selector */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Tipe</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && { backgroundColor: colors.systemGreen },
                  type !== 'income' && { backgroundColor: colors.glassBg, borderColor: colors.glassBorder, borderWidth: 1 },
                ]}
                onPress={() => { setType('income'); setCategoryId(null); }}
              >
                <Text style={[styles.typeText, { color: type === 'income' ? '#FFFFFF' : colors.textSecondary }]}>
                  Pemasukan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && { backgroundColor: colors.systemRed },
                  type !== 'expense' && { backgroundColor: colors.glassBg, borderColor: colors.glassBorder, borderWidth: 1 },
                ]}
                onPress={() => { setType('expense'); setCategoryId(null); }}
              >
                <Text style={[styles.typeText, { color: type === 'expense' ? '#FFFFFF' : colors.textSecondary }]}>
                  Pengeluaran
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Amount */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Jumlah</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
          </GlassCard>

          {/* Description */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Deskripsi</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.glassBorder }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Contoh: Makan siang"
              placeholderTextColor={colors.textTertiary}
            />
          </GlassCard>

          {/* Category */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Kategori</Text>
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

          {/* Notes */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Catatan (Opsional)</Text>
            <TextInput
              style={[styles.input, styles.textArea, { color: colors.textPrimary, borderColor: colors.glassBorder }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Tambahkan catatan..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={3}
            />
          </GlassCard>

          <Button
            onPress={handleSubmit}
            loading={createMutation.isPending}
            style={styles.submitButton}
          >
            Simpan Transaksi
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
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  typeText: {
    ...typography.body,
    fontWeight: '600',
  },
  amountInput: {
    ...typography.stat,
    fontSize: 48,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  submitButton: {
    marginTop: spacing.md,
  },
});
