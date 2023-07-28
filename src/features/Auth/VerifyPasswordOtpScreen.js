import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    Image,
    Linking
} from 'react-native';
import { useDispatch } from 'react-redux';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import ResendOtp from '../../shared/ResendOtp';
import { setUserPasswordResetToken, verifyOtp, verifyAccount, setUserPhone, resendPasswordOtp } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { calculateTimeRemaining } from '../../utils/utils';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
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
    const [countdowvnDone, setCountdowvnDone] = (useState(false))
    const [active, setActive] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const token = `${otp1}${otp2}${otp3}${otp4}${otp5}`

    const nextAction = () => {
        setActive(false);
        dispatch(setUserPasswordResetToken(token));
        dispatch(setUserPhone(params.phone));
        dispatch(verifyOtp({ token })).then(unwrapResult)
            .then(() => {
                setActive(true);
                navigation.navigate('ResetPassword');
            })
            .catch(() => {
                setActive(true);
                setAlertMessage('');
                setError("Invalid authentication code provided");
                setOtp1('');
            })
    }

    useEffect(() => {
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
        let nextResendMinutes = 5;
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
        dispatch(resendPasswordOtp({
            phone_number: params.phone
        }))
        setCountdowvnDone(true);
        setOtp1('');
        setError('');
        setAlertMessage("Otp resent successfully");
    }

    const close = () => {

    }

    return (
        <View style={styles.container}>
            <ScrollView >

                <View style={styles.headerContainerStyle}>
                    <Ionicons name="close-sharp" size={22} color="#1C453B" onPress={() => navigation.navigate('Login')} />
                    <Text style={styles.headerTextStyle}>
                        OTP Verification
                    </Text>
                    <View></View>
                </View>

                <Text style={styles.verifySubText}>Enter Otp code</Text>
                {error.length > 0 &&
                    <View style={styles.errorBoxContainer}>
                        <Text style={styles.errorBox}>{error}</Text>
                    </View>
                }
                {alertMessage.length > 0 &&
                    <View style={styles.successBoxContainer}>
                        <Text style={styles.errorBox}>{alertMessage}</Text>
                    </View>
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
                    {isCountdownInProgress &&
                        <Text style={styles.digitText}>Expires in {counter}</Text>
                    }
                </View>
                <AppButton onPress={() => nextAction()} text="Verify Otp" disabled={!active} disabledStyle={styles.disabled}
                    style={styles.loginButton} textStyle={styles.buttonText} />
                <View style={styles.reset}>
                    <ResendOtp counter={counter}
                        isCountdownInProgress={isCountdownInProgress}
                        onPress={resend} countdowvnDone={countdowvnDone} />
                </View>

            </ScrollView>
            <Pressable style={styles.whatsappChat} onPress={() => Linking.openURL('https://wa.me/2348025116306')}>
                <Image
                    source={require('../../../assets/images/whatsapp-icon.png')}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Contact Support</Text>
                        <Ionicons name="chevron-forward" size={22} color='#1C453B' />
                    </View>
                    <Text style={styles.whatsappTitle}>Live chat with support on Whatsapp</Text>
                </View>
            </Pressable>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(13),
        paddingHorizontal: normalize(22)
    },

    verifySubText: {
        fontSize: '1.1rem',
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        lineHeight: '1.5rem',
        marginTop: '4rem'
    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'gotham-bold',
        color: '#1C453B',
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
    errorBoxContainer: {
        borderRadius: 38,
        marginTop: responsiveScreenWidth(5),
        backgroundColor: '#FF0032',
        paddingVertical: normalize(10),
        marginHorizontal: '2rem',
    },
    successBoxContainer: {
        borderRadius: 38,
        marginTop: responsiveScreenWidth(5),
        backgroundColor: '#048C5B',
        paddingVertical: normalize(10),
        marginHorizontal: '2rem',
    },
    errorBox: {
        textAlign: 'center',
        fontFamily: 'sansation-bold',
        color: '#FFFF',
        fontSize: '0.85rem',
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
        marginTop: '2rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    digitText: {
        fontFamily: 'sansation-bold',
        color: "#1C453B",
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
    },
    whatsappChat: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingVertical: '.5rem',
        paddingHorizontal: '.5rem',
        marginBottom: '3rem'
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B'
    },
    whatsappTitle: {
        fontSize: '0.8rem',
        fontFamily: 'sansation-regular',
        marginTop: normalize(3),
        color: '#1C453B'
    },
    icon: {
        width: 55,
        height: 55,
        marginRight: '.4rem'
    }
}
)