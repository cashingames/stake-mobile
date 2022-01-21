import 'react-native-gesture-handler';
import React, { useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef, } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import store from './src/store';
import AppRouter from './src/AppRouter';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions, PixelRatio } from 'react-native';
import { Analytics, PageHit } from 'expo-analytics';
import { gaTrackingId } from './src/utils/BaseUrl';

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
  else if (fontScale > 1.2) {
    rem = rem - 4;
  }
  else if (fontScale > 1.1) {
    rem = rem - 2;
  }

  return rem;
}

console.log(width, width > 400 ? 18 : 16);

function App() {

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

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

  const onRouteChange = () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute().name;

    if (previousRouteName !== currentRouteName) {
      const analytics = new Analytics(gaTrackingId);
      analytics.hit(new PageHit(currentRouteName))
        .then(() => console.log("GA page hit successful on " + currentRouteName))
        .catch(e => console.log(e.message));
    }
    routeNameRef.current = currentRouteName;
  }

  console.log("app restart");

  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = 'intro';
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

module.hot.accept(() => {
  EStyleSheet.clearCache();
  EStyleSheet.build();
});