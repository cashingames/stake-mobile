import React, { useEffect, useState } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Alert,
} from 'react-native';
import AppButton from '../../components/AppButton';
import normalize from '../../utils/normalize';
import HeaderBack from '../../components/HeaderBack';
import { Ionicons } from '@expo/vector-icons';
// import { resetPassword } from '../../utilities/api';
import InputError from '../../components/InputError';
import UserPassword from '../../components/UserPassword';

const ResetPassword = ({ navigation, route }) => {
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [secureType, setSecureType] = useState(true);
    const [passErr, setPassError] = useState(false);
    const [inActive, setInActive] = useState(true);
    const [loading, setLoading] = useState(true);
    const param = route.params

    const onChangePassword = (password) => {
        // passErr && setPassError(false);
        setPassword(password)
        setPasswordConfirmation(password)
    }

    const toggleSecureText = () => {
        secureType ? setSecureType(false) : setSecureType(true)
    }

    const onSubmit = async (email, password, password_confirmation) => {
        setLoading(true)
        await resetPassword(email, password, password_confirmation).then(
            x => {
                console.log(x);
                setLoading(false);
                navigation.navigate('ResetPasswordSuccess')
            },
            err => {
                console.log(err)
                Alert.alert('Sorry!', "Network Error")
                setLoading(false)
            }
        )
    }

    useEffect(() => {
        if (password.length === 0) {
            setInActive(true);
            setPassError(false)
        } else {
            setInActive(false);
        }
        if (password.length > 0 && password.length < 8) {
            setPassError(true)
            setInActive(true);
        }
        if (password.length >= 8) {
            setPassError(false)
            setInActive(false);
        }
    });

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFF',
            paddingBottom: 10,
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 20,
        }}>
            <HeaderBack onPress={() => navigation.goBack()} />
            <View style={styles.content}>
                <ResetPasswordTitle />
                <View style={styles.form}>
                    {
                        passErr && <InputError text='*password must not be less than 8 digits' textStyle={styles.err} />
                    }
                    <UserPassword inputLabel='Enter new Password' onPress={toggleSecureText}
                        secureStyle={passErr ? { ...styles.passwordIcon, top: '70%', } : styles.passwordIcon}
                        secure={secureType} value={password} onChangeText={(text) => { onChangePassword(text) }}
                        secureTextEntry={secureType}
                    />
                </View>
                <View style={styles.button}>
                    <AppButton onPress={() => onSubmit(param.email, password, password_confirmation)} text={loading ? "Resetting Password" : "Set New Password"} disabledState={inActive} />
                </View>
            </View>
        </View>
    );
}

const ResetPasswordTitle = () => {
    return (
        <>
            <Text style={styles.headerTextStyle}>
                Set New Password
            </Text>
            <Text style={styles.instructionTextStyle}>Enter your new password below</Text>
        </>
    )
}
export default ResetPassword;

const styles = StyleSheet.create({
    content: {
        justifyContent: 'space-between'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'graphik-bold',
        color: 'black',
        // lineHeight: 20,
    },
    instructionTextStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        marginTop: normalize(5),
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
        marginBottom: normalize(8),
        marginTop: normalize(23),
        color: 'rgba(0, 0, 0, 0.7)',
        fontFamily: 'graphik-medium',
    },
    passwordIcon: {
        left: '90%',
        top: '65%',
        transform: [{ translateY: normalize(-8) }],
        position: 'absolute',
        zIndex: 2,

    },
    err: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    button: {
        marginTop: normalize(150),
    }
})