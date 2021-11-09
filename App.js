
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppRouter from './src/AppRouter';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

function App() {

  let [fontsLoaded] = useFonts({
    'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    'graphik-regular': require('./assets/fonts/GraphikRegular.otf'),
    'graphik-bold': require('./assets/fonts/GraphikBold.otf'),
    'graphik-italic': require('./assets/fonts/GraphikRegularItalic.otf'),
    'graphik-medium': require('./assets/fonts/GraphikMedium.otf'),
  });
 
  if (!fontsLoaded) {
    return <AppLoading   />
  }
  return (
    // <Provider store={configureStore}>
    <NavigationContainer>
      <AppRouter />
    </NavigationContainer>
    // </Provider>
  );
}


export default App;