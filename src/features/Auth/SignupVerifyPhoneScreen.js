import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, BackHandler, TextInput, Pressable, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../shared/Input';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useFocusEffect } from '@react-navigation/native';
import ResendOtp from '../../shared/ResendOtp';
import InputOTP from '../../shared/InputOTP';
import { ResendPhoneOtp, setToken, verifyPhoneOtp, verifyUser } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { createIconSetFromFontello } from '@expo/vector-icons';
import { saveToken } from '../../utils/ApiHelper';
import { calculateTimeRemaining } from '../../utils/utils';

const SignupVerifyPhoneScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    const [firstDigit, setFirstDigit] = useState('')
    const [secondDigit, setSecondDigit] = useState('')
    const [thirdDigit, setThirdDigit] = useState('')
    const [fourthDigit, setFourthDigit] = useState('')
    const [fifthDigit, setFifthDigit] = useState('')
    const [counter, setCounter] = useState('');
    const [isCountdownInProgress, setIsCountdownInProgress] = useState(true);
    const params = route.params;



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
        console.log('otp resent')
        dispatch(ResendPhoneOtp({
            username: params.username
        }))
        setIsCountdownInProgress(true)
    }

    const goToDashboard = () => {
        setLoading(true);
        dispatch(verifyPhoneOtp({
            phone_number: params.phone_number,
            token: `${firstDigit}${secondDigit}${thirdDigit}${fourthDigit}${fifthDigit}`
        }))
            // console.log("token phone", token)

            .then(unwrapResult)
            .then(response => {
                console.log("phone verification response", response.data);
                saveToken(response.data)
                dispatch(setToken(response.data))
                setLoading(false);
                // navigation.navigate('Home')
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError)
                Alert.alert("Failed to log in");
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
                <VerifyEmailText />
                <InputOTP
                    firstDigit={firstDigit}
                    setFirstDigit={setFirstDigit}
                    secondDigit={secondDigit}
                    setSecondDigit={setSecondDigit}
                    thirdDigit={thirdDigit}
                    setThirdDigit={setThirdDigit}
                    fourthDigit={fourthDigit}
                    setFourthDigit={setFourthDigit}
                    fifthDigit={fifthDigit}
                    setFifthDigit={setFifthDigit}
                    onPress={resendButton}
                    counter={counter}
                    isCountdownInProgress={isCountdownInProgress}
                />
                <AppButton text={loading ? 'Verifying...' : 'Login'} disabled={loading} onPress={goToDashboard} />
            </ScrollView>
        </View>

    )
}

const VerifyEmailText = () => {
    return (
        <View style={styles.verifyText}>
            <Text style={styles.verifyHeadText}>
                Good job, you are almost there
            </Text>
            <Text style={styles.verifySubText}>
                A One Time Password(OTP) has been sent to your registered phone number.
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

});