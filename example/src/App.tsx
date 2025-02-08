import { View, StyleSheet } from 'react-native';
import { SmartStack } from 'react-native-widget-stack';

export default function App() {
  // Example widget data with required image property
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
        widgets={testWidgets}
        defaultExpanded={false}
        onExpandChange={(isExpanded) =>
          console.log('Expanded changed:', isExpanded)
        }
        onIndexChange={(index) => console.log('Index changed:', index)}
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
