import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import SocialSigninDivider from '../../shared/SocialSigninDivider';
import SocialSignUp from '../../shared/SocialSignUp';
import AuthBanner from '../../shared/AuthBanner';
import AuthTitle from '../../shared/AuthTitle';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { loginUser } from './AuthSlice';
import Input from '../../shared/Input';
import { isStaging } from '../../utils/BaseUrl';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function LoginScreen({ navigation }) {

    const dispatch = useDispatch();

    const [email, setEmail] = useState(isStaging ? 'arunajoy2602@gmail.com' : '' );
    const [password, setPassword] = useState(isStaging ? '12345678' : '');
    const [canLogin, setCanLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onChangeEmail = (value) => {
        setEmail(value)
    }

    const onChangePassword = (value) => {
        setPassword(value)
    }

    const onLogin = async () => {
        crashlytics().log('User signed in.');
        await analytics().logEvent('LoginClicked')
        setLoading(true);
        setCanLogin(false);
        setError("");

        dispatch(loginUser({ email, password })).then(unwrapResult)
            .then((originalPromiseResult) => {
                // after login eager get commond data for the whole app
                console.log("loggedin");
            })
            .catch((rejectedValueOrSerializedError) => {
                setLoading(false);
                setCanLogin(true);
                console.log(rejectedValueOrSerializedError)
                setError("Invalid username or password provided");
            })
    }

    useEffect(() => {
        var valid = email.length > 5 && password.length > 7;
        setCanLogin(valid);
        setError('');
    }, [email, password]);


    return (
        <ScrollView style={styles.container}>

            <AuthBanner />

            <View style={styles.headerBox}>
                <AuthTitle text='Sign in' />
            </View>

            <View style={styles.inputContainer} >
                {error.length > 0 &&
                    <Text style={styles.errorBox}>{error}</Text>
                }

                <Input
                    label='Email or username'
                    placeholder="johndoe or johndoe@example.com"
                    value={email}
                    onChangeText={text => onChangeEmail(text)}
                />

                <Input
                    type="password"
                    label='Password'
                    value={password}
                    placeholder="Enter password"
                    onChangeText={text => { onChangePassword(text) }}
                />

                <RenderForgotPassword />

            </View>

            <AppButton text={loading ? 'Signing in...' : 'Sign in'} onPress={() => onLogin()} disabled={!canLogin} />
            {/* <SocialSigninDivider signInText='sign in' /> */}
            {/* <SocialSignUp /> */}
            <RenderCreateAccount />
        </ScrollView >
    );
}

const RenderForgotPassword = () => {
    const navigation = useNavigation();
    return (
        <Text
            style={[styles.linkText, styles.textRight]}
            onPress={() => navigation.navigate('ForgotPassword')}
        >
            Forgot Password?
        </Text>
    )
}

const RenderCreateAccount = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.signIn}><Text style={styles.signInText}>Don't have an account ?</Text>
            <Pressable onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkText}>Create one</Text>
            </Pressable>
        </View>
    )
}


const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: responsiveScreenWidth(3),

    },
    headerBox: {
        marginTop: responsiveScreenWidth(30),
    },
    inputContainer: {
        marginTop: responsiveScreenWidth(10),
    },

    errorBox: {
        marginVertical: responsiveScreenWidth(5),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: '0.7rem'
    },
    textRight: {
        textAlign: "right"
    },
    linkText: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(15),
        fontSize: '0.87rem'
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signIn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: responsiveScreenWidth(5)
    },
    signInText: {
        color: '#00000080',
        fontFamily: 'graphik-medium',
        marginBottom: responsiveScreenWidth(15),
        fontSize: '0.87rem'
    },
});
