import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
// import SocialSignUp from '../../shared/SocialSignUp';
import { Link} from '@react-navigation/native';
import AuthBanner from '../../shared/AuthBanner';
import Input from '../../shared/Input';
// import SocialSigninDivider from '../../shared/SocialSigninDivider';
import { CheckBox } from 'react-native-elements'
import AuthTitle from '../../shared/AuthTitle';
import { useDispatch } from 'react-redux';
import { saveCreatedUserCredentials } from './AuthSlice';
import EStyleSheet from 'react-native-extended-stylesheet';

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
        dispatch(saveCreatedUserCredentials({ email, password, password_confirmation: password, phone_number: phone }));
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
                    <Text style={styles.permission}>I agree to the
                        <Link style={styles.linkText} to={{ screen: 'Terms' }}> terms & condition </Link>and
                        <Link style={styles.linkText} to={{ screen: 'Privacy' }}> privacy Policy</Link>
                    </Text>
                }
            />

            <View>
                <AppButton text='Continue' onPress={onNext} disabled={!canSend} />
            </View>

            {/* <SocialSigninDivider signInText='sign up' />
            <SocialSignUp />
            <SignIn /> */}
        </ScrollView >
    );
}

// const SignIn = () => {
//     const navigation = useNavigation();
//     return (
//         <View style={styles.signIn}><Text style={styles.signInText}>Have an account already ? </Text>
//             <Pressable onPress={() => navigation.navigate('Login')} >
//                 <Text style={{ ...styles.linkText, fontFamily: 'graphik-medium', marginLeft: normalize(15) }}>Sign in</Text>
//             </Pressable>
//         </View>
//     )
// }



const styles = EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: responsiveScreenWidth(4),
        paddingHorizontal: responsiveScreenWidth(4),

    },
    headerBox: {
        marginTop: responsiveScreenWidth(13),
        paddingTop: responsiveScreenWidth(10)
    },
    image: {
        flex: 1,
        justifyContent: "center",
        position: 'absolute',
        left: normalize(10),
        top: normalize(10)
    },
    inputContainer: {
        marginTop: responsiveScreenWidth(13),
    },
    linkText: {
        color: '#EF2F55',
        fontFamily: 'graphik-regular',
        fontSize:'0.85rem'
    },

    agreement: {
        marginLeft: 0,
        paddingLeft: 0,
        backgroundColor: '#fff',
        borderColor: '#fff'
    },
    permission: {
        color: '#000000',
        fontFamily: 'graphik-regular',
        fontSize:'0.85rem'
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
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
});
