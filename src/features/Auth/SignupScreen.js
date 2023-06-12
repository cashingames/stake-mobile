import React, { useState, useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, Link } from '@react-navigation/native';
import Input from '../../shared/Input';
import { CheckBox } from 'react-native-elements'
import AuthTitle from '../../shared/AuthTitle';
import { useDispatch } from 'react-redux';
import { registerUser, registerUserThunk, saveCreatedUserCredentials, setToken } from './AuthSlice';
import EStyleSheet from 'react-native-extended-stylesheet';
import analytics from '@react-native-firebase/analytics';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GaButton from '../../shared/GaButton';
import { unwrapResult } from '@reduxjs/toolkit';
import logToAnalytics from '../../utils/analytics';



const SignupScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    const [password, setPassword] = useState('');
    const [canSend, setCanSend] = useState(true);
    const [passErr, setPassError] = useState(false);
    const [uNameErr, setUnameErr] = useState(false)
    const [emailErr, setEmailError] = useState(false);
    const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');


    const onChangeEmail = (text) => {
        const rule = /^\S+@\S+\.\S+$/;
        setEmailError(!rule.test(text))
        setEmail(text)
    }

    const onChangeUsername = (text) => {
        setUsername(text)
    }

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }

    const onChangeReferral = (text) => {
        setReferrer(text)
    }

    useEffect(() => {
        const usernameRule = /^[a-zA-Z][a-zA-Z0-9]+$/;
        const validUsername = !usernameRule.test(username)
        if (username) {
            const invalidUsername = !usernameRule.test(username)
            setUnameErr(invalidUsername);
        } else {
            setUnameErr('')
        }

    }, [username, uNameErr])

    useEffect(() => {
        const invalid = passErr || emailErr || !checked || uNameErr || username === "" || username.length < 5;
        setCanSend(!invalid);
    }, [emailErr, passErr, password, checked, uNameErr, username])

    const generateNumber = (n = 11) => {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

        if (n > max) {
            return generateNumber(max) + generateNumber(n - max);
        }

        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;

        return ("" + number).substring(add);
    }

    const processReg = async () => {
        setCanSend(false);
        setError('')
        dispatch((registerUser({
            email,
            username,
            password,
            password_confirmation: password,
            referrer
        }))).then(unwrapResult)
            .then(async (response) => {
                logToAnalytics('new_user_signed_up', {
                    'username': response.data.username,
                    'email': response.data.email
                });
                dispatch(setToken(response.data.token))
            })
            .catch((error) => {
                const firstErrorMessage = Object.values(error.errors).flatMap((arr) => arr)[0];
                setTimeout(() => {
                    setError('')
                }, 5000);
                setError(firstErrorMessage)
                setCanSend(true);
            })
    }

    return (
        <MixedContainerBackground>
            <View style={styles.headerBox}>
                <AuthTitle text='Welcome'
                    style={styles.headerTitle} />
            </View>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    {error.length > 0 &&
                        <Text style={styles.errorText}>{error}</Text>
                    }
                    <Input
                        label='Enter your email address'
                        value={email}
                        type="email"
                        error={emailErr && '*email is not valid'}
                        onChangeText={text => onChangeEmail(text)}
                    />

                    <Input
                        label='Username'
                        value={username}
                        type="text"
                        error={uNameErr && 'username is not valid'}
                        onChangeText={text => onChangeUsername(text)}
                    />

                    <Input
                        type="password"
                        label='Password'
                        value={password}
                        error={passErr && '*password must not be less than 8 digits'}
                        onChangeText={text => { onChangePassword(text) }}
                    />

                    <Input
                        label='Referral'
                        value={referrer}
                        type="text"
                        error={uNameErr && 'username is not valid'}
                        onChangeText={text => onChangeReferral(text)}
                    />
                </View>

                <CheckBox
                    containerStyle={styles.agreement}
                    checked={checked}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="#fff"
                    uncheckedColor='#fff'
                    onPress={() => setChecked(!checked)}
                    title={
                        <Text style={styles.permission}>I agree to the
                            <Link style={styles.linkText} to={{ screen: 'Terms' }}> terms & condition </Link>and
                            <Link style={styles.linkText} to={{ screen: 'Privacy' }}> privacy Policy</Link>
                        </Text>
                    }
                />
                <GaButton onPress={() => processReg()} text='Continue' disabled={!canSend} />
            </View>
        </MixedContainerBackground>
    );
}


export default SignupScreen;

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: responsiveScreenWidth(4),

    },
    headerBox: {
        marginTop: responsiveScreenWidth(13),
        paddingTop: responsiveScreenWidth(3)
    },

    headerTitle: {
        color: '#fff',
        fontFamily: 'blues-smile',
        fontSize: '2rem'
    },
    image: {
        flex: 1,
        justifyContent: "center",
        position: 'absolute',
        left: normalize(10),
        top: normalize(10)
    },
    inputContainer: {
        marginTop: responsiveScreenWidth(7),
    },

    linkText: {
        color: '#fff',
        fontFamily: 'poppins',
        fontSize: '0.85rem'
    },

    agreement: {
        marginLeft: 0,
        paddingLeft: 0,
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    },
    permission: {
        color: '#fff',
        fontFamily: 'graphik-regular',
        fontSize: '0.85rem'
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signIn: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: normalize(25)
    },
    create: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signInText: {
        color: '#00000000',
        fontFamily: 'graphik-medium',
        fontSize: '0.87rem'
    },
    submitBtn: {
        backgroundColor: '#F1D818'
    },
    btnText: {
        color: '#2D53A0',
        fontFamily: 'blues-smile'
    },
    disabled: {
        backgroundColor: '#DFCBCF'
    },
    errorText: {
        fontFamily: 'poppins',
        fontSize: '0.65rem',
        color: '#fff'
    }
});