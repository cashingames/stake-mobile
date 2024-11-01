import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { Dimensions, PixelRatio, Text } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';

import { Settings } from 'react-native-fbsdk-next';


import {store} from './src/store';
import AppRouter from './src/AppRouter';
import messaging from '@react-native-firebase/messaging';

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
    MyChallengesScore: 'challenge/:challengeId',
    ChallengeGameInstruction: 'instructions/:challengeId',
    EmailVerified: 'verifyemail/:email'
  },
};

const linking = {
  prefixes: [prefix],
  config
};


function App() {

  const routeNameRef = useRef();
  const navigationRef = useNavigationContainerRef();

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    
    if (remoteMessage.data.action_type == "CHALLENGE") {
      // navigate to challenge screen using remoteMessage.data.action_id as the challenge id prop							navigation.navigate('MyChallengesScore', { challengeId: remoteMessage.data.action_id })
      // navigation.navigate('MyChallengesScore', { challengeId: remoteMessage.data.action_id })
      // navigationRef.navigate('MyChallengesScore', { challengeId: remoteMessage.data.action_id });
    }
  });

  let [fontsLoaded] = useFonts({
    'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    'graphik-regular': require('./assets/fonts/GraphikRegular.otf'),
    'graphik-bold': require('./assets/fonts/GraphikBold.otf'),
    'graphik-italic': require('./assets/fonts/GraphikRegularItalic.otf'),
    'graphik-medium': require('./assets/fonts/GraphikMedium.otf'),
    'sansation-regular': require('./assets/fonts/Sansation_Regular.ttf'),
    'sansation-bold': require('./assets/fonts/Sansation_Bold.ttf'),
    'sansation-light': require('./assets/fonts/Sansation_Light.ttf'),
    'gotham-bold': require('./assets/fonts/GothamRoundedBold_21016.ttf'),
    'gotham-book': require('./assets/fonts/GothamRoundedBook_21018.ttf'),
    'gotham-light': require('./assets/fonts/GothamRoundedLight_21020.ttf'),
    'gotham-medium': require('./assets/fonts/GothamRoundedMedium_21022.ttf'),
    'bubble-regular': require('./assets/fonts/bubbleboddyneue-regular.ttf'),
    'bubble-bold': require('./assets/fonts/BubbleboddyNeue-Bold.ttf'),

  });

  const onRouteChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.getCurrentRoute().name;

    if (previousRouteName !== currentRouteName) {
      await analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
    routeNameRef.current = currentRouteName;
  }

  useEffect(() => {
    Settings.initializeSDK('401438355501146');
  }, []);

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
          <AppRouter />
        </SafeAreaProvider>
        <Toast/>
      </NavigationContainer>
    </Provider>
  );
}

export default App;

//Enable hotreload of EStylesheet
if (Constants.expoConfig.extra.isDevelopment) {
  module.hot.accept(() => {
    EStyleSheet.clearCache();
    EStyleSheet.build();
  });
}