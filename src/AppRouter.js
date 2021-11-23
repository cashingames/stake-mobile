import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IntroSlide from './screens/IntroSlide';
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsAndConditions from './screens/TermsAndConditions';
import SignInScreen from './screens/Auth/SignInScreen';
import SignUpScreen from './screens/Auth/SignUpScreen';
import ForgotPassword from './screens/Auth/ForgotPassword';

const Stack = createNativeStackNavigator();

function AppRouter() {
    const [isFirst, setIsFirst] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('isFirst')
            .then(result => {
                setIsFirst(result);
            });
    }, []);

     console.log("About to render " + isFirst);

    if (isFirst === true || isFirst === null || isFirst === undefined) {
        console.log("Rendering intro slides" + isFirst);

        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="IntroSlide" component={IntroSlide} />
            </Stack.Navigator>
        );
    }

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

export default AppRouter;