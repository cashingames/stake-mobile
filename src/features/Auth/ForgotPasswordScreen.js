import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';

import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import AuthInput from '../../shared/SignInInput';
import { verifyAccount } from './AuthSlice';

export default function ({ navigation }) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('oyekunmi@gmail.com');
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

        const result = (await dispatch(verifyAccount({ email }))).payload
        console.info(result);
        setLoading(false);
        setCanSend(true);
        if (result.success === true) {
            navigation.navigate("VerifyEmail");
        } else {
            setError(result.message);
        }
    }

    useEffect(() => {
        var valid = email.length > 5;
        setCanSend(valid);
        setError('');
    }, [email]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <ForgotPasswordTitle />
                <View style={styles.form}>

                    {error.length > 0 &&
                        <Text style={styles.errorBox}>{error}</Text>
                    }

                    <AuthInput
                        label='Email or username'
                        placeholder="johndoe or johndoe@example.com"
                        value={email}
                        onChangeText={text => onChangeEmail(text)}
                    />

                </View>
                <View style={styles.button}>
                    <AppButton onPress={() => onSend()} text={loading ? 'Sending...' : 'GET OTP'} disabled={!canSend} />
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