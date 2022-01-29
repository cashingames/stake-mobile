import 'react-native-gesture-handler';
import React, { useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import store from './src/store';
import AppRouter from './src/AppRouter';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions, PixelRatio } from 'react-native';

let { height, width } = Dimensions.get('window');
let fontScale = PixelRatio.getFontScale();

EStyleSheet.build({
  $rem: getRem()
});

function getRem() {
  let rem = width > 400 ? 18 : 14

  if (fontScale < 0.81) {
    rem = rem + 3;
  }
  else if (fontScale < 1) {
    rem = rem + 2;
  }
  else if (fontScale > 1.29) {
    rem = rem - 5;
  }
  else if (fontScale > 1.2) {
    rem = rem - 4;
  }
  else if (fontScale > 1.1) {
    rem = rem - 2;
  }

  console.log(rem);

  return rem;
}

console.log(width, width > 400 ? 18 : 16);

function App() {


  const routeNameRef = useRef();
  const navigationRef = useNavigationContainerRef();

  let [fontsLoaded] = useFonts({
    'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    'graphik-regular': require('./assets/fonts/GraphikRegular.otf'),
    'graphik-bold': require('./assets/fonts/GraphikBold.otf'),
    'graphik-italic': require('./assets/fonts/GraphikRegularItalic.otf'),
    'graphik-medium': require('./assets/fonts/GraphikMedium.otf'),
  });

  const onRouteChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute().name;
    console.log(previousRouteName, currentRouteName)
    if (previousRouteName !== currentRouteName) {
      console.log("Logging to analytics", currentRouteName)
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
    routeNameRef.current = currentRouteName;
  }

  if (!fontsLoaded) {
    return <AppLoading />
  }


  console.log("app restart");

  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute()?.name;
        }}
        onStateChange={onRouteChange}
      >
        <SafeAreaProvider>
          <AppRouter />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}


export default App;