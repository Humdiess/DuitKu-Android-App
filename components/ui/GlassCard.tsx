/**
 * GlassCard Component
 * Reusable card with strong frosted glass effect
 */

import { borderRadius, darkColors, lightColors, shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BlurView } from 'expo-blur';
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
  padding?: number;
}

export function GlassCard({ 
  children, 
  style, 
  intensity = 80,
  padding = 16 
}: GlassCardProps) {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={[
          styles.blurContainer,
          {
            backgroundColor: colors.glassBgHeavy,
            borderColor: colors.glassBorder,
            padding,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
  },
  blurContainer: {
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    ...shadows.md,
  },
});
