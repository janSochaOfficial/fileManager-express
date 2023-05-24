
import { StyleSheet , View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Main from './screens/main';
import Gallery from './screens/gallery';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator>
              <Stack.Screen name="Main" component={Main}  options={{headerShown: false}} />
              <Stack.Screen name="Gallery" component={Gallery}  />

          </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
