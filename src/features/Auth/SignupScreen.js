import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import { ScrollView } from 'react-native-gesture-handler';
import SocialSignUp from '../../shared/SocialSignUp';
import { Link, useNavigation } from '@react-navigation/native';
import AuthBanner from '../../shared/AuthBanner';
import Input from '../../shared/Input';
import SocialSigninDivider from '../../shared/SocialSigninDivider';
import { CheckBox } from 'react-native-elements'
import AuthTitle from '../../shared/AuthTitle';
import { useDispatch } from 'react-redux';
import { saveCreatedUserCredentials } from './AuthSlice';

export default function SignupScreen({ navigation }) {

    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [canSend, setCanSend] = useState(true);
    const [passErr, setPassError] = useState(false);
    const [emailErr, setEmailError] = useState(false);
    const [phoneErr, setPhoneError] = useState(false);
    const [checked, setChecked] = useState(false);

    const onChangeEmail = (text) => {
        const rule = /^\S+@\S+\.\S+$/;
        setEmailError(!rule.test(text))
        setEmail(text)
    }

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }
    const onChangePhone = (text) => {
        text.length > 0 && text.length < 11 ? setPhoneError(true) : setPhoneError(false);
        setPhone(text)
    }
    const onChangeConfirmPassword = (text) => {
        setPasswordConfirmation(text)
    }

    const onNext = () => {
        //save this information in store
        dispatch(saveCreatedUserCredentials({ email, password, phone }));
        navigation.navigate("SignupProfile")
    }

    useEffect(() => {
        const invalid = passErr || emailErr || phoneErr || !checked || password_confirmation !== password;
        setCanSend(!invalid);
    }, [emailErr, phoneErr, passErr, password_confirmation, password, checked])

    return (
        <ScrollView style={styles.container}>
            <AuthBanner />
            <View style={styles.headerBox}>
                <AuthTitle text='Create an account' />
            </View>

            <View style={styles.inputContainer}>

                <Input
                    label='Email'
                    placeholder="johndoe@example.com"
                    value={email}
                    type="email"
                    error={emailErr && '*email is not valid'}
                    onChangeText={text => onChangeEmail(text)}
                />

                <Input
                    label='Phone Number'
                    placeholder="080xxxxxxxx"
                    value={phone}
                    type="phone"
                    error={phoneErr && '*Phone number cannot be less than 11 digits'}
                    onChangeText={text => onChangePhone(text)}
                    keyboardType="numeric"
                />

                <Input
                    type="password"
                    label='Password'
                    value={password}
                    placeholder="Enter password"
                    error={passErr && '*password must not be less than 8 digits'}
                    onChangeText={text => { onChangePassword(text) }}
                />

                <Input
                    type="password"
                    label='Password'
                    value={password_confirmation}
                    placeholder="Confirm password"
                    error={password_confirmation !== password && '*password confirmation must match password'}
                    onChangeText={text => { onChangeConfirmPassword(text) }}
                />
            </View>

            <CheckBox
                containerStyle={styles.agreement}
                checked={checked}
                onPress={() => setChecked(!checked)}
                title={
                    <Text>I agree to the
                        <Link style={styles.linkText} to={{ screen: 'TermsAndConditions' }}> terms & condition </Link> and
                        <Link style={styles.linkText} to={{ screen: 'PrivacyPolicy' }}> privacy Policy</Link>
                    </Text>
                }
            />

            <View>
                <AppButton text='Continue' onPress={onNext} disabled={!canSend} />
            </View>

            <SocialSigninDivider signInText='sign up' />
            <SocialSignUp action={() => navigation.navigate('Login')} />
            <SignIn />
        </ScrollView >
    );
}

const SignIn = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.signIn}><Text style={styles.signInText}>Have an account already ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} >
                <Text style={{ ...styles.linkText, fontFamily: 'graphik-medium', marginLeft: normalize(15) }}>Sign in</Text>
            </TouchableOpacity>
        </View>
    )
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: normalize(15),
        paddingHorizontal: normalize(15),

    },
    headerBox: {
        marginTop: normalize(50),
        paddingTop: normalize(40)
    },
    image: {
        flex: 1,
        justifyContent: "center",
        position: 'absolute',
        left: normalize(10),
        top: normalize(10)
    },

    err: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    inputContainer: {
        marginTop: normalize(60),
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
    passwordIcon: {
        left: '90%',
        top: '64%',
        transform: [{ translateY: normalize(-8) }],
        position: 'absolute',
        zIndex: 2,

    },
    confirmPassIcon: {
        left: '90%',
        top: '89%',
        transform: [{ translateY: normalize(-8) }],
        position: 'absolute',
        zIndex: 2,
    },
    linkText: {
        color: '#EF2F55',
        fontFamily: 'graphik-regular'
    },

    agreement: {
        marginLeft: 0,
        paddingLeft: 0,
        backgroundColor: '#fff',
        borderColor: '#fff'
    },

    errorMsg: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        textAlign: 'center',
        marginTop: normalize(15),
        fontSize: normalize(10)
    },
    touchable: {
        // marginLeft: normalize(8),
        // marginTop: normalize(8)
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    hr: {
        borderBottomColor: '#CDD4DF',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(41),
        marginBottom: normalize(5)
    },
    signUpOption: {
        color: 'rgba(0, 0, 0, 0.5)',
        marginTop: normalize(15),
        marginHorizontal: normalize(25),
        fontFamily: 'graphik-medium'
    },
    signIn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: normalize(25)
    },
    signInText: {
        color: '#00000080',
        fontFamily: 'graphik-medium',
        marginBottom: normalize(40)
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
});
