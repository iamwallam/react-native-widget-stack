/*******************************************************
 * @file Navigation.tsx
 * @description Displays a vertical set of dots indicating
 * the current widget in the stack, with smooth expansion animations.
 *******************************************************/

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import { getDimensions } from './utils/dimensions';

const { WINDOW_HEIGHT } = getDimensions();

interface NavigationDotsProps {
  activeIndex: number;
  totalCount: number;
  heightProgress: Animated.SharedValue<number>;
}

/**
 * SingleDot
 * Renders an individual dot whose appearance changes based on
 * whether it's the active index and the current expansion state.
 */
const SingleDot: React.FC<{
  index: number;
  isActive: boolean;
  heightProgress: Animated.SharedValue<number>;
}> = ({ index, isActive, heightProgress }) => {
  /**
   * Tracks the transition from inactive to active for a dot,
   * giving a small scaling/fade-in effect.
   */
  const activeProgress = useDerivedValue(() => {
    return withTiming(isActive ? 1 : 0, { duration: 150 });
  }, [isActive]);

  /**
   * Combine the dot's base expansion (based on heightProgress) with any
   * additional fade for active state transitions.
   */
  const animatedStyle = useAnimatedStyle(() => {
    const STAGGER_STEP = 0.07; // Slight delay for each dot
    const startDelay = index * STAGGER_STEP;

    const progress = interpolate(
      heightProgress.value,
      [startDelay, 1],
      [0, 1],
      Extrapolation.CLAMP
    );

    // Cross-fade between active/inactive states
    const baseOpacity = interpolate(progress, [0, 1], [0, 1]);
    const finalOpacity = interpolate(activeProgress.value, [0, 1], [0.6, 1]);

    return {
      transform: [{ scale: interpolate(progress, [0, 1], [0.8, 1]) }],
      opacity: baseOpacity * finalOpacity,
    };
  });

  return (
    <Animated.View
      style={[styles.dot, isActive && styles.activeDot, animatedStyle]}
    />
  );
};

/**
 * NavigationDots
 * Maps the total widget count into a list of SingleDot components,
 * animating in or out as the stack height changes.
 * @param activeIndex - The index of the currently displayed widget.
 * @param totalCount - The total number of widgets.
 * @param heightProgress - Shared value controlling the stack's expansion.
 */
export const NavigationDots: React.FC<NavigationDotsProps> = ({
  activeIndex,
  totalCount,
  heightProgress,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalCount }).map((_, i) => (
        <SingleDot
          key={i}
          index={i}
          isActive={i === activeIndex}
          heightProgress={heightProgress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    zIndex: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
    marginVertical: 3.5,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
