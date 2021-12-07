import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';

import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import AuthInput from '../../shared/SignInInput';
import { resetPassword } from './AuthSlice';

export default function ({ navigation }) {
    const dispatch = useDispatch();

    const [password, setPassword] = useState('AAkinkunmi@1');
    const [canSend, setCanSend] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const email = useSelector(state => state.auth.passwordReset.email)

    const onChangePassword = (value) => {
        setPassword(value)
    }

    const onSend = async () => {
        setLoading(true);
        setCanSend(false);
        setError('');

        const result = (await dispatch(resetPassword({ email, password, password_confirmation: password }))).payload
        console.info(result);
        setLoading(false);
        setCanSend(true);
        if (result.success === true) {
            navigation.navigate("Login");
        } else {
            setError(result.message);
        }
    }

    useEffect(() => {
        var valid = password.length > 5;
        setCanSend(valid);
        setError('');
    }, [password]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <ForgotPasswordTitle />
                <View style={styles.form}>

                    {error.length > 0 &&
                        <Text style={styles.errorBox}>{error}</Text>
                    }

                    <AuthInput
                        label='Enter new password'
                        type="password"
                        placeholder="johndoe or johndoe@example.com"
                        value={password}
                        onChangeText={text => onChangePassword(text)}
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