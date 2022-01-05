import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from "axios";

import PageLoading from './shared/PageLoading';
import HomeRouter from './features/Home/HomeRouter';
import ExtendedLeaderboard from './features/Leaderboard/ExtendedLeaderboard';
import FundWalletScreen from './features/Transactions/FundWalletScreen';
import FundWalletCompleted from './features/Transactions/FundWalletCompleted';
import TransactionScreen from './features/Transactions/TransactionScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import InviteFriendsScreen from './screens/InviteFriendsScreen';
import UserProfileScreen from './features/Profile/UserProfileScreen';
import UserStatsScreen from './features/Profile/UserStatsScreen';
import ChangePasswordScreen from './features/Profile/ChangePasswordScreen';
import AchievementsMilestoneScreen from './features/Profile/AchievementsMilestoneScreen';
import BankDetailsScreen from './features/Profile/BankDetailsScreen';
import EditProfileDetailsScreen from './features/Profile/EditProfileDetailsScreen';
import SupportQuestionsScreen from './features/Support/SupportQuestionsScreen';
import SupportAnswerScreen from './features/Support/SupportAnswerScreen';

import { isLoggedIn, shouldShowIntro } from './features/Auth/AuthSlice';
import { baseURL } from './utils/BaseUrl';
import { isTrue } from './utils/stringUtl';
import GameModeScreen from './features/Games/GameModeScreen';
import GameInstructionsScreen from './features/Games/GameInstructionsScreen';
import StartGameCountdownScreen from './features/Games/StartGameCountdownScreen';
import GameInProgressScreen from './features/Games/GameInProgressScreen';
import GameEndResultScreen from './features/Games/GameEndResultScreen';
import IntroSlide from './features/Auth/IntroSlide';
import LoginScreen from './features/Auth/LoginScreen';
import SignupScreen from './features/Auth/SignupScreen';
import SignupProfileScreen from './features/Auth/SignupProfileScreen';
import ForgotPasswordScreen from './features/Auth/ForgotPasswordScreen';
import VerifyEmailScreen from './features/Auth/VerifyEmailScreen';
import ResetPasswordScreen from './features/Auth/ResetPasswordScreen';
import ResetPasswordSuccessScreen from './features/Auth/ResetPasswordSuccessScreen';
import GameBoostPurchaseSuccessfulScreen from './features/Store/GameBoostPurchaseSuccessfulScreen';
import GamePlanPurchaseSuccessfulScreen from './features/Store/GamePlanPurchaseSuccessfulScreen';
import GameStoreScreen from './features/Store/GameStoreScreen';

const AppStack = createNativeStackNavigator();

function AppRouter() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.auth.token);
    const showIntro = useSelector(state => state.auth.showIntro);

    booststrapAxios(token); //sets basic api call params

    //during app restart, check localstorage for these info
    useEffect(() => {
        const _1 = dispatch(isLoggedIn());
        const _2 = dispatch(shouldShowIntro());

        Promise.all([_1, _2]).then(values => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <PageLoading />
    }

    if (showIntro) {
        return <IntroSlide />;
    }

    return (
        <AppStack.Navigator>
            {isTrue(token) ?
                (
                    <>
                        <AppStack.Screen options={{ headerShown: false }} name="AppRouter" component={HomeRouter} />

                        <AppStack.Screen name="Leaderboard" component={ExtendedLeaderboard} options={{ title: 'Extended Leaderboard' }} />

                        {/** game **/}
                        <AppStack.Screen name="GameMode" component={GameModeScreen} options={{ title: 'Game Mode' }} />
                        <AppStack.Screen name="GameInstructions" component={GameInstructionsScreen} options={{ title: 'Game Instructions' }} />
                        <AppStack.Screen name="StartGameCountdown" component={StartGameCountdownScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name="GameInProgress" component={GameInProgressScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name="GameEndResult" component={GameEndResultScreen} options={{ headerShown: false }} />

                        {/** wallet */}
                        <AppStack.Screen name="FundWallet" component={FundWalletScreen} options={{ title: 'Fund Wallet' }} />
                        <AppStack.Screen name="Transactions" component={TransactionScreen} options={{ title: 'Transactions' }} />
                        <AppStack.Screen name="FundWalletCompleted" component={FundWalletCompleted} options={{ headerShown: false }} />

                        {/** user profile **/}
                        <AppStack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
                        <AppStack.Screen name="EditDetails" component={EditProfileDetailsScreen} options={{ title: 'Edit Details' }} />
                        <AppStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
                        <AppStack.Screen name="UserStats" component={UserStatsScreen} options={{ title: 'Stats' }} />
                        <AppStack.Screen name="AchievementsMilestone" component={AchievementsMilestoneScreen} options={{ title: 'Milestones' }} />
                        <AppStack.Screen name="BankDetails" component={BankDetailsScreen} options={{ title: 'Bank Details' }} />

                        {/** store */}
                        <AppStack.Screen name="GameStore" component={GameStoreScreen} options={{ title: 'Store', headerShadowVisible: false }} />
                        <AppStack.Screen name="GameBoostPurchaseSuccessful" component={GameBoostPurchaseSuccessfulScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name="GamePlanPurchaseSuccessful" component={GamePlanPurchaseSuccessfulScreen} options={{ headerShown: false }} />

                        <AppStack.Screen name="Invite" component={InviteFriendsScreen} options={{ title: 'Invite Friends' }} />
                    </>
                ) :
                (

                    <AppStack.Group screenOptions={{ title: "", headerShadowVisible: false }}>
                        {/** unauthenticated **/}
                        <AppStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                        <AppStack.Screen name="SignupScreen" component={SignupScreen} />
                        <AppStack.Screen name="SignupProfile" component={SignupProfileScreen} />
                        <AppStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <AppStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
                        <AppStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                        <AppStack.Screen name="ResetPasswordSuccess" component={ResetPasswordSuccessScreen} />
                    </AppStack.Group >
                )
            }

            {/** general */}
            <AppStack.Screen name="Terms" component={TermsAndConditionsScreen} options={{ title: 'Terms & Conditions' }} />
            <AppStack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
            <AppStack.Screen name="Support" component={SupportQuestionsScreen} options={{ title: 'Support' }} />
            <AppStack.Screen name="Answer" component={SupportAnswerScreen} options={{ title: 'Details' }} />

        </AppStack.Navigator >
    )

}


export default AppRouter;

const booststrapAxios = async function (token) {
    axios.defaults.baseURL = baseURL;
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        axios.defaults.headers.common['Authorization'] = null;
        /*if setting null does not remove `Authorization` header then try  */
        delete axios.defaults.headers.common['Authorization'];
    }
};
