/*******************************************************
 * @file index.tsx
 * @description Main entry point for the SmartStack component.
 * This component combines the animated Shell, a reanimated Carousel,
 * and navigational dots to mimic an iOS-like widget stack.
 *******************************************************/

import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  runOnJS,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import type { SmartStackProps } from './types';
import { Container } from './Container';
import { Shell } from './Shell';
import { getDimensions } from './utils/dimensions';
import { NavigationDots } from './Navigation';

const { WINDOW_WIDTH, WINDOW_HEIGHT } = getDimensions();

/**
 * Displays the widget label with conditional opacity.
 * @param label - The text to display.
 * @param isVisible - Whether the text should be fully visible or hidden.
 */
const WidgetLabel = React.memo(function WidgetLabel({
  label,
  isVisible,
}: {
  label: string;
  isVisible: boolean;
}) {
  return (
    <Animated.Text
      style={[
        styles.labelText,
        { opacity: isVisible ? 1 : 0 }
      ]}
    >
      {label}
    </Animated.Text>
  );
});

/**
 * Main SmartStack component. Uses react-native-reanimated-carousel for
 * vertical swiping, triggers animated expansions and contractions of the
 * background shell, and tracks the active widget using a shared value.
 * @param widgets - Array of widgets to display in the stack.
 * @param heightProgress - A shared reanimated value controlling the expanded/contracted height.
 */
export const SmartStack: React.FC<SmartStackProps> = ({
  widgets,
  heightProgress,
}) => {
  // Track the active item index for navigation dots
  const [activeIndex, setActiveIndex] = useState(0);

  // We'll store the timer ID used for contracting after a delay
  const contractTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Cancels any existing shell contraction timer, ensuring we don't
   * contract mid-swipe when a new carousel gesture begins.
   */
  const cancelContraction = () => {
    if (contractTimerRef.current) {
      clearTimeout(contractTimerRef.current);
      contractTimerRef.current = null;
    }
  };

  /**
   * Called when we want to fully collapse the shell (heightProgress back to 0).
   */
  const contractShell = () => {
    heightProgress.value = withSpring(0, {
      damping: 20,
      stiffness: 200,
    });
  };

  // Fix the Hook rules violation by converting to a proper custom Hook
  const useItemAnimatedStyle = (animationValue: SharedValue<number>) => {
    return useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.9, 1, 0.9],
        Extrapolation.CLAMP
      );

      const translateY = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [-WINDOW_HEIGHT * 0.05, 0, WINDOW_HEIGHT * 0.05],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }, { translateY }],
      };
    });
  };

  /**
   * Fired when carousel item snapping animation completes,
   * used here to schedule the delayed collapse after an idle period.
   * @param index - The index of the snapped widget.
   */
  const handleSnapToItem = (index: number) => {
    console.log(`[SmartStack] Snapped to index: ${index}`);
    setActiveIndex(index);

    // Cancel any existing timers before starting a fresh one
    cancelContraction();

    // Wait 350ms post-snap, then contract the shell
    contractTimerRef.current = setTimeout(() => {
      runOnJS(contractShell)();
      contractTimerRef.current = null;
    }, 350);
  };

  // Give the Shell a slight offset animation (top, left)
  const shellStyle = useAnimatedStyle(() => ({
    top: interpolate(heightProgress.value, [0, 1], [3, 0], Extrapolation.CLAMP),
    left: interpolate(
      heightProgress.value,
      [0, 1],
      [3, 0],
      Extrapolation.CLAMP
    ),
    position: 'absolute',
    zIndex: 0,
  }));

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {/* The Shell in the background */}
          <Animated.View style={shellStyle}>
            <Shell heightProgress={heightProgress} />
          </Animated.View>

          <Carousel
            vertical
            data={widgets}
            loop={widgets.length > 1}
            width={WINDOW_WIDTH}
            height={WINDOW_HEIGHT}
            snapEnabled={true}
            pagingEnabled={false}
            enabled={true}
            defaultIndex={0}
            renderItem={({ item, index, animationValue }) => {
              const animatedStyle = useItemAnimatedStyle(animationValue);
              
              return (
                <Animated.View style={[styles.itemWrapper, animatedStyle]}>
                  <Container widget={item} index={index} />
                </Animated.View>
              );
            }}
            withAnimation={{
              type: 'spring',
              config: {
                damping: 24,
                stiffness: 200,
                mass: 1,
                restDisplacementThreshold: 0.05,
                restSpeedThreshold: 0.05,
              },
            }}
            // (1) Expand immediately on gesture begin and cancel any pending contraction
            onScrollBegin={() => {
              console.log('[SmartStack] onScrollBegin -> expanding Shell');
              heightProgress.value = withSpring(1, {
                damping: 20,
                stiffness: 200,
              });

              // Clear any existing timer before starting a new delay
              cancelContraction();
            }}
            // (2) We log onScrollEnd but no longer contract here
            onScrollEnd={() => {
              console.log('[SmartStack] onScrollEnd triggered');
            }}
            // (3) Use onSnapToItem as the definitive "settled" point and start delay
            onSnapToItem={handleSnapToItem}
          />
        </View>

        <NavigationDots
          activeIndex={activeIndex}
          totalCount={widgets.length}
          heightProgress={heightProgress}
        />
      </View>
      <WidgetLabel
        label={widgets[activeIndex]?.name ?? 'Test name'}
        isVisible={true}
      />
    </View>
  );
};

// Reusable dimension-based styles
const baseDimensions = {
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...baseDimensions,
    paddingLeft: 9,
  },
  wrapper: {
    ...baseDimensions,
    overflow: 'hidden',
    borderRadius: 26,
    position: 'relative',
  },
  itemWrapper: {
    ...baseDimensions,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  outerContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  labelText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
});
