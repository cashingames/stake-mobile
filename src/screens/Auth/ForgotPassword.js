import React, { useState, useEffect } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Alert
} from 'react-native';
import AppButton from '../../shared/AppButton';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderBack from '../../shared/HeaderBack';
// import { getOtp } from '../../utilities/api';
import InputError from '../../shared/InputError';
import SignInInput from '../../shared/SignInInput';
import normalize from '../../utils/normalize';

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [emailErr, setEmailError] = useState(false);
    const [inActive, setInActive] = useState(true);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        email.length === 0 ? setInActive(true) : setInActive(false)
    })

    const onSend = async (email) => {
        setLoading(true)
        const re = /^\S+@\S+\.\S+$/;
        if (!(re.test(email))) {
            setInActive(true);
            setEmailError(true);
            setLoading(false)
            return;
        }
        try {
            console.log('sending code')
            const response = await getOtp(email);
            console.log(response)
            setLoading(false);
            navigation.navigate('VerifyOTP', { email })
        }
        catch (error) {
            setLoading(false);
            console.log(error.response)
            Alert.alert('Failed to send Otp', `Invalid Email`);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <HeaderBack onPress={() => navigation.navigate('SignIn')} />
            <View style={styles.content}>
                <ForgotPasswordTitle />
                <View style={styles.form}>
                    {emailErr && <InputError text='*Email is not valid' textStyle={styles.err} />}
                    <SignInInput inputLabel='Email' onChange={setEmail} value={email} />
                </View>
                <View style={styles.button}>
                    <AppButton onPress={() => onSend(email)} text={loading ? 'Sending...' : 'GET OTP'} disabledState={inActive} />
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
            <Text style={styles.instructionTextStyle}>Enter your email below to enable us verify  you are whom you say you are</Text>
        </>
    )
}
export default ForgotPassword;

const styles = StyleSheet.create({
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
    err: {
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
    }
})