/*******************************************************
 * @file Shell.tsx
 * @description Renders a semi-transparent, blurred background
 * that gracefully scales and rounds corners when expanding or contracting.
 *******************************************************/

import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { getDimensions } from './utils/dimensions';

const {
  BASE_WIDTH,
  BASE_HEIGHT,
  BASE_RADIUS,
  EXPANDED_WIDTH,
  EXPANDED_HEIGHT,
  EXPANDED_RADIUS,
} = getDimensions();

interface ShellProps {
  heightProgress: Animated.SharedValue<number>;
}

/**
 * Shell
 * Fills the background with a frosted-glass effect, changing width, height,
 * and border-radius based on the shared value `heightProgress`.
 * @param heightProgress - A shared reanimated value from 0 (contracted) to 1 (expanded).
 */
export const Shell: React.FC<ShellProps> = ({ heightProgress }) => {
  /**
   * Dynamically compute the size and corner radius based on the expanded state.
   */
  const shellStyle = useAnimatedStyle(() => ({
    width: interpolate(
      heightProgress.value,
      [0, 1],
      [BASE_WIDTH, EXPANDED_WIDTH],
      Extrapolation.CLAMP
    ),
    height: interpolate(
      heightProgress.value,
      [0, 1],
      [BASE_HEIGHT, EXPANDED_HEIGHT],
      Extrapolation.CLAMP
    ),
    borderRadius: interpolate(
      heightProgress.value,
      [0, 1],
      [BASE_RADIUS, EXPANDED_RADIUS],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View style={[styles.shell, shellStyle]}>
      <BlurView intensity={80} tint="systemThinMaterial" style={styles.blur} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shell: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
});
