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
                setError("Your passcode is not correct");
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
            phone_number:params.phone
        }))
        setIsCountdownInProgress(true)
    }

    return (
        <ScrollView style={styles.container} >
             <View style={styles.excellent}>
                    <LottieAnimations
                        animationView={require('../../../assets/excellent.json')}
                        width={normalize(170)}
                        height={normalize(140)}
                    />
                </View>

            <Text style={styles.headerTextStyle}>
                Verify OTP
            </Text>

            <Text style={styles.verifySubText}>
                A One Time Password(OTP) has been sent to your phone number {params.phone}.
                Please input the five(5) digit
                number below to verify your phone number so you
                can play exicting games and stand a chance to win lots of prizes
            </Text>
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

            <View style={styles.reset}>
            <ResendOtp  counter={counter}
                    isCountdownInProgress={isCountdownInProgress}
                    onPress={resend} />
            </View>
            <View style={styles.button}>
                <AppButton onPress={() => nextAction()} text="Continue" disabled={!active} />
            </View>

        </ScrollView>
    )
}

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

    verifySubText: {
        fontSize: '.9rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        lineHeight: '1.5rem',
        opacity: 0.6,
        marginTop: normalize(25)
    },
    headerTextStyle: {
        fontSize: '1.4rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        lineHeight: '1.5rem'
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
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
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
    },

    reset:{
        flex:1,
    },

    button: {
        marginTop: normalize(150),
    }
}
)