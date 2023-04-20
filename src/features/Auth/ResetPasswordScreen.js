import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import normalize from '../../utils/normalize';
import Input from '../../shared/Input';
import { resetPassword } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GameArkLogo from '../../shared/GameArkLogo';
import EStyleSheet from 'react-native-extended-stylesheet';
import GaButton from '../../shared/GaButton';
import AppHeader from '../../shared/AppHeader';

export default function ({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const [password, setPassword] = useState(Constants.manifest.extra.isStaging ? 'zubby1234' : '');
    const [canSend, setCanSend] = useState(false);
    const [error, setError] = useState('');
    const [passErr, setPassError] = useState(false);
    const [loading, setLoading] = useState(false);

    const email = useSelector(state => state.auth.passwordReset.email);
    const code = useSelector(state => state.auth.passwordReset.userCode);

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }

    const onSend = async () => {
        setLoading(true);
        setCanSend(false);
        setError('');

        dispatch(resetPassword({ password, email, code, password_confirmation: password }))
            .then(unwrapResult)
            .then((originalPromiseResult) => {
                setLoading(false);
                setCanSend(true);
                // Alert.alert('Password reset successful')
                navigation.navigate('ResetPasswordSuccess');
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
        <MixedContainerBackground>
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <AppHeader />
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
                    <GaButton onPress={() => onSend()} text={loading ? 'Sending...' : 'RESET'} disabled={!canSend} />
                </View>
            </View>
        </ScrollView>
        </MixedContainerBackground>
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

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingTop: normalize(50),
        paddingHorizontal: normalize(15)
    },
    headerTextStyle: {
        fontSize: '2.2rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        paddingTop: normalize(10),
        textAlign:'center',
        marginTop:normalize(48)
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
        fontFamily: 'graphik-medium',
        color: '#fff',
        fontSize: '0.7rem'
    },
    form: {
        marginTop: normalize(30),
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