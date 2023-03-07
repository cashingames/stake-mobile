import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';

import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import Input from '../../shared/Input';
import { resetPassword } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';

export default function ({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const [password, setPassword] = useState(Constants.manifest.extra.isStaging ? 'zubby1234' : '');
    const [canSend, setCanSend] = useState(false);
    const [error, setError] = useState('');
    const [passErr, setPassError] = useState(false);
    const [loading, setLoading] = useState(false);

    const phone = useSelector(state => state.auth.passwordReset.userPhone);
    const code = useSelector(state => state.auth.passwordReset.userCode);

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }

    const onSend = async () => {
        setLoading(true);
        setCanSend(false);
        setError('');

        dispatch(resetPassword({ password, phone, code, password_confirmation: password }))
            .then(unwrapResult)
            .then((originalPromiseResult) => {
                setLoading(false);
                setCanSend(true);
                Alert.alert('Password reset successful')
                navigation.navigate('Login');
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError)
                setError("Password reset failed, try again");
                setLoading(false);
            })
    }

    useEffect(() => {
        var invalid = passErr;
        setCanSend(!invalid);
        setError('');
    }, [passErr]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <ForgotPasswordTitle />
                <View style={styles.form}>

                    {error.length > 0 &&
                        <Text style={styles.errorBox}>{error}</Text>
                    }

                    <Input
                        label='Enter new password'
                        type="password"
                        error={passErr && '*password must not be less than 8 digits'}
                        placeholder="password must not be less than 8 characters"
                        value={password}
                        onChangeText={text => { onChangePassword(text) }}
                    />

                </View>
                <View style={styles.button}>
                    <AppButton onPress={() => onSend()} text={loading ? 'Sending...' : 'RESET'} disabled={!canSend} />
                </View>
            </View>
        </ScrollView>
    );
}

const ForgotPasswordTitle = () => {
    return (
        <>
            <Text style={styles.headerTextStyle}>
                Set New Password
            </Text>
            <Text style={styles.instructionTextStyle}>Enter your new password below</Text>
        </>
    )
}

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