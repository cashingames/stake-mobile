import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AppLoading from 'expo-app-loading';

import { logout } from './utils/ApiHelper';
import { isLoggedIn } from './features/Auth/AuthSlice';
import { isTrue } from './utils/stringUtl';

import DashboardScreen from './screens/DashboardScreen';
import AuthRouter from './features/Auth/AuthRouter';


const AppStack = createNativeStackNavigator();

function AppRouter() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.auth.token);

    //during app restart, check localstorage for these info
    useEffect(() => {
        dispatch(isLoggedIn()).then(values => {
            setLoading(false);
        })
    }, []);


    if (loading) {
        return <AppLoading />
    }


    // logout();

    if (!isTrue(token)) {
        return <AuthRouter />;
    }

    return (
        <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="DashboardScreen" component={DashboardScreen} />
        </AppStack.Navigator>
    );

}

export default AppRouter;