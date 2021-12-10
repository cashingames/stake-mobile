import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeRouter from './features/Home/HomeRouter';
import AuthRouter from './features/Auth/AuthRouter';

import ExtendedLeaderboard from './features/Leaderboard/ExtendedLeaderboard';
import PageLoading from './shared/PageLoading';

import { isTrue } from './utils/stringUtl';
import { isLoggedIn } from './features/Auth/AuthSlice';
import FundWalletScreen from './features/Transactions/FundWalletScreen';
import FundWalletCompleted from './features/Transactions/FundWalletCompleted';
import TransactionScreen from './features/Transactions/TransactionScreen';
import GameBoosts from './features/Store/GameBoosts';


const AppStack = createNativeStackNavigator();

function AppRouter() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.auth.token);

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
            <AppStack.Screen name="Leaderboard" component={ExtendedLeaderboard} options={{ title: 'Extended Leaderboard' }} />
            <AppStack.Screen name="FundWallet" component={FundWalletScreen} options={{ title: 'Fund Wallet' }} />
            <AppStack.Screen name="Transactions" component={TransactionScreen} options={{ title: 'Transactions' }} />
            <AppStack.Screen name="GameBoosts" component={GameBoosts} options={{ title: 'Transactions' }} />
            <AppStack.Screen name="FundWalletCompleted" component={FundWalletCompleted} options={{ headerShown: false }} />

        </AppStack.Navigator>
    )

}


export default AppRouter;