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

export default function LoginScreen({ navigation }) {

    useEffect(() => {
        StatusBar.setHidden(true)
        // StatusBar.setNetworkActivityIndicatorVisible(false)
    }, []);

    return (

        <ImageBackground source={require('../../../assets/images/login-image.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={require('../../../assets/images/Ga-logo.png')} />
                </View>
                <ImageBackground source={require('../../../assets/images/trans-image.png')}
                    style={styles.secondBgImg}
                    resizeMethod="resize">
                    <RenderCreateAccount navigation={navigation} />
                </ImageBackground>
            </View >
        </ImageBackground>
    );
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
        // paddingHorizontal: responsiveScreenWidth(3),
        justifyContent: "space-between"
    },

    secondBgImg: {
        height: responsiveHeight(50)
    },

    signIn: {
        flexDirection: 'column',
        marginTop: responsiveScreenWidth(2),
        marginTop: 100,
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
        marginTop:20
    },
    linkText: {
        fontSize: '0.8rem',
        color: '#fff',
        fontFamily: 'graphik-regular'
    }
});