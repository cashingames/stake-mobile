import React, { useState, useEffect } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import AppButton from '../../components/AppButton';
import normalize from '../../utils/normalize';
import HeaderBack from '../../components/HeaderBack';
// import { verifyOtp } from '../../utilities/api';
import SignInInput from '../../components/SignInInput';

const VerifyOTP = ({ navigation, route }) => {

    const codeArray = [];
    const [code, setCode] = useState('');
    const [inActive, setInActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const param = route.params;

    const onChangeInput1 = (text) => {
        codeArray.push(text)
    }
    const onChangeInput2 = (text) => {
        codeArray.push(text)
    }
    const onChangeInput3 = (text) => {
        codeArray.push(text)
    }
    const onChangeInput4 = (text) => {
        codeArray.push(text)
    }
    const onChangeInput5 = (text) => {
        codeArray.push(text)
        setCode(codeArray.join(""))
    }

    useEffect(() => {
        code.length === 0 || code.length < 5 ? setInActive(true) : setInActive(false)
    })

    const verifyCode = (code, email) => {
        setLoading(true)
        verifyOtp(code).then(
            (x) => {
                console.log(x)
                navigation.navigate('ResetPassword', { email })
                setLoading(false)
            },
            (err) => {
                console.log(err)
                setLoading(false)
            }
        );
    }

    return (
        <View style={styles.container}>
            <HeaderBack onPress={() => navigation.navigate('ForgotPassword')} />
            <View style={styles.content}>
                <Text style={styles.headerTextStyle}>
                    Verify OTP
                </Text>
                <Text style={styles.instructionTextStyle}>Enter the One-time passcode we sent  to the email you provided</Text>
                <View style={styles.form}>
                    <SignInInput onChange={(text) => { onChangeInput1(text) }}
                        maxLength={1} keyboardType="numeric"
                    />
                    <SignInInput onChange={(text) => { onChangeInput2(text) }}
                        maxLength={1} keyboardType="numeric"
                    />
                    <SignInInput onChange={(text) => { onChangeInput3(text) }}
                        maxLength={1} keyboardType="numeric"
                    />
                    <SignInInput onChange={(text) => { onChangeInput4(text) }}
                        maxLength={1} keyboardType="numeric"
                    />
                    <SignInInput onChange={(text) => { onChangeInput5(text) }}
                        maxLength={1} keyboardType="numeric"
                    />
                </View>
                <View style={styles.button}>
                    <AppButton onPress={() => verifyCode(code, param.email)}
                        text={loading ? "Verifying OTP" : "Verify OTP"} disabledState={inActive}
                    />
                </View>
            </View>
        </View>
    )
}

export default VerifyOTP;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
    },
    content: {
        justifyContent: 'space-between'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'graphik-bold',
        color: 'black',
    },
    instructionTextStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        marginTop: normalize(7),
    },
    form: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: normalize(48),
    },
    input: {
        height: normalize(40),
        borderWidth: normalize(1),
        borderRadius: normalize(5),
        width: normalize(40),
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        textAlign: 'center',
        fontSize: 25,
    },
    button: {
        marginTop: normalize(150),
    }
}
)