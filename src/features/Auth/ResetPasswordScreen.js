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
import CustomAlert from '../../shared/CustomAlert';

export default function ({ navigation }) {
    const dispatch = useDispatch();

    const [password, setPassword] = useState(Constants.expoConfig.extra.isStaging ? 'zubby1234' : '');
    const [confirmPassword, setConfirmPassword] = useState(Constants.expoConfig.extra.isStaging ? 'zubby1234' : '');
    const [canSend, setCanSend] = useState(false);
    const [passErr, setPassError] = useState(false);
    const [confirmPassErr, setConfirmPassError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allError, setAllError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = React.useState(false);
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
                setAllError("Password reset successful");
                setVisible(true)
                setModalVisible(true)
                navigation.navigate('Login');
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError)
                setAllError("Password reset failed, try again");
                setVisible(true)
                setModalVisible(true)
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
            <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                visible={visible} setVisible={setVisible} textLabel={allError} buttonLabel='Ok, got it'
                alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} />
        </ScrollView>
    );
}

const ForgotPasswordTitle = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainerStyle}>
            <Ionicons name="close-sharp" size={22} color="#072169" onPress={() => navigation.navigate('Login')} />
            <Text style={styles.headerTextStyle}>Update your password</Text>
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
        alignItems: 'center'
    },
    content: {
        justifyContent: 'space-between'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'gotham-bold',
        color: '#072169',
        marginLeft: '2.5rem',
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
    errorBox: {
        marginVertical: normalize(20),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'gotham-light',
        color: '#EF2F55',
        fontSize: normalize(10)
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