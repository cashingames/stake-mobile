import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import ResendOtp from '../../shared/ResendOtp';
import { setUserPasswordResetToken, verifyOtp, verifyAccount, setUserPhone } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { calculateTimeRemaining } from '../../utils/utils';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import LottieAnimations from '../../shared/LottieAnimations';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyPasswordOtpScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const params = route.params

    const pin1Ref = useRef(null)
    const pin2Ref = useRef(null)
    const pin3Ref = useRef(null)
    const pin4Ref = useRef(null)
    const pin5Ref = useRef(null)


    const [otp1, setOtp1] = useState('')
    const [otp2, setOtp2] = useState('')
    const [otp3, setOtp3] = useState('')
    const [otp4, setOtp4] = useState('')
    const [otp5, setOtp5] = useState('')
    const [counter, setCounter] = useState('');
    const [isCountdownInProgress, setIsCountdownInProgress] = useState(true);
    const [active, setActive] = useState(false);

    const token = `${otp1}${otp2}${otp3}${otp4}${otp5}`

    const [error, setError] = useState('');

    const nextAction = () => {
        setActive(false);
        setError('')
        dispatch(setUserPasswordResetToken(token));
        dispatch(setUserPhone(params.phone));
        dispatch(verifyOtp({ token })).then(unwrapResult)
            .then((originalPromiseResult) => {
                setActive(true);
                // console.log(originalPromiseResult)
                navigation.navigate('ResetPassword');
            })
            .catch((rejectedValueOrSerializedError) => {
                setActive(true);
                setError("Otp code is not correct");
            })
    }

    useEffect(() => {
        // console.log(codes.length);
        if (token.length < 5) {
            setActive(false)
            return;
        }
        setActive(true);
    }, [token])

    useEffect(() => {
        const onComplete = () => {
            clearInterval(countDown);
            setIsCountdownInProgress(false)
        }
        let nextResendMinutes = 2;
        const futureDateStamp = new Date()
        futureDateStamp.setMinutes(futureDateStamp.getMinutes() + nextResendMinutes)

        const futureDate = futureDateStamp.getTime()

        const countDown = setInterval(() => {
            const timeString = calculateTimeRemaining(futureDate, onComplete);
            setCounter(timeString);
        }, 1000);

        return () => clearInterval(countDown);

    }, [])

    const resend = () => {
        dispatch(verifyAccount({
            phone_number: params.phone
        }))
        setIsCountdownInProgress(true)
    }

    return (
        <ScrollView style={styles.container} >

            <View style={styles.headerContainerStyle}>
                <Ionicons name="close-sharp" size={22} color="#072169" onPress={() => navigation.navigate('Login')} />
                <Text style={styles.headerTextStyle}>
                    OTP Verification
                </Text>
            </View>

            <Text style={styles.verifySubText}>Enter Otp code</Text>
            {error.length > 0 &&
                <Text style={styles.errorBox}>{error}</Text>
            }
            <View style={styles.form}>
                <TextInput
                    ref={pin1Ref}
                    keyboardType='numeric'
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
                    keyboardType='numeric'
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
                    keyboardType='numeric'
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
                    keyboardType='numeric'
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
                    keyboardType='numeric'
                    maxLength={1}
                    onChangeText={(otp5) => {
                        setOtp5(otp5)
                    }}
                    style={styles.input}
                />

            </View>
            <View style={styles.expireContainer}>
                <Text style={styles.digitText}>Enter 5 digit OTP Code</Text>
            </View>
            <AppButton onPress={() => nextAction()} text="Verify Otp" disabled={!active} disabledStyle={styles.disabled}
                style={styles.loginButton} textStyle={styles.buttonText} />
            <View style={styles.reset}>
                <ResendOtp counter={counter}
                    isCountdownInProgress={isCountdownInProgress}
                    onPress={resend} />
            </View>

        </ScrollView>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(13),
        paddingHorizontal: normalize(22)
    },

    excellent: {
        alignItems: 'center'
    },

    verifySubText: {
        fontSize: '1.1rem',
        color: '#072169',
        fontFamily: 'gotham-medium',
        lineHeight: '1.5rem',
        marginTop: '4rem'
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
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        marginTop: normalize(7),
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '1.3rem',
    },
    input: {
        height: 58,
        borderWidth: 1,
        borderRadius: 13,
        width: 56,
        borderColor: '#D9D9D9',
        backgroundColor: '#fff',
        fontFamily: 'sansation-bold',
        textAlign: 'center',
        color: "#072169",
        fontSize: '1.1rem'
    },
    expireContainer: {
        marginTop: '2rem'
    },
    digitText: {
        fontFamily: 'sansation-bold',
        color: "#072169",
        fontSize: '.9rem'
    },
    loginButton: {
        // backgroundColor: '#E15220',
        marginBottom: 20,
        marginTop: 40,
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },

    reset: {
        flex: 1,
    },

    button: {
        marginTop: normalize(150),
    },
    disabled: {
        backgroundColor: '#EA8663'
    }
}
)