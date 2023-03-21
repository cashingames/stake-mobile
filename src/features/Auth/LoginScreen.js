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
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { StatusBar } from 'react-native';
import { Image } from 'react-native';
import AppButton from '../../shared/AppButton';

export default function LoginScreen({ navigation }) {
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


    useEffect(() => {
        const valid = email.length > 1 && password.length > 7;
        setCanLogin(valid);
        setError('');
    }, [email, password]);
    // useEffect(() => {
    //     StatusBar.setHidden(true)
    //     // StatusBar.setNetworkActivityIndicatorVisible(false)
    // }, []);

    return (
        <ImageBackground source={require('../../../assets/images/login-image.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
                 <ImageBackground source={require('../../../assets/images/trans-image.png')}
                    style={styles.secondBgImg}
                    resizeMethod="resize">
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={require('../../../assets/images/Ga-logo.png')} />
                </View>
                <View style={styles.inputSection}>
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
                    <AppButton text={loading ? 'Signing in...' : 'Sign in'}
                        //  onPress={() => onLogin()} 
                        style={styles.loginBtn}
                        textStyle={styles.loginBtnText}
                        disabled={!canLogin} />
                </View>
                    <RenderCreateAccount navigation={navigation} />
                    </View >
                </ImageBackground>
        </ImageBackground>
    );
}

const RenderForgotPassword = () => {
    const navigation = useNavigation();
    return (
        <Text
            style={styles.forgotPassword}
            // onPress={() => navigation.navigate('ForgotPassword')}
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
                    <Text style={styles.linkText}>Privacy</Text>
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
    },

    inputSection: {
        marginTop: normalize(40),
        paddingHorizontal: responsiveScreenWidth(3),
    },

    forgotPassword: {
        color: '#F1D818',
        fontFamily: 'blues-smile',
        fontSize: '1rem'
    },
    secondBgImg: {
        flex:1
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

    loginBtn: {
        backgroundColor: '#F1D818',
        borderBottomColor: '#B58201',
        borderBottomWidth: 4,
    },

    loginBtnText: {
        color:'#2D53A0',
        fontFamily:'blues-smile',
        fontSize:'1rem'
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