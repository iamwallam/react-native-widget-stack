/*******************************************************
 * @file types.ts
 * @description Type definitions for the SmartStack, including
 * widget structure, interface for the main component props,
 * and supporting component properties.
 *******************************************************/

/**
 * Represents the data for a single widget in the stack.
 */
export interface Widget {
  image?: any;
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
  // Optional: let users define whether the stack starts expanded
  defaultExpanded?: boolean;
  // Optional controlled prop: if provided, the parent fully controls expand state
  expanded?: boolean;
  // Callback fired when expand/collapse state changes
  onExpandChange?: (isExpanded: boolean) => void;
  // Callback fired when the active widget index changes on swipe
  onIndexChange?: (index: number) => void;
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
