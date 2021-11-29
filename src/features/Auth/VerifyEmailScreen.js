import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../shared/AppButton';
import AuthInput from '../../shared/SignInInput';

import normalize from '../../utils/normalize';

export default function VerifyEmailScreen({ navigation, route }) {

    const codeArray = [];
    const [code, setCode] = useState('');
    const [inActive, setInActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const param = route.params;

    const onChangeInput1 = (text) => {
        codeArray.push(text)
    }

    const onChangeInput2 = (text) => {
        codeArray.push(text);
    }

    const onChangeInput3 = (text) => {
        codeArray.push(text);
    }

    const onChangeInput4 = (text) => {
        codeArray.push(text);
    }

    const onChangeInput5 = (text) => {
        codeArray.push(text)
        setCode(codeArray.join(""));
    }

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

    useEffect(() => {
        code.length === 0 || code.length < 5 ? setInActive(true) : setInActive(false)
    }, [code])

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headerTextStyle}>
                Verify OTP
            </Text>

            <Text style={styles.instructionTextStyle}>Enter the One-time passcode we sent  to the email you provided</Text>

            <View style={styles.form}>

                <AuthInput
                    style={styles.input}
                    onChange={text => onChangeInput1(text)}
                    maxLength={1}
                    keyboardType="numeric"
                />

                <AuthInput
                    style={styles.input}
                    onChange={text => onChangeInput2(text)}
                    maxLength={1}
                    keyboardType="numeric"
                />

                <AuthInput
                    style={styles.input}
                    onChange={text => onChangeInput3(text)}
                    maxLength={1}
                    keyboardType="numeric"
                />

                <AuthInput
                    style={styles.input}
                    onChange={text => onChangeInput4(text)}
                    maxLength={1}
                    keyboardType="numeric"
                />

                <AuthInput
                    style={styles.input}
                    onChange={text => onChangeInput5(text)}
                    maxLength={1}
                    returnKeyType={"done"}
                    keyboardType="numeric"
                />

            </View>
            <View style={styles.button}>
                <AppButton onPress={() => verifyCode(code, param.email)}
                    text={loading ? "Verifying OTP" : "Verify OTP"} disabledState={inActive}
                />
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
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
        color: "#000",
    },
    button: {
        marginTop: normalize(150),
    }
}
)