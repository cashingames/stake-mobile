import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';

import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import Input from '../../shared/Input';
import { resetPassword } from './AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ({ navigation }) {
    const dispatch = useDispatch();

    const [password, setPassword] = useState(Constants.expoConfig.extra.isStaging ? 'zubby1234' : '');
    const [confirmPassword, setConfirmPassword] = useState(Constants.expoConfig.extra.isStaging ? 'zubby1234' : '');
    const [canSend, setCanSend] = useState(false);
    const [passErr, setPassError] = useState(false);
    const [confirmPassErr, setConfirmPassError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allError, setAllError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const phone = useSelector(state => state.auth.passwordReset.userPhone);
    const code = useSelector(state => state.auth.passwordReset.userCode);

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }
    const onChangeConfirmPassword = (text) => {
        text.length > 0 && text.length < 8 ? setConfirmPassError(true) : setConfirmPassError(false);
        setConfirmPassword(text)
    }

    const onSend = async () => {
        setLoading(true);
        setCanSend(false);
        setAllError('');

        dispatch(resetPassword({ password, phone, code, password_confirmation: password }))
            .then(unwrapResult)
            .then((originalPromiseResult) => {
                setLoading(false);
                setCanSend(true);
                setAllError('');
                setAlertMessage("Password reset successful");
                navigation.navigate('Login');
            })
            .catch((rejectedValueOrSerializedError) => {
                setAlertMessage('');
                setAllError("Password reset failed, try again");
                setLoading(false);
            })
    }

    useEffect(() => {
        var invalid = passErr || confirmPassErr || password === '' || confirmPassword === '' || confirmPassword !== password;
        setCanSend(!invalid);
        setAllError('');
    }, [passErr, confirmPassErr, password, confirmPassword]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <ForgotPasswordTitle />
                {allError.length > 0 &&
                    <View style={styles.errorBoxContainer}>
                        <Text style={styles.errorBox}>{allError}</Text>
                    </View>
                }
                {alertMessage.length > 0 &&
                    <View style={styles.successBoxContainer}>
                        <Text style={styles.errorBox}>{alertMessage}</Text>
                    </View>
                }
                <View style={styles.form}>
                    <Input
                        label='Enter new password'
                        type="password"
                        error={passErr && '*password must not be less than 8 digits'}
                        placeholder="password must not be less than 8 characters"
                        value={password}
                        onChangeText={text => { onChangePassword(text) }}
                    />
                    <Input
                        label='Confirm password'
                        type="password"
                        error={confirmPassErr && '*passwords must match'}
                        placeholder="password must match"
                        value={confirmPassword}
                        onChangeText={text => { onChangeConfirmPassword(text) }}
                    />

                </View>
                <View style={styles.button}>
                    <AppButton onPress={() => onSend()} text={loading ? 'Updating...' : 'Update password'} disabled={!canSend}
                        style={styles.loginButton} textStyle={styles.buttonText} disabledStyle={styles.disabled} />
                </View>
            </View>
        </ScrollView>
    );
}

const ForgotPasswordTitle = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainerStyle}>
            <Ionicons name="close-sharp" size={22} color="#1C453B" onPress={() => navigation.navigate('Login')} />
            <Text style={styles.headerTextStyle}>Update your password</Text>
            <View></View>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(15),
        paddingHorizontal: normalize(22),

    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    content: {
        justifyContent: 'space-between'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        textAlign: 'center'
        // paddingTop: normalize(10),
    },
    instructionTextStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        marginTop: normalize(15),
    },
    errorBoxContainer: {
        borderRadius: 38,
        marginTop: responsiveScreenWidth(5),
        backgroundColor: '#FF0032',
        paddingVertical: normalize(10),
        marginHorizontal: '2rem',
    },
    successBoxContainer: {
        borderRadius: 38,
        marginTop: responsiveScreenWidth(5),
        backgroundColor: '#048C5B',
        paddingVertical: normalize(10),
        marginHorizontal: '2rem',
    },
    errorBox: {
        textAlign: 'center',
        fontFamily: 'sansation-bold',
        color: '#FFFF',
        fontSize: '0.85rem',
    },
    form: {
        marginTop: '5rem',
        // marginBottom: normalize(60)
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
        color: '#1C453B'
    },
    inputLabel: {
        marginBottom: normalize(12),
        color: '#1C453B',
        fontFamily: 'graphik-regular',
        fontWeight: '800'
    },
    button: {
        marginTop: normalize(10),
    },
    loginButton: {
        // backgroundColor: '#E15220',
        marginVertical: 20,
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    disabled: {
        backgroundColor: '#EA8663'
    }
})