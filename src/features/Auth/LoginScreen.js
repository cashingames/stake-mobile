import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';

import AuthBanner from '../../shared/AuthBanner';
import AuthTitle from '../../shared/AuthTitle';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import Input from '../../shared/Input';
import crashlytics from '@react-native-firebase/crashlytics';
import EStyleSheet from 'react-native-extended-stylesheet';
import { loginUser } from './AuthSlice';
import { triggerNotifierForReferral } from '../../shared/Notification';
// import Login from '../../shared/FacebookLogin';
import logToAnalytics from '../../utils/analytics';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState(Constants.expoConfig.extra.isStaging ? 'gorotaZee' : '');
    const [password, setPassword] = useState(Constants.expoConfig.extra.isStaging ? '12345678' : '');
    const [canLogin, setCanLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const onChangeEmail = (value) => {
        setEmail(value)
    }

    const onChangePassword = (value) => {
        setPassword(value)
    }

    const onLogin = () => {
        crashlytics().log('login clicked');
        logToAnalytics('login_clicked')
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

    const processLoginError = (err) => {
        const errors = err.errors;

        if (err.message == 'Account not verified') {
            logToAnalytics("unverified_user", {
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

    const contactUs = () => {
        logToAnalytics("clicked_contact_us_from_login")
        navigation.navigate('AuthContact')
    }


    useEffect(() => {
        const valid = email.length > 1 && password.length > 7;
        setCanLogin(valid);
        setError('');
    }, [email, password]);


    return (
        <>
            <ScrollView style={styles.container}>

                <View style={styles.headerBox}>
                    <AuthTitle text='Login to your account' />
                </View>

                <View style={styles.inputContainer} >
                    {error.length > 0 &&
                        <Text style={styles.errorBox}>{error}</Text>
                    }

                    <Input
                        label=' Enter email or username'
                        placeholder="e.g john or john@example.com"
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
                <View style={styles.buttonsContainer}>
                    <AppButton text={loading ? 'Signing in...' : 'Log me in'} onPress={() => onLogin()}
                        disabled={!canLogin} style={styles.loginButton} textStyle={styles.buttonText} isIcon={true} iconColor="#FFF"
                        disabledStyle={styles.disabled} />
                    <Text style={styles.orText}>Or</Text>
                    <RenderCreateAccount />
                </View>
                <Text style={styles.contactUs} onPress={contactUs}>You need help? Contact us</Text>
            </ScrollView >
        </>
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
        // <Pressable onPress={() => navigation.navigate('Signup')}>
        //     <Text style={styles.linkText}> Create one</Text>
        // </Pressable>
        <AppButton text='Create Account' onPress={() => navigation.navigate('Signup')}
            style={styles.signupButton} textStyle={styles.signupText} isIcon={true} iconColor="#072169" />
    )
}

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingHorizontal: responsiveScreenWidth(5),
    },
    headerBox: {
        marginTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(15),
    },
    inputContainer: {
        marginTop: responsiveScreenWidth(20),
    },

    errorBox: {
        marginVertical: responsiveScreenWidth(5),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'gotham-light',
        color: '#EF2F55',
        fontSize: '0.7rem'
    },
    textRight: {
        textAlign: "right"
    },
    linkText: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        // marginLeft: normalize(15),
        fontSize: '0.95rem'
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
    buttonsContainer: {
        marginTop: '2rem'
    },
    loginButton: {
        // backgroundColor: '#E15220',
        marginVertical: 20,
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    orText: {
        fontFamily: 'sansation-bold',
        fontSize: '1.1rem',
        color: '#072169',
        textAlign: 'center'
    },
    signupButton: {
        backgroundColor: '#F9FBFF',
        marginVertical: 20,
        paddingVertical: normalize(19),
        borderWidth: 2,
        borderColor: '#072169'
    },
    signupText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        color: '#072169'
    },
    google: {
        alignItems: 'center',
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
    },
    contactUs: {
        fontSize: '.7rem',
        fontFamily: 'graphik-medium',
        color: '#E15220',
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '1.2rem'

    },
    disabled: {
        backgroundColor: '#EA8663'
    }
});