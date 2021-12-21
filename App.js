import 'expo-dev-client'
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import store from './src/store';
import AppRouter from './src/AppRouter';

function App() {

  let [fontsLoaded] = useFonts({
    'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    'graphik-regular': require('./assets/fonts/GraphikRegular.otf'),
    'graphik-bold': require('./assets/fonts/GraphikBold.otf'),
    'graphik-italic': require('./assets/fonts/GraphikRegularItalic.otf'),
    'graphik-medium': require('./assets/fonts/GraphikMedium.otf'),
  });


  if (!fontsLoaded) {
    return <AppLoading />
  }

  console.log("app restart");

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <AppRouter />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}


export default App;