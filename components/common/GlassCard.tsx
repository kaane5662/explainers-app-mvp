import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { glassCardStyle } from '../../styles/createStyles';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const GlassCard = ({
  children,
  style = {},
  intensity = 30,
  tint = 'light' as const,
  borderRadius = 20,
}: {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  tint?: 'light' | 'dark';
  borderRadius?: number;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }],
  }));

  return (
    <AnimatedBlurView
      intensity={intensity}
      tint={tint}
      style={[
        {
          borderRadius,
          marginBottom: 20,
        },
        animatedStyle,
        style,
      ]}>
      <View style={{ ...glassCardStyle, padding: 20, borderRadius }}>{children}</View>
    </AnimatedBlurView>
  );
};

export default GlassCard;
