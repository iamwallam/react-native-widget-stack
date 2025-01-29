/*******************************************************
 * @file types.ts
 * @description Type definitions for the SmartStack, including
 * widget structure, interface for the main component props,
 * and supporting component properties.
 *******************************************************/

import Animated from 'react-native-reanimated';

/**
 * Represents the data for a single widget in the stack.
 */
export interface Widget {
  image: any;
  id: string;
  name: string;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
  color?: string;
}

/**
 * Props for the top-level SmartStack component.
 * @param widgets - The array of widget objects to display.
 * @param heightProgress - A shared reanimated value controlling stack expansion.
 */
export interface SmartStackProps {
  widgets: Widget[];
  heightProgress: Animated.SharedValue<number>;
}

/**
 * Props for the basic container that wraps each widget's visual content.
 */
export interface ContainerProps {
  widget: Widget;
  index: number;
}

/**
 * Props for the NavigationDots component, used to
 * indicate the active widget and total widget count.
 */
export interface NavigationDotsProps {
  activeIndex: number;
  totalCount: number;
}
