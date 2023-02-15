import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, BackHandler, TextInput, Pressable, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useFocusEffect } from '@react-navigation/native';
import ResendOtp from '../../shared/ResendOtp';
import { ResendPhoneOtp, setToken, verifyPhoneOtp, verifyUser } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { createIconSetFromFontello } from '@expo/vector-icons';
import { saveToken } from '../../utils/ApiHelper';
import { calculateTimeRemaining } from '../../utils/utils';
import analytics from '@react-native-firebase/analytics';
import { triggerTour } from '../Tour/Index';


const SignupVerifyPhoneScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


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

    const token = `${otp1}${otp2}${otp3}${otp4}${otp5}`
    const params = route.params;

    // const startTour = async () => {
    //     await analytics().logEvent("start_tour", {
    //         'id': params.username,
    //         'phone_number': params.phone_number,
    //     })
    //     navigation.navigate("AppTour")
    // }

    useEffect(() => {
        const onComplete = () => {
            clearInterval(countDown);
            setIsCountdownInProgress(false)
        }
        let nextResendMinutes = params.next_resend_minutes;

        const futureDate = new Date()
        futureDate.setMinutes(futureDate.getMinutes() + nextResendMinutes)

        const countDown = setInterval(() => {

            const timeString = calculateTimeRemaining(futureDate.getTime(), onComplete);
            setCounter(timeString);
        }, 1000);

        return () => clearInterval(countDown);

    }, [])

    const resendButton = () => {
        dispatch(ResendPhoneOtp({
            username: params.username
        }))
        setIsCountdownInProgress(true)
    }

    const goToDashboard = () => {
        setLoading(true);
        dispatch(verifyPhoneOtp({
            phone_number: params.phone_number,
            token: token
        }))
            .then(unwrapResult)
            .then(async response => {
                await analytics().logEvent("verified_phone_number", {
                    'id': params.username,
                    'phone_number': params.phone_number,
                })
                await analytics().logEvent("verified", {
                    'id': params.username,
                    'phone_number': params.phone_number,
                })
                setLoading(false);
                triggerTour(navigation)
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError)
                Alert.alert("Invalid authentication code provided");
                setLoading(false);
            })
    }


    // useFocusEffect(
    //     React.useCallback(() => {
    //         const onBackPress = () => {
    //             return true;
    //         };
    //         BackHandler.addEventListener('hardwareBackPress', onBackPress);

    //         return () =>
    //             BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     }, [])
    // );

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.excellent}>
                    <LottieAnimations
                        animationView={require('../../../assets/excellent.json')}
                        width={normalize(170)}
                        height={normalize(140)}
                    />
                </View>
                <VerifyEmailText params={params} />

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
                <View>
                    <ResendOtp counter={counter}
                        isCountdownInProgress={isCountdownInProgress}
                        onPress={resendButton} />
                </View>
                <AppButton text={loading ? 'Verifying...' : 'Login'} disabled={loading} onPress={goToDashboard} />
            </ScrollView>
        </View>

    )
}

const VerifyEmailText = ({ params }) => {
    return (
        <View style={styles.verifyText}>
            <Text style={styles.verifyHeadText}>
                Good job, you are almost there
            </Text>
            <Text style={styles.verifySubText}>
                A One Time Password(OTP) has been sent to your phone number {params.phone_number}.
                Please input the five(5) digit
                number below to verify your phone number so you
                can play exicting games and stand a chance to win lots of prizes
            </Text>
        </View>
    )
}



export default SignupVerifyPhoneScreen;

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