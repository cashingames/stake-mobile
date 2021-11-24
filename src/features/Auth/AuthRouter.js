import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./LoginScreen";
import IntroSlide from './IntroSlide';

import { shouldShowIntro } from './AuthSlice';

const AuthStack = createNativeStackNavigator();

const AuthRouter = () => {
    const dispatch = useDispatch();
    const showIntro = useSelector(state => state.auth.showIntro);

    useEffect(() => {
        dispatch(shouldShowIntro());
    }, []);


    if (showIntro) {
        return <IntroSlide />;
    }

    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
        </AuthStack.Navigator>
    );
}

export default AuthRouter