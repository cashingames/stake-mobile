import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../shared/Input';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import { registerUser, setToken, } from './AuthSlice';
import { saveToken } from '../../utils/ApiHelper';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';


export default function SignupProfileScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const userCredentials = useSelector(state => state.auth.createAccount);
    // console.log(userCredentials, 'bbbbb')

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    const [loading, setLoading] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [fNameErr, setFnameErr] = useState(false);
    const [lNameErr, setLnameErr] = useState(false);
    const [uNameErr, setUnameErr] = useState(false)
    const [error, setError] = useState('');


    const onSend = () => {
        setLoading(true);

        registerUser({
            first_name: firstName,
            last_name: lastName,
            referrer: referrer,
            username: username,
            ...userCredentials
        }).then(response => {
            console.log(response.data.data, 'all good')
            // saveToken(response.data.data)
            // dispatch(setToken(response.data.data))
            // navigation.navigate('SignupVerifyPhone' , { phone_number: userCredentials.phone_number , 
                // username:username, next_resend_minutes: response.data.data.next_resend_minutes })
            navigation.navigate('SignupVerifyEmail')
            // console.log(response)

        }, err => {
            if (!err || !err.response || err.response === undefined) {
                setError("Your Network is Offline.");
            }
            else if (err.response.status === 500) {
                setError("Service not currently available. Please contact support");
            }
            else {
                const errors =
                    err.response && err.response.data && err.response.data.errors;
                const firstError = Object.values(errors, {})[0];
                setError(firstError[0])
            }
            setLoading(false);
        });
    }

    useEffect(() => {
        const nameRule = /\d/;
        const usernameRule = /\s/;
        const validFirstName = !nameRule.test(firstName)
        const validLastName = !nameRule.test(lastName)
        const validUsername = !usernameRule.test(username)
        setFnameErr(!validFirstName);
        setLnameErr(!validLastName);
        setUnameErr(!validUsername);

        const invalid = fNameErr || firstName === "" || lNameErr || lastName === ""
            || uNameErr || username === ""
        setCanSend(!invalid);

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
                <Input
                    label='First Name'
                    placeholder="John"
                    value={firstName}
                    error={fNameErr && "First name can't have numbers"}
                    onChangeText={setFirstName}
                />

                <Input
                    label='Last Name'
                    placeholder="Doe"
                    value={lastName}
                    error={lNameErr && "Last name can't have numbers"}
                    onChangeText={setLastName}
                />

                <Input
                    label='Username'
                    placeholder="johnDoe"
                    value={username}
                    error={uNameErr && "Username can't have space or can't be empty"}
                    onChangeText={setUsername}
                />

                <Input
                    label='Referral Code (optional)'
                    value={referrer}
                    onChangeText={setReferrer}
                />

            </View>

            <View style={styles.button}>
                <AppButton text={loading ? 'Creating...' : 'Create account'} onPress={onSend} disabled={!canSend || loading} />
            </View>

        </ScrollView>
    )
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
