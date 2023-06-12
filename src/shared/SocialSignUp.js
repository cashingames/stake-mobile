import React, { useState, useEffect, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button, Pressable, View, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import RBSheet from "react-native-raw-bottom-sheet";
import { Text } from 'react-native';
import Input from './Input';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppButton from './AppButton';
import { saveToken } from '../utils/ApiHelper';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import UniversalBottomSheet from './UniversalBottomSheet';
import { googleSignUp, loginWithSocialLink, setToken } from '../features/Auth/AuthSlice';
import analytics from '@react-native-firebase/analytics';
import PageLoading from './PageLoading';
import FirstTimeUserDetails from './FirstTimeUserDetails';
import { triggerTour } from '../features/Tour/Index';
import { triggerNotifierForReferral } from './Notification';
import logToAnalytics from '../utils/analytics';



WebBrowser.maybeCompleteAuthSession();

export default function SocialSignUp({ googleText }) {
    const navigation = useNavigation();
    const refRBSheet = useRef();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const [phone_number, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    const [phoneNumberErr, setPhoneNumberError] = useState(false);
    const [usernameErr, setUsernameError] = useState(false);
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [loading, setloading] = useState(false)
    const [socialSignUp, setSocialSignup] = useState(true)

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }



    const onChangePhoneNumber = (text) => {
        text.length > 0 && text.length < 11 ? setPhoneNumberError(true) : setPhoneNumberError(false);
        setPhoneNumber(text)
    }

    const onChangeUserName = (text) => {
        text.length > 0 && text.length < 5 ? setUsernameError(true) : setUsernameError(false);
        setUsername(text)
    }

    const onChangReferrer = (text) => {
        setReferrer(text)
    }

    const registerUserWithGoogle = () => {
        console.log('here')
        setSaving(true);
        googleSignUp({
            email,
            firstName,
            lastName,
            phone_number,
            username,
            referrer
        }).then((response) => {
                triggerTour(navigation)
                triggerNotifierForReferral()
                saveToken(response.data.data)
                dispatch(setToken(response.data.data))
                closeBottomSheet()
                navigation.navigate('AppRouter')
                setSaving(false)
            })
            .catch((error) => {
                const errors = error.response && error.response.data && error.response.data.errors;
                const firstError = Object.values(errors)[0][0]
                Alert.alert(firstError)
                setReferrer('')
                setUsername('')
                setPhoneNumber('')
                setSaving(false)
                closeBottomSheet()
            })
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
        // expoClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        iosClientId: Constants.manifest.extra.googleIosClientId,
        androidClientId: Constants.manifest.extra.googleAndriodClientId,
        webClientId: '300193059462-847psqhn8f19ph76p7s0t1gus8gtm5lo.apps.googleusercontent.com',
    });



    useEffect(() => {
        const invalid = usernameErr || username === '' ||
            phone_number === '' || phoneNumberErr;
        setCanSave(!invalid);
    }, [usernameErr, username, phone_number, phoneNumberErr])

    useEffect(() => {
        if (response?.type === 'success') {
            const accessToken = response.authentication.accessToken
            console.log(accessToken)
            axios.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + accessToken)
                .then(function (response) {
                    const userDetails = response.data
                    setloading(true)
                    // console.log('user details', userDetails)
                    dispatch(loginWithSocialLink({
                        firstName: userDetails.given_name,
                        lastName: userDetails.family_name,
                        email: userDetails.email
                    })).then(unwrapResult)
                        .then((originalPromiseResult) => {
                            console.log(originalPromiseResult, "originalPromiseResul")
                            saveToken(originalPromiseResult.data.token)
                            logToAnalytics('signin_with_Google', {
                                'id': userDetails.given_name,
                                'email': userDetails.email,
                                'username': user.username
                            })
                            setloading(false)
                            navigation.navigate('Dashboard', { socialSignUp: true })
                        })
                        .catch((error)=> {
                            Alert.alert('Network error. Please, try again later.')
                            setloading(false)
                        })
                })
        }
    }, [response]);


    const GoogleButton = ({ loading, disabled, onPress, googleText }) => {
        return (
            <Pressable disabled={disabled} onPress={onPress} style={[styles.googleButton, disabled ? styles.disabled : {}]}>
                 <Image
                        style={styles.pointsIcon}
                        source={require('../../assets/images/google.png')}
                        resizeMode="cover"
                    />
                <Text style={styles.googletext}>{googleText} with Google</Text>
                <View style={styles.googleImage}>
                </View>
                {loading && <ActivityIndicator size="small" color='#ffff' />}
            </Pressable>
        )
    }


    return (
        <>
            <GoogleButton disabled={!request || loading} onPress={() => {
                promptAsync();
            }} loading={loading} googleText={googleText} />
            <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={560}
                subComponent={<FirstTimeUserDetails
                    onPress={registerUserWithGoogle}
                    phoneNumber={phone_number}
                    username={username}
                    referrer={referrer}
                    phoneNumberErr={phoneNumberErr}
                    onChangePhoneNumber={onChangePhoneNumber}
                    onChangeUserName={onChangeUserName}
                    usernameErr={usernameErr}
                    onChangReferrer={onChangReferrer}
                    canSave={canSave}
                    saving={saving}
                    setUsernameError={setUsernameError}
                />}
            />
        </>
    );
}


const styles = EStyleSheet.create({
    googleButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width: responsiveScreenWidth(70),
        height: normalize(38),
        marginVertical: '0.5rem'

    },
    inputBoxes: {
        marginTop: '2.5rem'
    },
    googleImage: {
        // backgroundColor: '#FFFF',
        // borderRadius: 100,
        padding: Platform.OS === 'ios' ? normalize(3) : normalize(5),
        marginRight: normalize(5)
    },
    pointsIcon: {
        width: 17,
        height: 17,
        marginTop:3
    },
    googletext: {
        color: '#000',
        fontFamily: 'graphik-regular',
        fontSize: '1rem',
        marginLeft: normalize(5)

    },
    inputContainer: {
        paddingHorizontal: normalize(18)
    },
    inputText: {
        color: '#000000',
        fontFamily: 'graphik-medium',
        fontSize: '0.8rem',
        textAlign: 'center',
        paddingVertical: normalize(5)
    },
    disabled: {
        opacity: 0.6
    }
})