import { View, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

// Import your SmartStack from the new library
import { SmartStack } from 'react-native-widget-stack';

export default function App() {
  // This shared value controls the stack's expand/collapse animation
  // If you want it expanded by default, set `heightProgress.value = 1` somewhere
  const heightProgress = useSharedValue(0);

  // Example widget data — you can replace these colors or add images
  const testWidgets = [
    { id: '1', name: 'Maps', color: 'blue' },
    { id: '2', name: 'Weather', color: 'red' },
    { id: '3', name: 'News', color: 'green' },
    { id: '4', name: 'Reminders', color: 'darkblue' },
    { id: '5', name: 'Photos', color: 'pink' },
  ];

  return (
    <View style={styles.container}>
      <SmartStack
        widgets={testWidgets as SmartStack.WidgetType[]}
        heightProgress={heightProgress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark background to match the prototype
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50, // Add some top spacing if desired
  },
});
