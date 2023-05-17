import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { verifyAccount } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { CountryPicker } from "react-native-country-codes-picker";
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';

export default function ({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const [canSend, setCanSend] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneErr, setPhoneError] = useState(false);
    const [countryCode, setCountryCode] = useState('+234');
    const [show, setShow] = useState(false);

    const onChangePhone = (text) => {
        text.length > 0 && text.length < 10 ? setPhoneError(true) : setPhoneError(false);
        setPhone(text)
    }


    const onSend = async () => {
        setLoading(true);
        setCanSend(false);
        setError('');
        dispatch(verifyAccount({ phone_number: phone, country_code: countryCode }))
            .then(unwrapResult)
            .then((originalPromiseResult) => {
                console.log('here before')
                setLoading(false);
                setCanSend(true);
                navigation.navigate("VerifyPasswordOtp", {
                    phone: phone
                });
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log('here error')
                setLoading(false);
                setCanSend(true);
                setError("Phone number does not exist");
            })

    }

    useEffect(() => {
        const invalid = phoneErr || phone === '';
        setCanSend(!invalid);
    }, [phoneErr, phone])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <ForgotPasswordTitle />
                <View style={styles.form}>

                    {error.length > 0 &&
                        <Text style={styles.errorBox}>{error}</Text>
                    }

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
                                <Ionicons name="caret-down-outline" size={14} color="#072169" />
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

                </View>
                <Text style={styles.instructionTextStyle}>Enter your phone number above. An Otp code would be sent to your phone number.</Text>

                <View style={styles.button}>
                    <AppButton onPress={onSend} text={loading ? 'Sending...' : 'Reset password'} 
                    disabled={!canSend || loading} disabledStyle={styles.disabled}
                    style={styles.loginButton} textStyle={styles.buttonText} isIcon={true} iconColor="#FFF" />
                </View>
            </View>
        </ScrollView>
    );
}

const ForgotPasswordTitle = () => {
    const navigation = useNavigation();

    return (
            <View style={styles.headerContainerStyle}>
                <Ionicons name="chevron-back" size={22} color="#072169" onPress={() => navigation.navigate('Login')} />
                <Text style={styles.headerTextStyle}>
                    Password reset
                </Text>
            </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(15),
        paddingHorizontal: normalize(18),

    },
    content: {
        justifyContent: 'space-between'
    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'gotham-bold',
        color: '#072169',
        marginLeft: '2.5rem',
        textAlign: 'center'
        // paddingTop: normalize(10),
    },
    instructionTextStyle: {
        fontSize: 17,
        color: '#072169',
        fontFamily: 'sansation-regular',
        lineHeight: 22,
        marginTop: normalize(5),
    },
    errorBox: {
        marginVertical: normalize(20),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'gotham-light',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    form: {
        marginTop: '4rem',
        // marginBottom: normalize(60)
    },
    input: {
        height: normalize(40),
        marginBottom: normalize(15),
        borderWidth: normalize(1),
        borderRadius: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        fontFamily: 'sansation-regular',
        color: '#072169',
        fontSize: '0.85rem'
    },
    inputLabel: {
        fontFamily: 'gotham-medium',
        color: '#072169',
        fontSize: '0.98rem',
        marginBottom: normalize(10)
    },
    button: {
        marginTop: normalize(10),
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
    phonePicker: {
        flexDirection: 'row',
        height: normalize(52),
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#D9D9D9',
        alignItems: 'center',
        marginBottom: normalize(15),
        backgroundColor:'#fff'

    },
    phoneNumberInput: {
        fontFamily: 'sansation-regular',
        color: '#072169',
        fontSize: '0.85rem',
        marginLeft: '.8rem',
        width: '8rem'
    },
    countryCodeDigit: {
        fontFamily: 'sansation-regular',
        color: '#072169',
        fontSize: '0.85rem'
    },
    codeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderRightWidth: 1,
    },
    disabled: {
        backgroundColor: '#EA8663'
    }
})