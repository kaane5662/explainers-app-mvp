import React from 'react';
import { Platform, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const glassSurfaceStyle = (borderRadius: number, surfaceOpacity: number) => ({
  backgroundColor: `rgba(255, 255, 255, ${surfaceOpacity})`,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.35)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 8,
  borderRadius,
  overflow: 'hidden' as const,
  padding: 20,
});

type Props = {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | undefined;
  borderRadius?: number;
  surfaceOpacity?: number; // 0..1 glass fill behind content
};

const GlassCard = ({
  children,
  style = {},
  intensity = 24,
  tint = 'light',
  borderRadius = 20,
  surfaceOpacity = 0.25,
}: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
  }));

  return (
    <AnimatedBlurView
      intensity={intensity}
      tint={tint}
      experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      blurReductionFactor={Platform.OS === 'android' ? 4 : undefined}
      style={[{ borderRadius, overflow: 'hidden' }, animatedStyle, style]}>
      {/* Subtle internal surface to control translucency */}
      <View style={glassSurfaceStyle(borderRadius, surfaceOpacity)}>{children}</View>
    </AnimatedBlurView>
  );
};

export default GlassCard;
