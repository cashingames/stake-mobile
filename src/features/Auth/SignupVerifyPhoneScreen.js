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
import { verifyUser } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const SignupVerifyPhoneScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const [loading, setLoading] = useState(false);

    const goToDashboard = () => {
        setLoading(true);
        dispatch(verifyUser({ email: params.email }))
            .then(unwrapResult)
            .then(response => {
                // console.log("email verification response", response);
                saveToken(response.data)
                setLoading(false);
                navigation.navigate('AppRouter')
            })
            .catch((rejectedValueOrSerializedError) => {

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
                <InputOTP />
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
                Please input the four(4) digit
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