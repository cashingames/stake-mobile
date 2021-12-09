import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

import AuthInput from '../../shared/SignInInput';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import { registerUser, } from './AuthSlice';

export default function SignupProfileScreen({ navigation }) {

    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    const [loading, setLoading] = useState(false);
    const [canSend, setCanSend] = useState(true);
    const [fNameErr, setFnameErr] = useState(false);
    const [lNameErr, setLnameErr] = useState(false);
    const [error, setError] = useState('');


    const onSend = async () => {
        setLoading(true);

        dispatch(registerUser({
            firstName,
            lastName,
            referrer,
            username,
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

    useEffect(() => {
        const nameRule = /\d/;
        const validFirstName = !nameRule.test(firstName)
        const validLastName = !nameRule.test(lastName)

        setFnameErr(!validFirstName);
        setLnameErr(!validLastName);

        setCanSend(!validLastName && !validFirstName);

    }, [firstName, lastName, username])

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.headerTextStyle}>
                Let's get to know you
            </Text>

            <Text style={styles.instructionTextStyle}>Input your first and last name below:</Text>

            <View style={styles.form} >
                {error.length > 0 &&
                    <Text style={styles.errorBox}>{error}</Text>
                }
                <AuthInput
                    label='First Name'
                    placeholder="John"
                    value={firstName}
                    error={fNameErr && "First name can't have numbers"}
                    onChangeText={setFirstName}
                />

                <AuthInput
                    label='Last Name'
                    placeholder="Doe"
                    value={lastName}
                    error={lNameErr && "Last name can't have numbers"}
                    onChangeText={setLastName}
                />

                <AuthInput
                    label='Username'
                    placeholder="johnDoe"
                    value={username}
                    onChangeText={setUsername}
                />

                <AuthInput
                    label='Referral Code (optional)'
                    value={referrer}
                    onChangeText={setReferrer}
                />

            </View>

            <View style={styles.button}>
                <AppButton text={loading ? 'Creating...' : 'Create account'} onPress={onSend} disabled={!canSend} />
            </View>

        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: normalize(25),
        paddingHorizontal: normalize(15),
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'graphik-bold',
        color: 'black',
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
    form: {
        marginTop: normalize(30),
        marginBottom: normalize(60)
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
    button: {
        marginBottom: normalize(20)
    },
    instructionTextStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        marginTop: normalize(15),
    },
});
