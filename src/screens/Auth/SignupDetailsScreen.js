import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Image, View, Alert } from 'react-native';
// import { tokenSaved } from '../../../redux/slices/userDetailsSlice';
import AuthTitle from '../../components/AuthTitle';
import HeaderBack from '../../components/HeaderBack';
import AppButton from '../../components/AppButton';
import { normalize } from '../../constants/NormalizeFont';
// import { userSignUp, verifyUsername } from '../../utilities/api';
// import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import { ScrollView } from 'react-native-gesture-handler';
// import { loadUserDetails } from '../../utilities/actions';
import InputError from '../../components/InputError';
import SignInInput from '../../components/SignInInput';

export default function SignupDetailsScreen({ navigation, route, }) {
    const params = route.params;
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    const [loading, setLoading] = useState(false);
    const [inActive, setInActive] = useState(true);
    const [available, setAvailable] = useState(false);
    const [defaultInput, setDefaultInput] = useState(true);
    const [fNameErr, setFnameErr] = useState(false);
    const [lNameErr, setLnameErr] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (firstname.length == 0 || lastname.length == 0 ||
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
        if (re.test(firstname) === true) {
            setInActive(true);
            setFnameErr(true);
        }
        if (re.test(lastname) === true) {
            setInActive(true);
            setLnameErr(true);
        }

    })

    const onChangeUsername = (username) => {
        setUsername(username)
    }

    const signUpHandler = async () => {
        setLoading(true);
        console.log('verifying')
        const verify = await verifyUsername(username);
        console.log(verify.data + ' verified');
        if (verify.data === true) {
            setDefaultInput(false)
            setAvailable(true)
        } else {
            setDefaultInput(false)
            setAvailable(false);
            setLoading(false);
            return
        }
        try {

            console.log('signing up')
            const response = await userSignUp(firstname, lastname, username, referrer, params);
            dispatch(tokenSaved(response.data));
            await loadUserDetails(response.data);
            setLoading(false);
            console.log('dispatched')
            console.log('signed up')
            navigation.navigate("Dashboard")

        }
        catch (error) {
            setLoading(false);
            console.log(error);
            Alert.alert('Sign Up failed', `Network Error`);
        }
    }

    return (
        <ScrollView style={styles.container}>
            <HeaderBack onPress={() => navigation.goBack()} />
            <DetailsTitle />
            <View >
                {fNameErr && <InputError text="First name can't have numbers" textStyle={styles.err} />}
                <SignInInput inputLabel='First Name' onChange={setFirstname} value={firstname} />
                {lNameErr && <InputError text="Last name can't have numbers" textStyle={styles.err} />}
                <SignInInput inputLabel='Last Name' onChange={setLastname} value={lastname} />
                <Text style={styles.inputLabel} >Username</Text>
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
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => { onChangeUsername(text) }}
                    value={username}
                    maxLength={20}
                />
            </View>
             <SignInInput inputLabel='Referral Code (optional)' onChange={setReferrer} value={referrer} />
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
