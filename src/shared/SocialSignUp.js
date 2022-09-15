import React, { useState, useEffect, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button, Pressable, View, Image } from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginWithGoogle, registerWithGoogle } from '../features/Auth/AuthSlice';
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



WebBrowser.maybeCompleteAuthSession();

export default function SocialSignUp({googleText}) {
    const navigation = useNavigation();
    const refRBSheet = useRef();
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    const [phoneNumberErr, setPhoneNumberError] = useState(false);
    const [usernameErr, setUsernameError] = useState(false);
    const [passErr, setPassError] = useState(false);
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(false);

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

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }

    const onChangeConfirmPassword = (text) => {
        setPasswordConfirmation(text)
    }

    const onChangReferrer = (text) => {
        setReferrer(text)
    }

    const registerUserWithGoogle = () => {
        setSaving(true);
        dispatch(registerWithGoogle({
            email,
            firstName,
            lastName,
            phoneNumber,
            username,
            password,
            password_confirmation,
            referrer
        })).then(unwrapResult)
            .then((originalPromiseResult) => {
                // console.log(originalPromiseResult);
                saveToken(originalPromiseResult.data.token)
                navigation.navigate('AppRouter')
            })
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
        // expoClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        androidClientId: Constants.manifest.extra.googleClientId,
        webClientId: '520726557605-ckaa4jojbac8mgpir7ta7cnngqmuodm0.apps.googleusercontent.com',
    });


    useEffect(() => {
        const invalid = usernameErr || username === '' || passErr || password === '' ||
            phoneNumber === '' || phoneNumberErr || password_confirmation !== password;
        setCanSave(!invalid);
    }, [usernameErr, username, passErr, password, phoneNumber, phoneNumberErr, password_confirmation])

    useEffect(() => {
        if (response?.type === 'success') {
            const accessToken = response.authentication.accessToken
            // console.log(accessToken)
            axios.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + accessToken)
                .then(function (response) {
                    const userDetails = response.data
                    // console.log('user details', userDetails)
                    dispatch(loginWithGoogle({
                        firstName: userDetails.given_name,
                        lastName: userDetails.family_name,
                        email: userDetails.email
                    })).then(unwrapResult)
                        .then((originalPromiseResult) => {
                            if (originalPromiseResult.data.isFirstTime) {
                                setEmail(originalPromiseResult.data.email)
                                setFirstName(originalPromiseResult.data.firstName)
                                setLastName(originalPromiseResult.data.lastName)
                                openBottomSheet()
                                return
                            }
                            // console.log(originalPromiseResult);
                            saveToken(originalPromiseResult.data.token)
                            navigation.navigate('AppRouter')
                        })
                        .catch((rejectedValueOrSerializedError) => {
                            // console.log(rejectedValueOrSerializedError)
                        })
                })
        }
    }, [response]);

    return (
        <>
            <Pressable disabled={!request} onPress={() => {
                promptAsync();
            }} style={styles.googleButton}>
                <Text style={styles.googletext}>GOOGLE {googleText}</Text>
                <View style={styles.googleImage}>
                    <Image
                        style={styles.pointsIcon}
                        source={require('../../assets/images/google_icon.png')}
                    />
                </View>
            </Pressable>
            <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={570}
                subComponent={<FirstTimeUserDetails
                    onPress={registerUserWithGoogle}
                    password={password}
                    password_confirmation={password_confirmation}
                    phoneNumber={phoneNumber}
                    username={username} passErr={passErr}
                    referrer={referrer}
                    phoneNumberErr={phoneNumberErr}
                    onChangePhoneNumber={onChangePhoneNumber}
                    onChangeUserName={onChangeUserName}
                    onChangePassword={onChangePassword}
                    usernameErr={usernameErr} onChangReferrer={onChangReferrer}
                    onChangeConfirmPassword={onChangeConfirmPassword}
                    canSave={canSave}
                    saving={saving}
                    onClose={closeBottomSheet}
                />}
            />
        </>
    );
}
const FirstTimeUserDetails = ({ onPress,
    password,
    password_confirmation,
    phoneNumber,
    username,
    referrer,
    phoneNumberErr, onChangePhoneNumber,
    passErr, onChangeConfirmPassword,
    onChangeUserName, usernameErr,
    onChangePassword, onChangReferrer,
    canSave, saving
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Please input your details</Text>

            <Input
                label='Username'
                placeholder="John"
                value={username}
                error={usernameErr && '*username must not be empty'}
                onChangeText={text => onChangeUserName(text)}
            />

            <Input
                label='Phone Number'
                placeholder="080xxxxxxxx"
                value={phoneNumber}
                onChangeText={text => { onChangePhoneNumber(text) }}
                error={phoneNumberErr && '*input a valid phone number'}
                keyboardType="numeric"
            />

            <Input
                type="password"
                label='Password'
                value={password}
                placeholder="Enter password"
                error={passErr && '*password must not be less than 8 digits'}
                onChangeText={text => { onChangePassword(text) }}
            />

            <Input
                type="password"
                label='Password'
                value={password_confirmation}
                placeholder="Confirm password"
                error={password_confirmation !== password && '*password confirmation must match password'}
                onChangeText={text => { onChangeConfirmPassword(text) }}
            />
            <Input
                label='Referral'
                value={referrer}
                placeholder="Input referral code(optional)"
                onChangeText={text => { onChangReferrer(text) }}

            />

            <AppButton onPress={onPress}
                text={saving ? 'Saving' : 'Proceed'}
                disabled={!canSave}
            />
        </View>
    )
}
const styles = EStyleSheet.create({
    googleButton: {
        backgroundColor: '#4299f5',
        flexDirection: 'row',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(11),
        alignItems: 'center',
        borderRadius: 10,
    },
    googleImage: {
        backgroundColor: '#FFFF',
        borderRadius: 100,
        padding: normalize(7),
        marginLeft: normalize(5)
    },
    googletext: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem'
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
    }
})