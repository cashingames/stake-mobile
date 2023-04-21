import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import Constants from 'expo-constants';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import Input from '../../shared/Input';
import { verifyAccount } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GameArkLogo from '../../shared/GameArkLogo';
import GaButton from '../../shared/GaButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppHeader from '../../shared/AppHeader';

export default function ({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const [email, setEmail] = useState(Constants.manifest.extra.isStaging ? 'oyekunmi@gmail.com' : '');
    const [canSend, setCanSend] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangeEmail = (value) => {
        setEmail(value)
    }

    const onSend = async () => {
        setLoading(true);
        setCanSend(false);
        setError('');

        dispatch(verifyAccount({ email })).then(unwrapResult)
            .then((originalPromiseResult) => {
                setLoading(false);
                setCanSend(true);
                navigation.navigate("VerifyEmail", {
                    email: email
                });
            })
            .catch((rejectedValueOrSerializedError) => {
                setLoading(false);
                setCanSend(true);
                setError("Please Use Registered Email Address");
            })

    }

    useEffect(() => {
        const valid = email.length > 5;
        setCanSend(valid);
        setError('');
    }, [email]);

    return (
        <MixedContainerBackground>
            <View style={styles.container}>
                {/* <GameArkLogo /> */}
                <AppHeader />
                <ForgotPasswordTitle />
                <View style={styles.form}>

                    {error.length > 0 &&
                    <Text style={styles.errorBox}>{error}</Text>
                     }

                    <Input
                        label='Email '
                        placeholder="johndoe or johndoe@example.com"
                        value={email}
                        onChangeText={text => onChangeEmail(text)}
                    />

                </View>
                <View style={styles.button}>
                    <GaButton onPress={() => onSend()} text={loading ? 'Sending...' : 'Send Email'} disabled={!canSend} />
                </View>
            </View>
        </MixedContainerBackground>
    );
}

const ForgotPasswordTitle = () => {
    return (
        <>
            <Text style={styles.headerTextStyle}>
                Forgot Password
            </Text>
            <Text style={styles.instructionTextStyle}>Enter the connected email and we will
                send an OTP to reset your password</Text>
        </>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingTop: normalize(50),
        paddingHorizontal: normalize(15),

    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'blues-smile',
        color: '#fff',
        marginTop: '2rem',
        textAlign: 'center',
    },
    instructionTextStyle: {
        fontSize: 12,
        color: '#fff',
        fontFamily: 'blues-smile',
        lineHeight: 20,
        marginTop: normalize(15),
        textAlign: 'center'
    },
    errorBox: {
        marginVertical: responsiveScreenWidth(3),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
        color: "#fff"
    },
    form: {
        marginTop: normalize(20),
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