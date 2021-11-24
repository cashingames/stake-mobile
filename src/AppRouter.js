import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroSlide from './screens/IntroSlide';
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsAndConditions from './screens/TermsAndConditions';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import ForgotPassword from './screens/Auth/ForgotPassword';
import AppLoading from 'expo-app-loading';
import { logout } from './utils/ApiHelper';
import DashboardScreen from './screens/DashboardScreen';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn, shouldShowIntro } from './features/auth/authSlice';
import { isTrue } from './utils/stringUtl';

const Stack = createNativeStackNavigator();

function AppRouter() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.auth.token);
    const showIntro = useSelector(state => state.auth.showIntro);

    //during app restart, check localstorage for these info
    useEffect(() => {
        var i = dispatch(isLoggedIn());
        var j = dispatch(shouldShowIntro());
        Promise.all([i, j]).then(values => {
            console.log(values);
            setLoading(false);
        })
    }, []);


    if (loading) {
        console.log("Loading");
        return <AppLoading />
    }

    if (showIntro) {
        console.log("Intro slide");
        return <IntroSlide />;
    }

    console.log("Rendering application");
    // logout();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isTrue(token) ?
                <>
                    <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
                </>
                :
                <>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                </>
            }
            <>
                <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            </>
        </Stack.Navigator>
    );

}

export default AppRouter;