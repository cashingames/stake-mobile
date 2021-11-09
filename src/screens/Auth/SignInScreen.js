import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Image, Text, TouchableOpacity, View } from 'react-native';
import AuthTitle from '../../components/AuthTitle';
import AppButton from '../../components/AppButton';
import { normalize } from '../../constants/NormalizeFont';
import { ScrollView } from 'react-native-gesture-handler';
// import { loginUser } from '../../utilities/api';
// import { useAppDispatch } from '../../../hooks/typedReduxHooks';
// import { tokenSaved } from '../../../redux/slices/userDetailsSlice';
import { Ionicons } from '@expo/vector-icons';
import SocialSignUp from '../../components/SocialSignUp';
import AuthBanner from '../../components/AuthBanner';
// import { loadUserDetails } from '../../utilities/actions';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignInInput from '../../components/SignInInput';
import InputError from '../../components/InputError';
import UserPassword from '../../components/UserPassword';
import SocialSigninDivider from '../../components/SocialSigninDivider';


export default function SignInScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inActive, setInActive] = useState(true);
    const [passErr, setPassError] = useState(false);
    const [emailErr, setEmailError] = useState(false);
    const [signInErr, setSignInError] = useState(false);
    // const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [secureType, setSecureType] = useState(true);

    const toggleSecureText = () => {
        secureType ? setSecureType(false) : setSecureType(true)
    }

    const onChangeEmail = (email) => {
        signInErr && setSignInError(false);
        setEmail(email)
    }

    const onChangePassword = (password) => {
        signInErr && setSignInError(false);
        setPassword(password)
    }

    // const onLogin = async (email, password) => {
    //     console.log(email, password);
    //     setLoading(true)
    //     const re = /^\S+@\S+\.\S+$/;
    //     if (!(re.test(email))) {
    //         // setInActive(true);
    //         setEmailError(true);
    //         setLoading(false)
    //         return;
    //     }
    //     if (password.length < 8) {
    //         // setInActive(true);
    //         setPassError(true)
    //         setLoading(false)
    //         return;
    //     }
    //     try {
    //         console.log('signing in')
    //         setLoading(true)
    //         const response = await loginUser(email, password);
    //         console.log(response.data)
    //         dispatch(tokenSaved(response.data));
    //         await loadUserDetails(response.data);
    //         console.log('dispatched')
    //         setLoading(false);
    //         console.log('signed up')
    //         navigation.navigate("Dashboard")
    //     }
    //     catch (error) {
    //         setLoading(false);
    //         console.log(error);
    //         setSignInError(true)
    //     }

    // }
    const onLogin = () => {

    }

    useEffect(() => {
        if (email.length === 0 ||
            password.length === 0) {
            setInActive(true);
            setEmailError(false)
        } else {
            setInActive(false);
        }
        if (emailErr || passErr) {
            setInActive(true);
        }
    });


    return (
        <ScrollView style={styles.container}>
            <AuthBanner />
            <View style={styles.headerBox}>
                <AuthTitle text='Sign in' />
            </View>
            {
                signInErr && <SignInError />
            }
            <View style={!signInErr ? { ...styles.inputContainer, marginTop: 80, } : styles.inputContainer} >
                {emailErr && <InputError text='*email is not valid' textStyle={styles.err} />}
                <SignInInput inputLabel='Email' onChange={(text) => { onChangeEmail(text) }} value={email} />
                {
                    passErr && <InputError text='*password must not be less than 8 digits' textStyle={styles.err} />
                }
                <UserPassword inputLabel='Password' onPress={toggleSecureText}
                    secureStyle={passErr || emailErr ? { ...styles.passwordIcon, top: '73%', } : styles.passwordIcon}
                    secure={secureType} value={password} onChangeText={(text) => { onChangePassword(text) }}
                    secureTextEntry={secureType}
                />
                <ForgotPassword />
            </View>
            {
                inActive && !emailErr && !passErr && <InputError text='*All fields are required' textStyle={styles.errorMsg} />
            }
            <AppButton text={loading ? 'Signing in...' : 'Sign in'} onPress={() => onLogin(email, password)} disabledState={inActive} />
            <SocialSigninDivider signInText='sign in' />
            <SocialSignUp action={() => navigation.navigate('SignIn')} />
            <CreateAccount />
        </ScrollView >
    );
}

const ForgotPassword = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.forgotPassword}>
            <Text style={styles.linkText}><Text style={styles.touchable} onPress={() =>
                navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
            </Text>
        </View>
    )
}

const CreateAccount = () => {
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
    return (
        <View style={styles.errorBox}>
            <Text style={{ ...styles.linkText, marginLeft: 13 }}>Email and Password combination is incorrect</Text>
        </View>
    )
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: normalize(15),
        paddingHorizontal: normalize(20),

    },
    headerBox: {
        marginTop: normalize(50),
        paddingTop: normalize(40)
    },
    err: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    errorBox: {
        marginTop: normalize(50),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8)
    },
    inputContainer: {
        marginTop: normalize(25),
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
        top: '70%',
        transform: [{ translateY: normalize(-8) }],
        position: 'absolute',
        zIndex: 2,

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
    touchable: {
        marginHorizontal: normalize(0)
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
    forgotPassword: {
        marginLeft: 'auto',
    }
});
