import 'expo-dev-client';
import 'expo-splash-screen' //need to resolve No native splash screen registered for given view controller.Call 'SplashScreen.show' for given view controller first

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
