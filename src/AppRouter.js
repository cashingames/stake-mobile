import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SideNavigator from './screens/SideNavigator';
import DashboardScreen from './screens/DashboardScreen';
import IntroSlide from './screens/IntroSlide';
import GameBoosts from './screens/GameBoosts';
import DuelGameCountdown from './screens/DuelGameCountdown';
import DuelGameEndResult from './screens/DuelGameEndResult';
import DuelGameInProgress from './screens/DuelGameInProgress';
import DuelScreen from './screens/DuelScreen';
import DuelSelectPlayer from './screens/DuelSelectPlayer';
import ExtendedLeaderboard from './screens/ExtendedLeaderboard';
import GameEndResult from './screens/GameEndResult';
import GameInProgress from './screens/GameInProgress';
import GameInstructions from './screens/GameInstructions';
import GameInstructionsDuel from './screens/GameInstructionsDuel';
import GameInstructionsTournament from './screens/GameInstructionsTournament';
import GameMode from './screens/GameMode';
import StartGameCountdown from './screens/StartGameCountdown';
import GameScreen from './screens/GameScreen';
import InviteFriends from './screens/InviteFriends';
import TransactionScreen from './screens/TransactionScreen';
import SetNewPassword from './screens/SetNewPassword';
import WalletScreen from './screens/WalletScreen';
import BankDetails from './screens/BankDetails';
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsAndConditions from './screens/TermsAndConditions';
import UserStats from './screens/UserStats';
import AchievementsMilestone from './screens/AchievementsMilestone';
import UserProfile from './screens/UserProfile';
import ChangePassword from './screens/ChangePassword';
import EditDetails from './screens/EditDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInScreen from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import ForgotPassword from './screens/Auth/ForgotPassword';

const Stack = createNativeStackNavigator();

// const SignInNavigator = createNativeStackNavigator();

function AppRouter() {
    const [isFirst, setIsFirst] = useState(true);
    console.log("A" + isFirst); 
    console.log("*****");
    useEffect(() => {
        console.log("about to get value from storage")
        AsyncStorage.getItem('isFirst')
        .then(result => {
            console.log("Got result from storage  " + result);
            setIsFirst(result);
        });
    }, []);

    console.log("About to render " + isFirst);

    if(isFirst === true || isFirst === null || isFirst === undefined)
    {
        console.log("Rendering intro slides" + isFirst);

        return (
             <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="IntroSlide" component={IntroSlide} />
            </Stack.Navigator>
        );
    }

    console.log("Rendering main app" + isFirst);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="DashboardScreen" component={DashboardScreen} /> */}
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        </Stack.Navigator>
    );

}

// function AppRouter() {

//     return (
//         // <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="SideNavigator" component={SideNavigator} />
//             <Stack.Screen name="IntroSlide" component={IntroSlide} />
//             <Stack.Screen name="Dashboard" component={DashboardScreen} />
//             <Stack.Screen name="DuelGameCountdown" component={DuelGameCountdown} />
//             <Stack.Screen name="DuelGameEndResult" component={DuelGameEndResult} />
//             <Stack.Screen name="DuelGameInProgress" component={DuelGameInProgress} />
//             <Stack.Screen name="DuelScreen" component={DuelScreen} />
//             <Stack.Screen name="DuelSelectPlayer" component={DuelSelectPlayer} />
//             <Stack.Screen name="ExtendedLeaderboard" component={ExtendedLeaderboard} />
//             <Stack.Screen name="GameBoosts" component={GameBoosts} />
//             <Stack.Screen name="GameEndResult" component={GameEndResult} />
//             <Stack.Screen name="GameInProgress" component={GameInProgress} />
//             <Stack.Screen name="GameInstructions" component={GameInstructions} />
//             <Stack.Screen name="GameInstructionsDuel" component={GameInstructionsDuel} />
//             <Stack.Screen name="GameInstructionsTournament" component={GameInstructionsTournament} />
//             <Stack.Screen name="GameMode" component={GameMode} />
//             <Stack.Screen name="GameScreen" component={GameScreen} />
//             <Stack.Screen name="InviteFriends" component={InviteFriends} />
//             <Stack.Screen name="StartGameCountdown" component={StartGameCountdown} />
//             <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
//             <Stack.Screen name="WalletScreen" component={WalletScreen} />
//             <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
//             <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
//             <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
//             <Stack.Screen name="BankDetails" component={BankDetails} />
//             <Stack.Screen name="UserStats" component={UserStats} />
//             <Stack.Screen name="AchievementsMilestone" component={AchievementsMilestone} />
//             <Stack.Screen name="ChangePassword" component={ChangePassword} />
//             <Stack.Screen name="EditDetails" component={EditDetails} />
//             <Stack.Screen name="UserProfile" component={UserProfile} />
//         </Stack.Navigator>

//         // </NavigationContainer>
//     );
// }


export default AppRouter;