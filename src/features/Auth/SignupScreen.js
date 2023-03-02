import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, Link } from '@react-navigation/native';
import AuthBanner from '../../shared/AuthBanner';
import Input from '../../shared/Input';
import { CheckBox } from 'react-native-elements'
import AuthTitle from '../../shared/AuthTitle';
import { useDispatch } from 'react-redux';
import { registerUser, saveCreatedUserCredentials } from './AuthSlice';
import EStyleSheet from 'react-native-extended-stylesheet';
import SocialSignUp from '../../shared/SocialSignUp';
import { Ionicons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import AppleSignUp from '../../shared/AppleSignUp';
import analytics from '@react-native-firebase/analytics';



const SignupScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [canSend, setCanSend] = useState(true);
    const [passErr, setPassError] = useState(false);
    const [emailErr, setEmailError] = useState(false);
    const [phoneErr, setPhoneError] = useState(false);
    const [error, setError] = useState('')
    const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('+234');
    const [referrer, setReferrer] = useState('');


    const contactUs = async () => {
        await analytics().logEvent("clicked_contact_us_from_login")
        navigation.navigate('AuthContact')
    }

    const onChangeEmail = (text) => {
        const rule = /^\S+@\S+\.\S+$/;
        setEmailError(!rule.test(text))
        setEmail(text)
    }

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }
    const onChangePhone = (text) => {
        text.length > 0 && text.length < 10 ? setPhoneError(true) : setPhoneError(false);
        setPhone(text)
    }
    // const onChangeConfirmPassword = (text) => {
    //     setPasswordConfirmation(text)
    // }

    // const onNext = () => {
    //     //save this information in store
    //     dispatch(saveCreatedUserCredentials({ email, password, password_confirmation: password, phone_number: phone, country_code: countryCode }));
    //     navigation.navigate("SignupProfile")
    // }

    const onNext = () => {
        setLoading(true);
        //dispatch(saveCreatedUserCredentials({ email, password, password_confirmation: password, phone_number: phone, country_code: countryCode }))
        registerUser({
            email, password,
            password_confirmation: password,
            phone_number: phone,
            country_code: countryCode,
            referrer: referrer,
        }).then(response => {
            analytics().logEvent('registration_unverified', {
                'email': email,
                'phone_number': phone
            });
            navigation.navigate('SignupVerifyPhone', {
                phone_number: phone,
                next_resend_minutes: response.data.data.next_resend_minutes
            })

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
                const firstError = Object.values(errors, {})[0];
                setError(firstError[0])
            }
            setLoading(false);
        });
    }

    useEffect(() => {
        const invalid = passErr || emailErr || phoneErr || !checked;
        setCanSend(!invalid);
    }, [emailErr, phoneErr, passErr, checked])

    return (
        <ScrollView style={styles.container}>
            <AuthBanner />
            <View style={styles.headerBox}>
                <AuthTitle text='Create an account' />
            </View>
            <View style={styles.signIn}>
                <Text style={styles.signInText}>Use your social link</Text>
                <View style={styles.google}>
                    <SocialSignUp googleText="Sign up" />
                    {Platform.OS === 'ios' &&
                        <AppleSignUp />
                    }
                </View>
                <Text style={styles.signInText}>or</Text>
            </View>
            <View style={styles.inputContainer}>
                {error.length > 0 &&
                    <Text>{error}</Text>
                }
                <Input
                    label='Email'
                    placeholder="johndoe@example.com"
                    value={email}
                    type="email"
                    error={emailErr && '*invalid email address'}
                    onChangeText={text => onChangeEmail(text)}
                />
                <>
                    <Text style={styles.inputLabel} >Phone number</Text>
                    <View style={styles.phonePicker}>
                        <Pressable
                            onPress={() => setShow(true)}
                            style={styles.codeButton}
                        >
                            <Text style={styles.countryCodeDigit}>
                                {countryCode}
                            </Text>
                            <Ionicons name="caret-down-outline" size={14} color="#00000080" />
                        </Pressable>
                        <TextInput
                            style={styles.phoneNumberInput}
                            placeholder="80xxxxxxxx"
                            value={phone}
                            onChangeText={text => onChangePhone(text)}
                            error={phoneErr && '*input a valid phone number'}
                            type="phone"
                            maxLength={11}
                            keyboardType='numeric'

                        />
                    </View>
                </>

                <CountryPicker
                    show={show}
                    style={{
                        // Styles for whole modal [View]
                        modal: {
                            height: 500,
                            // backgroundColor: 'red'
                        },
                    }}
                    pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code);
                        setShow(false);
                    }}
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
                    label='Referral Code (optional)'
                    value={referrer}
                    onChangeText={setReferrer}
                />
            </View>

            <CheckBox
                containerStyle={styles.agreement}
                checked={checked}
                onPress={() => setChecked(!checked)}
                title={
                    <Text style={styles.permission}>I agree to the
                        <Link style={styles.linkText} to={{ screen: 'Terms' }}> terms & condition </Link>and
                        <Link style={styles.linkText} to={{ screen: 'Privacy' }}> privacy Policy</Link>
                    </Text>
                }
            />
            <AppButton text='Continue' onPress={onNext} disabled={!canSend} />
            <RenderCreateAccount />
            <Text style={styles.contactUs} onPress={contactUs}>You need help? Contact us</Text>
        </ScrollView>
    );
}


const RenderCreateAccount = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.signIn}>
            <View style={styles.create}>
                <Text style={styles.signInText}>Have an account already ?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}> Sign in</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default SignupScreen;

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: responsiveScreenWidth(4),

    },
    headerBox: {
        marginTop: responsiveScreenWidth(13),
        paddingTop: responsiveScreenWidth(3)
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
        color: '#EF2F55',
        fontFamily: 'graphik-regular',
        fontSize: '0.85rem'
    },

    agreement: {
        marginLeft: 0,
        paddingLeft: 0,
        backgroundColor: '#fff',
        borderColor: '#fff'
    },
    permission: {
        color: '#000000',
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
        // justifyContent: 'center',
        alignItems: 'center',
        // marginTop: normalize(2),
        marginBottom: normalize(25)
    },
    create: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginBottom: normalize(5)
    },
    signInText: {
        color: '#00000080',
        fontFamily: 'graphik-medium',
        fontSize: '0.87rem'
    },
    google: {
        marginVertical: normalize(8)
    },
    phonePicker: {
        flexDirection: 'row',
        height: normalize(38),
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        alignItems: 'center',
        marginBottom: normalize(15),

    },
    phoneNumberInput: {
        fontFamily: 'graphik-regular',
        color: '#00000080',
        fontSize: '0.75rem',
        marginLeft: '.8rem',
        width: '8rem'
    },
    countryCodeDigit: {
        fontFamily: 'graphik-regular',
        color: '#00000080',
        fontSize: '0.75rem',
    },
    codeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderRightWidth: 1,
    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        fontSize: '0.76rem',
        marginBottom: normalize(8)
    },
    contactUs: {
        fontSize: '.7rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
        textAlign: 'center',
        // marginTop:'.2rem'
    }
});