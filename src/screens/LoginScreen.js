import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Image, Text, TouchableOpacity, View } from 'react-native';
import AuthTitle from '../shared/AuthTitle';
import AppButton from '../shared/AppButton';
import normalize from '../utils/normalize';
import { ScrollView } from 'react-native-gesture-handler';
// import { loginUser } from '../../utilities/api';
// import { useAppDispatch } from '../../../hooks/typedReduxHooks';
// import { tokenSaved } from '../../../redux/slices/userDetailsSlice';
import SocialSignUp from '../shared/SocialSignUp';
import AuthBanner from '../shared/AuthBanner';
// import { loadUserDetails } from '../../utilities/actions';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthInput from '../shared/SignInInput';
import SocialSigninDivider from '../shared/SocialSigninDivider';


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [canLogin, setCanLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    const onChangeEmail = (value) => {
        setEmail(value)
    }

    const onChangePassword = (value) => {
        setPassword(value)
    }

    const onLogin = () => {
        console.log("Username and password");
    }

    useEffect(() => {
        var valid = email.length > 5 && password.length > 7;
        setCanLogin(valid);
    }, [email, password]);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container}>

                <AuthBanner />

                <View style={styles.headerBox}>
                    <AuthTitle text='Sign in' />
                </View>

                <SignInError />

                <View style={styles.inputContainer} >

                    <AuthInput
                        label='Email or username'
                        placeholder="johndoe or johndoe@example.com"
                        value={email}
                        onChangeText={text => onChangeEmail(text)}
                    />

                    <AuthInput
                        type="password"
                        label='Password'
                        value={password}
                        placeholder="Enter password"
                        onChangeText={text => { onChangePassword(text) }}
                    />

                    <RenderForgotPassword />

                </View>

                <AppButton text={loading ? 'Signing in...' : 'Sign in'} onPress={() => onLogin(email, password)} disabled={!canLogin} />
                <SocialSigninDivider signInText='sign in' />
                <SocialSignUp action={() => navigation.navigate('SignIn')} />
                <RenderCreateAccount />
            </ScrollView >
        </SafeAreaView>
    );
}

const RenderForgotPassword = () => {
    const navigation = useNavigation();
    return (
        <Text
            style={[styles.linkText, styles.textRight]}
            onPress={() => navigation.navigate('ForgotPassword')}
        >
            Forgot Password?
        </Text>
    )
}

const RenderCreateAccount = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.signIn}><Text style={styles.signInText}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} >
                <Text style={styles.linkText}>Create one</Text>
            </TouchableOpacity>
        </View>
    )
}

const SignInError = () => {
    return <Text style={styles.errorBox}>Email and Password combination is incorrect</Text>
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: normalize(20),

    },
    headerBox: {
        marginTop: normalize(120),
    },
    inputContainer: {
        marginTop: normalize(25),
    },

    err: {
    },
    errorBox: {
        marginTop: normalize(50),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
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
    textRight: {
        textAlign: "right"
    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8)
    },

    linkText: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(15)
    },
    errorMsg: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        textAlign: 'center',
        marginTop: normalize(15),
        fontSize: normalize(10)
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
