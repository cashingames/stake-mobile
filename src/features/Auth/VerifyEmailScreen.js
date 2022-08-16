import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import AppButton from '../../shared/AppButton';
import Input from '../../shared/Input';
import normalize from '../../utils/normalize';
import { setUserPasswordResetToken, verifyOtp } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';

export default function VerifyEmailScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const [codes, setCodes] = useState([]);
    const [active, setActive] = useState(false);
    const token = codes.join("");
    const [error, setError] = useState('');

    const onChangeInput1 = (text) => {
        
        let newArr = [...codes];
        newArr[0] = text;
        setCodes(newArr)
    }

    const onChangeInput2 = (text) => {
        
        let newArr = [...codes];
        newArr[1] = text;
        setCodes(newArr)
    }

    const onChangeInput3 = (text) => {
        
        let newArr = [...codes];
        newArr[2] = text;
        setCodes(newArr)
    }

    const onChangeInput4 = (text) => {
        
        let newArr = [...codes];
        newArr[3] = text;
        setCodes(newArr)
    }

    const onChangeInput5 = (text) => {
        let newArr = [...codes];
        newArr[4] = text;
        setCodes(newArr)
    }

    const nextAction = () => {
        setActive(false);
        setError('')
        dispatch(setUserPasswordResetToken(token));
        dispatch(verifyOtp({ token })).then(unwrapResult)
            .then((originalPromiseResult) => {
                setActive(true);
                console.log(originalPromiseResult)
                navigation.navigate('ResetPassword');
            })
            .catch((rejectedValueOrSerializedError) => {
                setActive(true);
                setError("Your passcode is not correct");
            })
    }

    useEffect(() => {
        console.log(codes.length);
        if (codes.length < 5) {
            setActive(false)
            return;
        }
        setActive(true);
    }, [codes])

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headerTextStyle}>
                Verify OTP
            </Text>

            <Text style={styles.instructionTextStyle}>Enter the One-time passcode we sent  to the email you provided</Text>
            {error.length > 0 &&
                <Text style={styles.errorBox}>{error}</Text>
            }
            <View style={styles.form}>
                <Input
                    onChangeText={text => onChangeInput1(text)}
                    maxLength={1}
                    returnKeyType="next"
                    keyboardType="numeric"
                />

                <Input
                    onChangeText={text => onChangeInput2(text)}
                    maxLength={1}
                    returnKeyType="next"
                    keyboardType="numeric"
                />

                <Input
                    onChangeText={text => onChangeInput3(text)}
                    maxLength={1}
                    returnKeyType="next"
                    keyboardType="numeric"
                />

                <Input
                    onChangeText={text => onChangeInput4(text)}
                    maxLength={1}
                    returnKeyType="next"
                    keyboardType="numeric"
                />

                <Input
                    onChangeText={text => onChangeInput5(text)}
                    maxLength={1}
                    returnKeyType={"done"}
                    keyboardType="numeric"
                />

            </View>

            <View style={styles.button}>
                <AppButton onPress={() => nextAction()} text="Continue" disabled={!active} />
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