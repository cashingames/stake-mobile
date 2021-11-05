// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroSlide from './src/screens/IntroSlide';
import useCachedResources from './hooks/useCachedResources';
import DashboardScreen from './src/screens/DashboardScreen';
import UserProfile from './src/screens/UserProfile';
import EditDetails from './src/screens/EditDetails';
import ChangePassword from './src/screens/ChangePassword';
import AchievementsMilestone from './src/screens/AchievementsMilestone';
import UserStats from './src/screens/UserStats';
import BankDetails from './src/screens/BankDetails';
import TermsAndConditions from './src/screens/TermsAndConditions';
import PrivacyPolicy from './src/screens/PrivacyPolicy';
import SetNewPassword from './src/screens/SetNewPassword';
import WalletScreen from './src/screens/WalletScreen';
import TransactionScreen from './src/screens/TransactionScreen';
import StartGameCountdown from './src/screens/StartGameCountdown';
import InviteFriends from './src/screens/InviteFriends';
import GameScreen from './src/screens/GameScreen';
import GameMode from './src/screens/GameMode';
import GameInstructionsTournament from './src/screens/GameInstructionsTournament';
import GameInstructionsDuel from './src/screens/GameInstructionsDuel';
import GameInstructions from './src/screens/GameInstructions';
import GameInProgress from './src/screens/GameInProgress';
import GameEndResult from './src/screens/GameEndResult';
import GameBoosts from './src/screens/GameBoosts';
import ExtendedLeaderboard from './src/screens/ExtendedLeaderboard';
import DuelSelectPlayer from './src/screens/DuelSelectPlayer';
import DuelScreen from './src/screens/DuelScreen';
import DuelGameInProgress from './src/screens/DuelGameInProgress';
import DuelGameEndResult from './src/screens/DuelGameEndResult';
import DuelGameCountdown from './src/screens/DuelGameCountdown';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="DuelGameCountdown" component={DuelGameCountdown} />
        <Stack.Screen name="DuelGameEndResult" component={DuelGameEndResult} />
        <Stack.Screen name="DuelGameInProgress" component={DuelGameInProgress} />
        <Stack.Screen name="DuelScreen" component={DuelScreen} />
        <Stack.Screen name="DuelSelectPlayer" component={DuelSelectPlayer} />
        <Stack.Screen name="ExtendedLeaderboard" component={ExtendedLeaderboard} />
        <Stack.Screen name="GameBoosts" component={GameBoosts} />
        <Stack.Screen name="GameEndResult" component={GameEndResult} />
        <Stack.Screen name="GameInProgress" component={GameInProgress} />
        <Stack.Screen name="GameInstructions" component={GameInstructions} />
        <Stack.Screen name="GameInstructionsDuel" component={GameInstructionsDuel} />
        <Stack.Screen name="GameInstructionsTournament" component={GameInstructionsTournament} />
        <Stack.Screen name="GameMode" component={GameMode} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="InviteFriends" component={InviteFriends} />
        <Stack.Screen name="StartGameCountdown" component={StartGameCountdown} />
        <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <Stack.Screen name="BankDetails" component={BankDetails} />
        <Stack.Screen name="UserStats" component={UserStats} />
        <Stack.Screen name="AchievementsMilestone" component={AchievementsMilestone} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="EditDetails" component={EditDetails} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="IntroSlide" component={IntroSlide} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;