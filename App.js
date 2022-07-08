import 'react-native-gesture-handler';
import React, { useRef } from 'react';
import { Dimensions, PixelRatio, Text,  StatusBar } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';

import store from './src/store';
import AppRouter from './src/AppRouter';

let { height, width } = Dimensions.get('window');
let fontScale = PixelRatio.getFontScale();
const prefix = Linking.createURL("/");

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
  return rem;
}

const config = {
  screens: {
    Signup: 'signup/:referralCode',
    AppRouter: {
      screens: {
        Home: 'home',
        Game: 'game',
        Wallet: 'wallet',
      },
    },
    GameStore: 'store',
    Trivia: 'trivia',
    FundWallet: 'fund',
    UserProfile: 'profile',
    Invite: 'invite',
    AcceptDeclineDuel:'challenge'
  },
};

const linking = {
  prefixes: [prefix],
  config
};


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

    if (previousRouteName !== currentRouteName) {
      console.log("Logging to analytics", currentRouteName)
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
    routeNameRef.current = currentRouteName;
  }

  if (fontsLoaded) {
    SplashScreen.hideAsync();
  } else {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute()?.name;
        }}
        onStateChange={onRouteChange}
        linking={linking} fallback={<Text>Loading...</Text>}
      >
        <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFF" />
          <AppRouter />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

export default App;

//Enable hotreload of EStylesheet
if (Constants.manifest.extra.isDevelopment) {
  module.hot.accept(() => {
    EStyleSheet.clearCache();
    EStyleSheet.build();
  });
}