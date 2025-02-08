/*******************************************************
 * @file index.tsx
 * @description Main entry point for the SmartStack component.
 * This component combines the animated Shell, a reanimated Carousel,
 * and navigational dots to mimic an iOS-like widget stack.
 *
 * NOTE: To address the TypeScript version warning, you must
 * update your package.json devDependencies:
 *
 *  "typescript": "^5.1.6"
 *
 *******************************************************/

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  Extrapolation,
  runOnJS,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
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
 * A sub-component for rendering an individual Carousel item with reanimated styling.
 * This ensures we don't violate the “Hook Rules” by calling hooks inside a render callback.
 */
const AnimatedItem: React.FC<{
  item: any; // or a stronger type if you have it
  index: number;
  animationValue: SharedValue<number>;
}> = ({ item, index, animationValue }) => {
  const animatedStyle = useAnimatedStyle(() => {
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

  return (
    <Animated.View style={[styles.itemWrapper, animatedStyle]}>
      <Container widget={item} index={index} />
    </Animated.View>
  );
};

/**
 * Displays the widget label with conditional opacity, moved away from inline styling.
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
        isVisible ? styles.labelVisible : styles.labelHidden,
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
 *
 * @param widgets - Array of widgets to display in the stack.
 * @param defaultExpanded - Whether the stack should be expanded by default.
 * @param expanded - Whether the stack is currently expanded (for controlled usage).
 * @param onExpandChange - Callback to handle changes to the expanded state.
 * @param onIndexChange - Callback to handle changes to the active index.
 */
export const SmartStack: React.FC<SmartStackProps> = ({
  widgets,
  defaultExpanded = false,
  expanded,
  onExpandChange,
  onIndexChange,
}) => {
  // Track the active item index for navigation dots
  const [activeIndex, setActiveIndex] = useState(0);

  // We'll store the timer ID used for contracting after a delay
  const contractTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isControlled = expanded !== undefined;
  const localExpanded = useSharedValue(defaultExpanded ? 1 : 0);

  /**
   * Helper to expand or collapse the stack.
   */
  const setExpanded = (value: boolean) => {
    if (!isControlled) {
      localExpanded.value = withSpring(value ? 1 : 0, {
        damping: 20,
        stiffness: 200,
      });
    }
    onExpandChange?.(value);
  };

  /**
   * Sync localExpanded with external `expanded` prop if in controlled mode.
   */
  useEffect(() => {
    if (isControlled && expanded !== undefined) {
      localExpanded.value = withSpring(expanded ? 1 : 0, {
        damping: 20,
        stiffness: 200,
      });
    }
    // Add localExpanded to dependencies for lint (though it's stable).
  }, [expanded, isControlled, localExpanded]);

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
   * Called when we want to fully collapse the shell (localExpanded back to 0).
   */
  const contractShell = () => {
    setExpanded(false);
  };

  /**
   * Fired when carousel item snapping animation completes,
   * used here to schedule the delayed collapse after an idle period.
   */
  const handleSnapToItem = (index: number) => {
    console.log(`[SmartStack] Snapped to index: ${index}`);
    setActiveIndex(index);
    onIndexChange?.(index);

    cancelContraction();
    contractTimerRef.current = setTimeout(() => {
      runOnJS(contractShell)();
      contractTimerRef.current = null;
    }, 350);
  };

  // Give the Shell a slight offset animation (top, left) based on expansion
  const shellStyle = useAnimatedStyle(() => ({
    top: interpolate(localExpanded.value, [0, 1], [3, 0], Extrapolation.CLAMP),
    left: interpolate(localExpanded.value, [0, 1], [3, 0], Extrapolation.CLAMP),
    position: 'absolute',
    zIndex: 0,
  }));

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {/* The Shell in the background */}
          <Animated.View style={shellStyle}>
            <Shell heightProgress={localExpanded} />
          </Animated.View>

          <Carousel
            vertical
            data={widgets}
            loop={widgets.length > 1}
            width={WINDOW_WIDTH}
            height={WINDOW_HEIGHT}
            snapEnabled
            pagingEnabled={false}
            enabled
            defaultIndex={0}
            renderItem={({ item, index, animationValue }) => (
              <AnimatedItem
                item={item}
                index={index}
                animationValue={animationValue}
              />
            )}
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
              if (!isControlled) {
                setExpanded(true);
              }
              cancelContraction();
            }}
            // (2) We log onScrollEnd but no longer contract here
            onScrollEnd={() => {
              console.log('[SmartStack] onScrollEnd triggered');
            }}
            // (3) Use onSnapToItem as the definitive "settled" point and start the delay
            onSnapToItem={handleSnapToItem}
          />
        </View>

        <NavigationDots
          activeIndex={activeIndex}
          totalCount={widgets.length}
          heightProgress={localExpanded}
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
  outerContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
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
  labelText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
  },
  // Moved inline opacity styles here
  labelVisible: {
    opacity: 1,
  },
  labelHidden: {
    opacity: 0,
  },
});
