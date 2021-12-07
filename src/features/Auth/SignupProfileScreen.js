import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View } from 'react-native';
import HeaderBack from '../../shared/HeaderBack';
import { useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import AuthInput from '../../shared/SignInInput';
import AuthTitle from '../../shared/AuthTitle';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import InputError from '../../shared/InputError';
import { unwrapResult } from '@reduxjs/toolkit';
import { registerUser, } from './AuthSlice';
import { verifyUsername } from '../../utils/ApiHelper';

export default function SignupProfileScreen({ navigation, route, }) {
    const params = route.params;
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    const [loading, setLoading] = useState(false);
    const [inActive, setInActive] = useState(true);
    const [available, setAvailable] = useState(false);
    const [defaultInput, setDefaultInput] = useState(true);
    const [fNameErr, setFnameErr] = useState(false);
    const [lNameErr, setLnameErr] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (first_name.length == 0 || last_name.length == 0 ||
            username.length == 0 || loading) {
            setInActive(true);
            setFnameErr(false);
            setLnameErr(false);
        } else {
            setInActive(false);
        }

    })

    useEffect(() => {
        const re = /\d/;
        if (re.test(first_name) === true) {
            setInActive(true);
            setFnameErr(true);
        }
        if (re.test(last_name) === true) {
            setInActive(true);
            setLnameErr(true);
        }

    })

    const signUpHandler = async () => {
        setLoading(true);
        const verified = await verifyUsername(username);
        if (verified) {
            setDefaultInput(false)
            setAvailable(true)
            console.log(verified);
        } else {
            setDefaultInput(false)
            setAvailable(false);
            setLoading(false);
            return
        }
        dispatch(registerUser({
            first_name,
            last_name,
            referrer,
            username,
            email: params.email,
            password: params.password,
            password_confirmation: params.password_confirmation,
            phone_number: params.phone
        })).then(unwrapResult)
            .then((originalPromiseResult) => {
                setLoading(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                setLoading(false);
                console.log(rejectedValueOrSerializedError)
                setError("Email or Phone Number has already been taken");
            })
    }

    return (
        <ScrollView style={styles.container}>
            <HeaderBack onPress={() => navigation.goBack()} />
            <DetailsTitle />
            <View >
                {error.length > 0 &&
                    <Text style={styles.errorBox}>{error}</Text>
                }
                {fNameErr && <InputError text="First name can't have numbers" textStyle={styles.err} />}
                <AuthInput
                    label='First Name'
                    placeholder="John"
                    value={first_name}
                    onChangeText={setFirstname}
                />
                {lNameErr && <InputError text="Last name can't have numbers" textStyle={styles.err} />}
                <AuthInput
                    label='Last Name'
                    placeholder="Doe"
                    value={last_name}
                    onChangeText={setLastname}
                />
                {!available && !defaultInput &&
                    <UsernameAvailability text='Unavailable' textStyle={{ ...styles.notifierLabel, color: '#C96910' }} />
                }
                {available && !defaultInput &&
                    <UsernameAvailability text='Available' textStyle={{ ...styles.notifierLabel, color: '#008D6B' }} />
                }
                {!available && !defaultInput &&
                    <Image
                        style={styles.notifier}
                        source={require('../../../assets/images/orange-dot.png')}
                    />
                }
                {available && !defaultInput &&
                    <Image
                        style={styles.greenDot}
                        source={require('../../../assets/images/green-dot.png')}
                    />
                }
                <AuthInput
                    label='Username'
                    placeholder="johnDoe"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>
            <AuthInput
                label='Referral Code (optional)'
                value={referrer}
                onChangeText={setReferrer}
            />
            <View style={styles.button}>
                <AppButton text={loading ? 'Creating...' : 'Create account'} onPress={signUpHandler} disabledState={inActive} />
            </View>
        </ScrollView>
    );
}

const DetailsTitle = () => {
    return (
        <View style={styles.title}>
            <AuthTitle text="Let's get to know you" />
            <Text style={styles.description}>Input your first name, last name and a unique username</Text>
        </View>
    )
}

const UsernameAvailability = ({ text, textStyle }) => {
    return (
        <Text style={textStyle}>{text}</Text>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: normalize(25),
        paddingHorizontal: normalize(15),
    },
    title: {
        marginRight: normalize(60)
    },
    description: {
        color: '#CDD4DF',
        marginTop: normalize(20),
        marginBottom: normalize(40),
        fontFamily: 'graphik-regular'
    },
    input: {
        height: normalize(38),
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
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8)
    },
    err: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
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
    notifier: {
        left: '90%',
        top: '86%',
        transform: [{ translateY: normalize(-8) }],
        position: 'absolute',
        zIndex: 2,
    },
    greenDot: {
        width: normalize(10),
        height: normalize(10),
        left: '90%',
        top: '86%',
        transform: [{ translateY: normalize(-8) }],
        position: 'absolute',
        zIndex: 2,
    },
    notifierLabel: {
        display: 'flex',
        alignSelf: 'flex-end',
        fontFamily: 'graphik-regular',
        marginRight: normalize(8)
    },
    button: {
        marginBottom: normalize(20)
    }
});
