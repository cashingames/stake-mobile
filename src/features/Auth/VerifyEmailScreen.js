import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import ResendOtp from '../../shared/ResendOtp';
import { setUserPasswordResetToken, verifyOtp, verifyAccount } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { calculateTimeRemaining } from '../../utils/utils';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { TextInput } from 'react-native';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GameArkLogo from '../../shared/GameArkLogo';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function VerifyEmailScreen({ navigation, route }) {
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
            email: params.email
        }))
        setIsCountdownInProgress(true)
    }

    return (
        <MixedContainerBackground>
            <SafeAreaView style={styles.container}>
                <GameArkLogo />
                <Text style={styles.headerTextStyle}>
                    Verify OTP
                </Text>

                <Text style={styles.instructionTextStyle}>Enter the One-time passcode we sent  to the email you provided</Text>
                {error.length > 0 &&
                    <Text style={styles.errorBox}>{error}</Text>
                }
                <Text style={styles.otpText}>Enter otp</Text>
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

                <View style={styles.reset}>
                    <ResendOtp counter={counter}
                        isCountdownInProgress={isCountdownInProgress}
                        onPress={resend} />
                </View>
                <View style={styles.button}>
                    <AppButton onPress={() => nextAction()} text="verify otp" disabled={!active} />
                </View>

            </SafeAreaView>
        </MixedContainerBackground>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#FFFF',
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
    },
    headerTextStyle: {
        fontSize: '2.2rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        textAlign: 'center',
        marginTop: normalize(10),
        marginTop: normalize(40)
    },
    instructionTextStyle: {
        fontSize: '0.8rem',
        color: '#fff',
        fontFamily: 'blues-smile',
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
    otpText: {
        color:'#fff',
        marginTop: normalize(20),
        fontFamily: 'blues-smile',
        fontSize:'1.2rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: normalize(10),
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
        backgroundColor:'#fff'
    },

    button: {
        marginTop: normalize(15),
    }
}
)