import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from "axios";

import PageLoading from './shared/PageLoading';
import HomeRouter from './features/Home/HomeRouter';
import AuthRouter from './features/Auth/AuthRouter';
import ExtendedLeaderboard from './features/Leaderboard/ExtendedLeaderboard';
import FundWalletScreen from './features/Transactions/FundWalletScreen';
import FundWalletCompleted from './features/Transactions/FundWalletCompleted';
import TransactionScreen from './features/Transactions/TransactionScreen';
import GameStoreRouter from './features/Store/GameStoreRouter';
import PurchaseSuccessfulScreen from './features/Store/PurchaseSuccessfulScreen';
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

import { isLoggedIn } from './features/Auth/AuthSlice';
import { baseURL } from './utils/BaseUrl';
import { isTrue } from './utils/stringUtl';
import GameModeScreen from './features/Games/GameModeScreen';
import GameInstructionsScreen from './features/Games/GameInstructionsScreen';
import StartGameCountdownScreen from './features/Games/StartGameCountdownScreen';
import GameInProgressScreen from './features/Games/GameInProgressScreen';

const AppStack = createNativeStackNavigator();

function AppRouter() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.auth.token);

    booststrapAxios(token); //sets basic api call params

    //during app restart, check localstorage for these info
    useEffect(() => {
        dispatch(isLoggedIn()).then(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <PageLoading />
    }


    if (!isTrue(token)) {
        return <AuthRouter />;
    }

    return (
        <AppStack.Navigator>

            <AppStack.Screen options={{ headerShown: false }} name="AppRouter" component={HomeRouter} />

            <AppStack.Group >
                <AppStack.Screen name="Leaderboard" component={ExtendedLeaderboard} options={{ title: 'Extended Leaderboard' }} />
                <AppStack.Screen name="FundWallet" component={FundWalletScreen} options={{ title: 'Fund Wallet' }} />
                <AppStack.Screen name="Transactions" component={TransactionScreen} options={{ title: 'Transactions' }} />

                <AppStack.Screen name="GameStore" component={GameStoreRouter} options={{ title: 'Store', headerShadowVisible: false }} />
                <AppStack.Screen name="Terms" component={TermsAndConditionsScreen} options={{ title: 'Terms & Conditions' }} />
                <AppStack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
                <AppStack.Screen name="Invite" component={InviteFriendsScreen} options={{ title: 'Invite Friends' }} />
                <AppStack.Screen name="FundWalletCompleted" component={FundWalletCompleted} options={{ headerShown: false }} />
                <AppStack.Screen name="PurchaseSuccessful" component={PurchaseSuccessfulScreen} options={{ headerShown: false }} />
                <AppStack.Screen name="Support" component={SupportQuestionsScreen} options={{ title: 'Support' }} />
                <AppStack.Screen name="Answer" component={SupportAnswerScreen} options={{ title: 'Details' }} />

                <AppStack.Group >
                    <AppStack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
                    <AppStack.Screen name="EditDetails" component={EditProfileDetailsScreen} options={{ title: 'Edit Details' }} />
                    <AppStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
                    <AppStack.Screen name="UserStats" component={UserStatsScreen} options={{ title: 'Stats' }} />
                    <AppStack.Screen name="AchievementsMilestone" component={AchievementsMilestoneScreen} options={{ title: 'Milestones' }} />
                    <AppStack.Screen name="BankDetails" component={BankDetailsScreen} options={{ title: 'Bank Details' }} />
                </AppStack.Group>

                <AppStack.Group >
                <AppStack.Screen name="GameMode" component={GameModeScreen} options={{ title: 'Game Mode' }} />
                <AppStack.Screen name="GameInstructions" component={GameInstructionsScreen} options={{ title: 'Game Instructions' }} />
                <AppStack.Screen name="StartGameCountdown" component={StartGameCountdownScreen} options={{ title: '' }} />
                <AppStack.Screen name="GameInProgress" component={GameInProgressScreen} options={{ headerShown: false }} />
                </AppStack.Group>

            </AppStack.Group>


        </AppStack.Navigator>
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
