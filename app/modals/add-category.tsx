/**
 * Add Category Modal
 * Form to add new category
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const CATEGORY_ICONS = ['🍔', '🚗', '🏠', '💡', '🎮', '👕', '💊', '📚', '✈️', '🎬', '🏋️', '🎵', '🛒', '☕', '🍕', '💼'];
const CATEGORY_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export default function AddCategoryModal() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const queryClient = useQueryClient();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(CATEGORY_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setToast({ visible: true, message: 'Kategori berhasil ditambahkan!', type: 'success' });
      setTimeout(() => router.back(), 1500);
    },
    onError: (error: any) => {
      setToast({ visible: true, message: error.message || 'Gagal menambahkan kategori', type: 'error' });
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      setToast({ visible: true, message: 'Nama kategori harus diisi', type: 'error' });
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      type,
      icon: selectedIcon,
      color: selectedColor,
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
            Tambah Kategori
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
                onPress={() => setType('income')}
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
                onPress={() => setType('expense')}
              >
                <Text style={[styles.typeText, { color: type === 'expense' ? '#FFFFFF' : colors.textSecondary }]}>
                  Pengeluaran
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Name */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Nama Kategori</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.glassBorder }]}
              value={name}
              onChangeText={setName}
              placeholder="Contoh: Makanan"
              placeholderTextColor={colors.textTertiary}
            />
          </GlassCard>

          {/* Icon Selector */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Pilih Icon</Text>
            <View style={styles.iconGrid}>
              {CATEGORY_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconItem,
                    selectedIcon === icon && { backgroundColor: colors.accentColor },
                    selectedIcon !== icon && { backgroundColor: colors.glassBg, borderColor: colors.glassBorder, borderWidth: 1 },
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* Color Selector */}
          <GlassCard style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Pilih Warna</Text>
            <View style={styles.colorGrid}>
              {CATEGORY_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorItemSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          <Button
            onPress={handleSubmit}
            loading={createMutation.isPending}
            style={styles.submitButton}
          >
            Simpan Kategori
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
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconItem: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorItemSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
