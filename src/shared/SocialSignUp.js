import React, { useState, useEffect, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button, Pressable, View, Image, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import RBSheet from "react-native-raw-bottom-sheet";
import { Text } from 'react-native';
import Input from './Input';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppButton from './AppButton';
import { saveToken } from '../utils/ApiHelper';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";
import normalize from '../utils/normalize';
import UniversalBottomSheet from './UniversalBottomSheet';
import { loginWithSocialLink, registerWithSocialLink } from '../features/Auth/AuthSlice';
import PageLoading from './PageLoading';
import FirstTimeUserDetails from './FirstTimeUserDetails';
import { triggerTour } from '../features/Tour/Index';



WebBrowser.maybeCompleteAuthSession();

export default function SocialSignUp({ googleText }) {
    const navigation = useNavigation();
    const refRBSheet = useRef();
    const dispatch = useDispatch();
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
        dispatch(registerWithSocialLink({
            email,
            firstName,
            lastName,
            phone_number,
            username,
            referrer
        })).then(unwrapResult)
            .then((originalPromiseResult) => {
                triggerTour(navigation)
                console.log(originalPromiseResult, 'hitting');
                saveToken(originalPromiseResult.data.token)
                closeBottomSheet()
                navigation.navigate('AppRouter')
                setSaving(false)
            })
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
        // expoClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        iosClientId: Constants.manifest.extra.googleIosClientId,
        androidClientId: Constants.manifest.extra.googleAndriodClientId,
        webClientId: '520726557605-ckaa4jojbac8mgpir7ta7cnngqmuodm0.apps.googleusercontent.com',
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
                            console.log(originalPromiseResult)
                            if (originalPromiseResult.data.isFirstTime) {
                                setEmail(originalPromiseResult.data.email)
                                setFirstName(originalPromiseResult.data.firstName)
                                setLastName(originalPromiseResult.data.lastName)
                                setloading(false)
                                openBottomSheet()
                                return
                            }

                            console.log(originalPromiseResult);
                            saveToken(originalPromiseResult.data.token)
                            setloading(false)
                            // navigation.navigate('AppRouter')
                        })
                        .catch((rejectedValueOrSerializedError) => {
                            // console.log(rejectedValueOrSerializedError)
                        })
                })
        }
    }, [response]);


    const GoogleButton = ({ loading, disabled, onPress, googleText }) => {
        return (
            <Pressable disabled={disabled} onPress={onPress} style={[styles.googleButton, disabled ? styles.disabled : {}]}>
                <Text style={styles.googletext}>{googleText} with Google</Text>
                <View style={styles.googleImage}>
                    <Image
                        style={styles.pointsIcon}
                        source={require('../../assets/images/google_icon.png')}
                    />
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
                />}
            />
        </>
    );
}


const styles = EStyleSheet.create({
    googleButton: {
        backgroundColor: '#4299f5',
        flexDirection: 'row',
        paddingVertical: Platform.OS === 'ios' ? normalize(9) : normalize(9),
        paddingHorizontal: normalize(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    inputBoxes: {
        marginTop: '2.5rem'
    },
    googleImage: {
        backgroundColor: '#FFFF',
        borderRadius: 100,
        padding: Platform.OS === 'ios' ? normalize(3) : normalize(5),
        marginLeft: normalize(5)
    },
    pointsIcon: {
        width: Platform.OS === 'ios' ? '.6rem' : '.65rem',
        height: Platform.OS === 'ios' ? '.6rem' : '.65rem',
    },
    googletext: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem'
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