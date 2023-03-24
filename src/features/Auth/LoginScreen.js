import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, ScrollView, Platform, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';

import SocialSignUp from '../../shared/SocialSignUp';
import normalize, { responsiveHeight, responsiveScreenWidth } from '../../utils/normalize';
import Input from '../../shared/Input';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppleSignUp from '../../shared/AppleSignUp';
import { loginUser } from './AuthSlice';
import Login from '../../shared/FacebookLogin';
import { triggerTour } from '../Tour/Index';
import { triggerNotifierForReferral } from '../../shared/Notification';
import { Image } from 'react-native';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GaButton from '../../shared/GaButton';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState(Constants.manifest.extra.isStaging ? 'arunajoy2602@gmail.com' : '');
    const [password, setPassword] = useState(Constants.manifest.extra.isStaging ? '12345678' : '');
    const [canLogin, setCanLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const onChangeEmail = (value) => {
        setEmail(value)
    }

    const onChangePassword = (value) => {
        setPassword(value)
    }
    const onLogin = async () => {
        crashlytics().log('login clicked');
        await analytics().logEvent('login_clicked')
        setLoading(true);
        setCanLogin(false);
        setError("");

        dispatch(loginUser({ email, password })).unwrap().then((response) => {
            console.info("login response 1", response);
            if (response?.isFirstTime || false) {
                triggerTour(navigation)
                triggerNotifierForReferral()
            }
        }).catch((err) => {
            processLoginError(err)
        }).finally(() => {
            setLoading(false);
            setCanLogin(true);
        });

    }

    const processLoginError = async (err) => {
        const errors = err.errors;

        if (err.message == 'Account not verified') {
            await analytics().logEvent("unverified_user", {
                'username': errors.username,
                'phone_number': errors.phone_number
            })
            navigation.navigate('SignupVerifyPhone', {
                phone_number: errors.phoneNumber,
                username: errors.username, next_resend_minutes: 1
            })
        }

        const firstError = Array.isArray(errors) ? Object.values(errors, {})[0][0] : errors;
        setError(firstError)
    }

    useEffect(() => {
        const valid = email.length > 1 && password.length > 7;
        setCanLogin(valid);
        setError('');
    }, [email, password]);


    return (
        <MixedContainerBackground>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={require('../../../assets/images/Ga-logo.png')} />
                </View>
                <View style={styles.inputSection}>
                     {error.length > 0 && 
                    <Text style={styles.errorBox}>{error}</Text>
                      }

                    <Input
                        label='Email/username'
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
                    <GaButton text={loading ? 'Signing in...' : 'Sign in'}
                        onPress={() => onLogin()}
                        disabled={!canLogin} />
                </View>
                <RenderCreateAccount navigation={navigation} />
            </View >
        </MixedContainerBackground>

    );
}

const RenderForgotPassword = () => {
    const navigation = useNavigation();
    return (
        <Text
            style={styles.forgotPassword}
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
            <View style={styles.google}>
                <Login text="Sign in" />
                {Platform.OS === 'ios' && <AppleSignUp />}
                <SocialSignUp googleText="Sign in" />
                <Pressable onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.singupLink}>Sign up with an Email</Text>
                </Pressable>
            </View>
            <View style={styles.terms}>
                <Pressable onPress={() => navigation.navigate('Privacy')}>
                    <Text style={styles.linkText}>Privacy Policy</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Terms')}>
                    <Text style={styles.linkText}>Terms & Conditions</Text>
                </Pressable>

            </View>
        </View>
    )
}

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
        paddingHorizontal: responsiveScreenWidth(3)
    },

    inputSection: {
        marginTop: normalize(120),
    },

    errorBox: {
        marginVertical: responsiveScreenWidth(3),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontSize: '0.7rem',
        fontFamily: 'blues-smile',
        color: "#fff"
    },
    forgotPassword: {
        color: '#F1D818',
        fontFamily: 'blues-smile',
        fontSize: '1rem'
    },

    signIn: {
        flexDirection: 'column',
        marginTop: responsiveScreenWidth(2),
        // marginTop: 10,
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
        alignItems: 'center',
        marginVertical: normalize(10)
    },
    logo: {
        alignItems: 'center',
        marginTop: normalize(45)
    },

    singupLink: {
        color: '#fff',
        fontSize: '1rem',
        fontFamily: 'graphik-regular'
    },
    terms: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    linkText: {
        fontSize: '0.8rem',
        color: '#fff',
        fontFamily: 'graphik-regular'
    }
});