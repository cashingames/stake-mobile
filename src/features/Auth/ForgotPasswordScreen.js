import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import { verifyAccount } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { CountryPicker } from "react-native-country-codes-picker";
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';

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
        const invalid = phoneErr;
        setCanSend(!invalid);
    }, [phoneErr])

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

                </View>
                <View style={styles.button}>
                    <AppButton onPress={onSend} text={loading ? 'Sending...' : 'GET OTP'} disabled={!canSend || loading} />
                </View>
            </View>
        </ScrollView>
    );
}

const ForgotPasswordTitle = () => {
    return (
        <>
            <Text style={styles.headerTextStyle}>
                Forgot Password
            </Text>
            <Text style={styles.instructionTextStyle}>Enter your phone number below to enable us verify you are whom you say you are</Text>
        </>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: normalize(30),
        paddingHorizontal: normalize(15),

    },
    content: {
        justifyContent: 'space-between'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'graphik-bold',
        color: 'black',
        paddingTop: normalize(10),
    },
    instructionTextStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        marginTop: normalize(15),
    },
    errorBox: {
        marginVertical: normalize(20),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    form: {
        marginTop: normalize(30),
        marginBottom: normalize(60)
    },
    input: {
        height: normalize(40),
        marginBottom: normalize(15),
        borderWidth: normalize(1),
        borderRadius: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#00000080'
    },
    inputLabel: {
        marginBottom: normalize(12),
        color: 'rgba(0, 0, 0, 0.7)',
        fontFamily: 'graphik-regular',
        fontWeight: '800'
    },
    button: {
        marginTop: normalize(10),
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
})