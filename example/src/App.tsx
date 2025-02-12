import { View, StyleSheet } from 'react-native';
import { SmartStack } from 'react-native-widget-stack';

export default function App() {
  
  const testWidgets = [
    { id: '1', name: 'Maps', color: 'blue' },
    { id: '2', name: 'Weather', color: 'red' },
    { id: '3', name: 'News', color: 'green' },
  ];

  return (
    <View style={styles.container}>
      <SmartStack widgets={testWidgets}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50, 
  },
});