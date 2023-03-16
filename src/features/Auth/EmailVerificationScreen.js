import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, TextInput, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import { verifyEmailOTP } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';


const EmailVerificationScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const [canLogin, setCanLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const otpScreenText = 'To verify your account, please input the One Time code sent to your email.';

    const [otp1, setOtp1] = useState('')
    const [otp2, setOtp2] = useState('')
    const [otp3, setOtp3] = useState('')
    const [otp4, setOtp4] = useState('')
    const [otp5, setOtp5] = useState('')

    const pin1Ref = useRef(null)
    const pin2Ref = useRef(null)
    const pin3Ref = useRef(null)
    const pin4Ref = useRef(null)
    const pin5Ref = useRef(null)

    const otpToken = `${otp1}${otp2}${otp3}${otp4}${otp5}`
    console.log(otpToken.length)

    useEffect(() => {
        if (otpToken.length < 5) {
            setCanLogin(false)
            return;
        }
        setCanLogin(true);
    }, [otpToken])

    const goToDashboard = () => {
        setLoading(true);
        dispatch(verifyEmailOTP({
            token: otpToken
        }))
            .then(unwrapResult)
            .then(async response => {
                Alert.alert('Email successfully verifed!')
                navigation.navigate('AppRouter')
                setLoading(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                Alert.alert(rejectedValueOrSerializedError);
                setLoading(false);
            })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <VerifyEmailText text={otpScreenText} />
                <View style={styles.form}>
                    <TextInput
                        ref={pin1Ref}
                        keyboardType={'number-pad'}
                        maxLength={1}
                        value={otp1}
                        onChangeText={(otp1) => {
                            setOtp1(otp1);
                            if (otp1 !== '') {
                                pin2Ref.current.focus()
                            }
                        }}
                        style={styles.input}
                    />
                    <TextInput
                        ref={pin2Ref}
                        keyboardType={'number-pad'}
                        maxLength={1}
                        onChangeText={(otp2) => {
                            setOtp2(otp2);
                            if (otp2 !== '') {
                                pin3Ref.current.focus()
                            }
                        }}
                        style={styles.input}
                    />
                    <TextInput
                        ref={pin3Ref}
                        keyboardType={'number-pad'}
                        maxLength={1}
                        onChangeText={(otp3) => {
                            setOtp3(otp3);
                            if (otp3 !== '') {
                                pin4Ref.current.focus()
                            }
                        }}
                        style={styles.input}
                    />
                    <TextInput
                        ref={pin4Ref}
                        keyboardType={'number-pad'}
                        maxLength={1}
                        onChangeText={(otp4) => {
                            setOtp4(otp4);
                            if (otp4 !== '') {
                                pin5Ref.current.focus()
                            }
                        }}
                        style={styles.input}
                    />

                    <TextInput
                        ref={pin5Ref}
                        keyboardType={'number-pad'}
                        maxLength={1}
                        onChangeText={(otp5) => {
                            setOtp5(otp5)
                        }}
                        style={styles.input}
                    />
                </View>
                <AppButton text={loading ? 'Verifying...' : 'Proceed'} disabled={!canLogin || loading} onPress={goToDashboard} />
            </ScrollView>
        </View>

    )
}

const VerifyEmailText = ({ text }) => {
    return (
        <View style={styles.verifyText}>
            <Text style={styles.verifyHeadText}>
                Good job, you are almost there
            </Text>
            <Text style={styles.verifySubText}>
                {text}
            </Text>
        </View>
    )
}



export default EmailVerificationScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingVertical: responsiveScreenWidth(10),
        paddingHorizontal: normalize(20)
    },
    excellent: {
        alignItems: 'center'
    },
    verifyText: {
        alignItems: 'center',
        paddingVertical: normalize(10)
    },
    verifyHeadText: {
        fontSize: '1.4rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        lineHeight: '1.5rem'
    },
    verifySubText: {
        fontSize: '.9rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        lineHeight: '1.5rem',
        opacity: 0.6,
        marginTop: normalize(25)
    },
    form: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: normalize(48),
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        width: 50,
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        textAlign: 'center',
        color: "#000",
    }
});