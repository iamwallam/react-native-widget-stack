# React Native Widget Stack

This is a React Native component that recreates the iOS 17 Smart Stack widget interaction and animation. It provides a vertically scrollable stack of widgets with smooth expansion/collapse animations and navigation dots.

![SmartStack Demo](./example/assets/widget-stack-smartstack-expanded.png)

## Features

- 🎯 Pixel-perfect recreation of iOS 18 Smart Stack widget
- 🔄 Smooth vertical scrolling with spring animations
- 💨 Blur effects and translucent backgrounds
- 📱 Responsive sizing for different device sizes
- ⚡️ Built with React Native Reanimated for optimal performance
- 🎨 Customizable widgets with support for custom components

## Installation

```js
npm install react-native-widget-stack
```

## Dependencies
This library needs these dependencies to be installed in your project before you can use it:
```js
npm install react-native-gesture-handler react-native-reanimated react-native-reanimated-carousel expo-blur 
```
**NOTE:**
**React Native Gesture Handler** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-gesture-handler/docs/installation). Please make sure to wrap your App with GestureHandlerRootView when you've upgraded to React Native Gesture Handler ^2.

**React Native Reanimated v2** needs extra steps to finalize its installation, please follow their [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started).

## Basic Usage

```ts
import { SmartStack } from 'react-native-widget-stack';
import { useSharedValue } from 'react-native-reanimated';

function App() {
const heightProgress = useSharedValue(0);

const widgets = [
{ id: '1', name: 'Weather', color: '#007AFF', component: WeatherWidget },
{ id: '2', name: 'Calendar', color: '#FF3B30', component: CalendarWidget },
{ id: '3', name: 'Photos', color: '#FF9500', component: PhotoWidget },
];

return (
<SmartStack
widgets={widgets}
heightProgress={heightProgress}
/>
);
}
```

## Widget Configuration
Each widget in the stack accepts the following properties:

```ts
interface Widget {
id: string; // Unique identifier
name: string; // Widget name displayed below the stack
color?: string; // Background color
image?: any; // Optional background image
component?: React.ComponentType<any>; // Custom widget component
props?: Record<string, any>; // Props passed to custom component
}
```

## Customization
The SmartStack component automatically adjusts its dimensions based on the device size, but you can customize various aspects:

- Widget dimensions and spacing
- Animation timing and spring configurations
- Background blur intensity
- Navigation dots appearance

## Requirements

- React Native >= 0.71.0
- Expo SDK >= 49 (if using Expo)
- iOS 13+ for blur effects
- Android API Level 21+

## Contributing
See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
