import React, { useState, useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, Link } from '@react-navigation/native';
import Input from '../../shared/Input';
import { CheckBox } from 'react-native-elements'
import AuthTitle from '../../shared/AuthTitle';
import { useDispatch } from 'react-redux';
import { registerUser, registerUserThunk, saveCreatedUserCredentials, setToken } from './AuthSlice';
import EStyleSheet from 'react-native-extended-stylesheet';
import analytics from '@react-native-firebase/analytics';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GaButton from '../../shared/GaButton';



const SignupScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [canSend, setCanSend] = useState(true);
    const [passErr, setPassError] = useState(false);
    const [uNameErr, setUnameErr] = useState(false)
    const [emailErr, setEmailError] = useState(false);
    const [checked, setChecked] = useState(false);
    const [show, setShow] = useState(false);

    const onChangeEmail = (text) => {
        const rule = /^\S+@\S+\.\S+$/;
        setEmailError(!rule.test(text))
        setEmail(text)
    }

    const onChangeUsername = (text) => {
        setUsername(text)
    }

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }

    useEffect(() => {
        const usernameRule = /^[a-zA-Z][a-zA-Z0-9]+$/;
        const validUsername = !usernameRule.test(username)
        if (username) {
            const validUsername = !usernameRule.test(username)
            setUnameErr(validUsername);
        } else {
            setUnameErr('')
        }

    }, [username, uNameErr])

    useEffect(() => {
        const invalid = passErr || emailErr || !checked || uNameErr || username === "" || username.length < 5;
        setCanSend(!invalid);
    }, [emailErr, passErr, password, checked, uNameErr, username])

    const generateNumber = (n = 11)=>{
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
        
        if ( n > max ) {
                return generateNumber(max) + generateNumber(n - max);
        }
        
        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;
        
        return ("" + number).substring(add); 
    }

    const processReg = async ()=>{
        setCanSend(false);

        try{
            const _payload = {
                email,
                username,
                password,
                password_confirmation: password,
                // phone_number: generateNumber()
            }

            const res = await registerUser(_payload);

            console.log(res?.data?.data?.token)

            // process login 
            if(res.data.success){
                dispatch(setToken(res?.data?.data?.token || ""))
            }
    
        }catch(e){
            console.log(e.response)
            Alert.alert("Confirm information provided", e.response.data.message)
        }

        setCanSend(true);

        // dispatch(registerUserThunk({
        //     email,
        //     username,
        //     password
        // }))
        // .unwrap()
        // .then(response =>{
        //     console.log(response)
        // })
        // .catch(err =>{
        //     console.log(err)
        //     setCanSend(true);
        //     Alert.alert("Confirm information provided")
        // });
    }

    return (
        <MixedContainerBackground>
            <View style={styles.headerBox}>
                <AuthTitle text='Welcome'
                    style={styles.headerTitle} />
            </View>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Input
                        label='Enter your email address'
                        // placeholder="johndoe@example.com"
                        value={email}
                        type="email"
                        error={emailErr && '*email is not valid'}
                        onChangeText={text => onChangeEmail(text)}
                    />

                    <Input
                        label='Username'
                        value={username}
                        type="text"
                        error={uNameErr && 'username is not valid'}
                        onChangeText={text => onChangeUsername(text)}
                    />

                    <Input
                        type="password"
                        label='Password'
                        value={password}
                        error={passErr && '*password must not be less than 8 digits'}
                        onChangeText={text => { onChangePassword(text) }}
                    />

                </View>

                <CheckBox
                    containerStyle={styles.agreement}
                    checked={checked}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="#fff"
                    uncheckedColor='#fff'
                    onPress={() => setChecked(!checked)}
                    title={
                        <Text style={styles.permission}>I agree to the
                            <Link style={styles.linkText} to={{ screen: 'Terms' }}> terms & condition </Link>and
                            <Link style={styles.linkText} to={{ screen: 'Privacy' }}> privacy Policy</Link>
                        </Text>
                    }
                />
                <GaButton onPress={()=> processReg()} text='Continue' disabled={!canSend} />
            </View>
        </MixedContainerBackground>
    );
}


export default SignupScreen;

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: responsiveScreenWidth(4),

    },
    headerBox: {
        marginTop: responsiveScreenWidth(13),
        paddingTop: responsiveScreenWidth(3)
    },

    headerTitle: {
        color: '#fff',
        fontFamily: 'blues-smile',
        fontSize: '2rem'
    },
    image: {
        flex: 1,
        justifyContent: "center",
        position: 'absolute',
        left: normalize(10),
        top: normalize(10)
    },
    inputContainer: {
        marginTop: responsiveScreenWidth(7),
    },

    linkText: {
        color: '#fff',
        fontFamily: 'graphik-regular',
        fontSize: '0.85rem'
    },

    agreement: {
        marginLeft: 0,
        paddingLeft: 0,
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    },
    permission: {
        color: '#fff',
        fontFamily: 'graphik-regular',
        fontSize: '0.85rem'
    },
    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signIn: {
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        // marginTop: normalize(2),
        marginBottom: normalize(25)
    },
    create: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginBottom: normalize(5)
    },
    signInText: {
        color: '#00000080',
        fontFamily: 'graphik-medium',
        fontSize: '0.87rem'
    },
    submitBtn: {
        backgroundColor: '#F1D818'
    },

    btnText: {
        color: '#2D53A0',
        fontFamily: 'blues-smile'
    },

    disabled: {
        backgroundColor: '#DFCBCF'
    }
});