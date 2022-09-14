import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';

import SocialSignUp from '../../shared/SocialSignUp';
import AuthBanner from '../../shared/AuthBanner';
import AuthTitle from '../../shared/AuthTitle';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { loginUser, setToken } from './AuthSlice';
import Input from '../../shared/Input';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import EStyleSheet from 'react-native-extended-stylesheet';
import { saveToken } from '../../utils/ApiHelper';
import InputOTP from '../../shared/InputOTP';

export default function LoginScreen({ navigation }) {

    const dispatch = useDispatch();

    const [email, setEmail] = useState(Constants.manifest.extra.isStaging ? 'arunajoy2602@gmail.com' : '');
    const [password, setPassword] = useState(Constants.manifest.extra.isStaging ? '12345678' : '');
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

        loginUser({
            email, password
        }).then(response => {
            saveToken(response.data.data)
            dispatch(setToken(response.data.data))
            navigation.navigate('AppRouter')

        }, err => {
            if (!err || !err.response || err.response === undefined) {
                setError("Your Network is Offline.");
            }
            else if (err.response.status === 500) {
                setError("Service not currently available. Please contact support");
            }
            else {

                const errors =
                    err.response && err.response.data && err.response.data.errors;
                // console.log(errors)

                const firstError = Array.isArray(errors) ? Object.values(errors, {})[0][0] : errors;
                setError(firstError)
            }
            setLoading(false);
        });
    }


    useEffect(() => {
        var valid = email.length > 1 && password.length > 7;
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
        <View style={styles.signIn}>
            <View style={styles.create}>
                <Text style={styles.signInText}>Don't have an account ?</Text>
                <Pressable onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.linkText}> Create one</Text>
                </Pressable>
            </View>
            <Text style={styles.signInText}>or</Text>
            <View style={styles.google}>
                <SocialSignUp />
            </View>
        </View>
    )
}

const VerifyOTP = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const goToDashboard = () => {
        setLoading(true);
        dispatch(verifyUser({ email: params.email }))
            .then(unwrapResult)
            .then(response => {
                // console.log("email verification response", response);
                saveToken(response.data)
                setLoading(false);
                navigation.navigate('AppRouter')
            })
            .catch((rejectedValueOrSerializedError) => {

                Alert.alert("Failed to log in");
                setLoading(false);
            })
    }

    return (
        <View style={styles.verifyPhoneOtp}>
            <Text style={styles.verifySubText}>
                A One Time Password(OTP) has been sent to your registered phone number.
                Please input the five(5) digit
                number below to verify your phone number so you
                can play exicting games and stand a chance to win lots of prizes
            </Text>
            <InputOTP />
            <AppButton text={loading ? 'Verifying...' : 'Login'} disabled={loading} onPress={goToDashboard} />
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
        // marginLeft: normalize(15),
        fontSize: '0.87rem'
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signIn: {
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: responsiveScreenWidth(2)
    },
    create: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: normalize(5)
    },
    signInText: {
        color: '#00000080',
        fontFamily: 'graphik-medium',
        fontSize: '0.87rem'
    },
    google: {
        marginVertical: normalize(10)
    },
    verifySubText: {
        fontSize: '.9rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        lineHeight: '1.5rem',
        opacity: 0.6,
        marginTop: normalize(25)
    },
    verifyPhoneOtp: {
        paddingHorizontal: normalize(20)
    }
});
