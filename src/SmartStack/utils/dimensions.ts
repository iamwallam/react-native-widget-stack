/**
 * @file dimensions.ts
 * This file provides dimension presets for the Smart Stack component.
 * Thresholds are set to differentiate small vs. large devices and apply
 * corresponding width, height, and radius values for the widget shell.
 */

import { Dimensions } from 'react-native';

/**
 * Defines the structure of dimension sets returned by getDimensions().
 */
interface DimensionSet {
  WINDOW_WIDTH: number;
  WINDOW_HEIGHT: number;
  BASE_WIDTH: number;
  BASE_HEIGHT: number;
  BASE_RADIUS: number;
  EXPANDED_WIDTH: number;
  EXPANDED_HEIGHT: number;
  EXPANDED_RADIUS: number;
  WIDGET_WIDTH: number;
  WIDGET_HEIGHT: number;
  WIDGET_RADIUS: number;
}

/**
 * Automatically selects from standard dimension sets based on
 * device width/height breakpoints, ensuring the SmartStack
 * scales nicely for both small and large screens.
 */
export function getDimensions(): DimensionSet {
  const { width, height } = Dimensions.get('window');

  if (width >= 430 || height >= 900) {
    // Large device
    return {
      WINDOW_WIDTH: 370,
      WINDOW_HEIGHT: 176,
      BASE_WIDTH: 364,
      BASE_HEIGHT: 170,
      BASE_RADIUS: 22,
      EXPANDED_WIDTH: 370,
      EXPANDED_HEIGHT: 176,
      EXPANDED_RADIUS: 26,
      WIDGET_WIDTH: 364,
      WIDGET_HEIGHT: 170,
      WIDGET_RADIUS: 22,
    };
  } else if (height <= 700) {
    // Small device
    return {
      WINDOW_WIDTH: 335,
      WINDOW_HEIGHT: 161,
      BASE_WIDTH: 329,
      BASE_HEIGHT: 155,
      BASE_RADIUS: 22,
      EXPANDED_WIDTH: 335,
      EXPANDED_HEIGHT: 161,
      EXPANDED_RADIUS: 26,
      WIDGET_WIDTH: 329,
      WIDGET_HEIGHT: 155,
      WIDGET_RADIUS: 22,
    };
  } else {
    // Default device size
    return {
      WINDOW_WIDTH: 344,
      WINDOW_HEIGHT: 164,
      BASE_WIDTH: 338,
      BASE_HEIGHT: 158,
      BASE_RADIUS: 22,
      EXPANDED_WIDTH: 344,
      EXPANDED_HEIGHT: 164,
      EXPANDED_RADIUS: 26,
      WIDGET_WIDTH: 338,
      WIDGET_HEIGHT: 158,
      WIDGET_RADIUS: 22,
    };
  }
}
