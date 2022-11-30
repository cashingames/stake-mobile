import React, { useEffect, useRef, useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { loginWithSocialLink, registerWithSocialLink } from '../features/Auth/AuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { saveToken } from '../utils/ApiHelper';
import { unwrapResult } from '@reduxjs/toolkit';
import UniversalBottomSheet from './UniversalBottomSheet';
import FirstTimeUserDetails from './FirstTimeUserDetails';

const AppleSignUp = () => {
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

    useEffect(() => {
        const invalid = usernameErr || username === '' ||
            phone_number === '' || phoneNumberErr
        setCanSave(!invalid);
    }, [usernameErr, username, phone_number, phoneNumberErr])

    const registerUserWithApple = () => {
        setSaving(true);
        dispatch(registerWithSocialLink({
            email,
            firstName,
            lastName,
            phone_number,
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

    const loginWithApple = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            console.log(credential, 'this is the credentials')

            dispatch(loginWithSocialLink({
                firstName: credential.fullName.givenName,
                lastName: credential.fullName.familyName,
                email: credential.email
            })).then(unwrapResult)

                .then((originalPromiseResult) => {

                    if (originalPromiseResult.data.isFirstTime) {
                        setEmail(originalPromiseResult.data.email)
                        setFirstName(originalPromiseResult.data.firstName)
                        setLastName(originalPromiseResult.data.lastName)
                        openBottomSheet()
                        return
                    }
                    console.log(originalPromiseResult);
                    saveToken(originalPromiseResult.data.token)
                    navigation.navigate('AppRouter')
                })
            // signed in
        } catch (e) {
            if (e.code === 'ERR_CANCELED') {
                // handle that the user canceled the sign-in flow
            } else {
                // handle other errors
            }
        }
    }
    return (
        <>
            <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={5}
                style={{ width: 200, height: 40, marginTop: 20 }}
                onPress={loginWithApple}
            />
            <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={570}
                subComponent={<FirstTimeUserDetails
                    onPress={registerUserWithApple}
                    phoneNumber={phone_number}
                    username={username}
                    referrer={referrer}
                    phoneNumberErr={phoneNumberErr}
                    onChangePhoneNumber={onChangePhoneNumber}
                    onChangeUserName={onChangeUserName}
                    usernameErr={usernameErr} onChangReferrer={onChangReferrer}
                    canSave={canSave}
                    saving={saving}
                    onClose={closeBottomSheet}
                />}
            />
        </>
    );
}
export default AppleSignUp;