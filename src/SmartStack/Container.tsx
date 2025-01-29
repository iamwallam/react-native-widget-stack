/*******************************************************
 * @file Container.tsx
 * @description Renders the main widget content, including
 * an optional image and the widget's custom component.
 *******************************************************/

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import type { ContainerProps } from './types';
import { getDimensions } from './utils/dimensions';

const { WIDGET_WIDTH, WIDGET_HEIGHT, WIDGET_RADIUS } = getDimensions();

/**
 * Container
 * Displays either an image or custom component (or both),
 * wrapped in a colored background reflecting the widget's theme.
 * @param widget - The widget data, including image, color, and optional component.
 */
export const Container: React.FC<ContainerProps> = ({ widget }) => {
  return (
    <View style={[styles.container, { backgroundColor: widget.color }]}>
      {/* If an image is provided, display it behind the widget component */}
      {widget.image && <Image source={widget.image} style={styles.image} />}
      {/* If a component is provided, render it on top of the image */}
      {widget.component && <widget.component {...(widget.props || {})} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDGET_WIDTH,
    height: WIDGET_HEIGHT,
    borderRadius: WIDGET_RADIUS,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: WIDGET_WIDTH,
    height: WIDGET_HEIGHT,
    resizeMode: 'cover',
  },
});
