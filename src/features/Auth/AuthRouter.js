import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import ForgotPasswordScreen from './ForgotPasswordScreen';

import IntroSlide from './IntroSlide';
import { shouldShowIntro } from './AuthSlice';
<<<<<<< HEAD
import SignUpScreen from './SignUpScreen';
import SignUpDetails from './SignUpDetails';
=======
import VerifyEmailScreen from './VerifyEmailScreen';
>>>>>>> main

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

        <AuthStack.Navigator screenOptions={{ title: "" }} >
            <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <AuthStack.Screen name="SignupScreen" component={SignUpScreen} />
            <AuthStack.Screen name="Signupdetails" component={SignUpDetails}  initialParams={{email:'', password:'', password_confirmation:'', phone:'' }} />
        </AuthStack.Navigator>
    );
}

export default AuthRouter