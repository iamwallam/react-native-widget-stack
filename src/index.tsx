/*******************************************************
 * @file index.tsx
 * @description Main entry point for the react-native-widget-stack library.
 * Exports the SmartStack component and its TypeScript types.
 *******************************************************/

import { SmartStack as SmartStackComponent } from './SmartStack';
import type {
  SmartStackProps,
  Widget,
  ContainerProps,
  NavigationDotsProps,
} from './SmartStack/types';

// Export the component with proper type definitions
export const SmartStack: React.FC<SmartStackProps> = SmartStackComponent;

// Export types through the component's namespace
export namespace SmartStack {
  export type Props = SmartStackProps;
  export type WidgetType = Widget;
  export type ContainerType = ContainerProps;
  export type NavigationDotsType = NavigationDotsProps;
}
