import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import SocialSigninDivider from '../../shared/SocialSigninDivider';
import SocialSignUp from '../../shared/SocialSignUp';
import AuthBanner from '../../shared/AuthBanner';
import AuthTitle from '../../shared/AuthTitle';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import { loginUser } from './AuthSlice';
import Input from '../../shared/Input';
import { isStaging } from '../../utils/BaseUrl';

export default function LoginScreen({ navigation }) {

    const dispatch = useDispatch();

    const [email, setEmail] = useState(isStaging ? 'arunajoy2602@gmail.com' : '');
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

    const onLogin = () => {
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
        <SafeAreaView style={{ flex: 1 }}>
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

                <AppButton text={loading ? 'Signing in...' : 'Sign in'} onPress={onLogin} disabled={!canLogin} />
                <SocialSigninDivider signInText='sign in' />
                <SocialSignUp action={() => navigation.navigate('SignIn')} />
                <RenderCreateAccount />
            </ScrollView >
        </SafeAreaView>
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
        <View style={styles.signIn}><Text style={styles.signInText}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} >
                <Text style={styles.linkText}>Create one</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: normalize(20),

    },
    headerBox: {
        marginTop: normalize(120),
    },
    inputContainer: {
        marginTop: normalize(25),
    },

    errorBox: {
        marginVertical: normalize(20),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    input: {
        height: normalize(38),
        marginBottom: normalize(15),
        borderWidth: normalize(1),
        borderRadius: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#00000080'

    },
    textRight: {
        textAlign: "right"
    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8)
    },

    linkText: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(15)
    },
    errorMsg: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        textAlign: 'center',
        marginTop: normalize(15),
        fontSize: normalize(10)
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    hr: {
        borderBottomColor: '#CDD4DF',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(41),
        marginBottom: normalize(5)
    },
    signUpOption: {
        color: 'rgba(0, 0, 0, 0.5)',
        marginTop: normalize(15),
        marginHorizontal: normalize(25),
        fontFamily: 'graphik-medium'
    },
    signIn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: normalize(25)
    },
    signInText: {
        color: '#00000080',
        fontFamily: 'graphik-medium',
        marginBottom: normalize(40)
    },
});
