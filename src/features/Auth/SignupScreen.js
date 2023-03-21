import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, Link } from '@react-navigation/native';
import Input from '../../shared/Input';
import { CheckBox } from 'react-native-elements'
import AuthTitle from '../../shared/AuthTitle';
import { useDispatch } from 'react-redux';
import { saveCreatedUserCredentials } from './AuthSlice';
import EStyleSheet from 'react-native-extended-stylesheet';
import analytics from '@react-native-firebase/analytics';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';



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

    return (
        <ImageBackground source={require('../../../assets/images/login-image.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <ImageBackground source={require('../../../assets/images/trans-image.png')}
                style={styles.secondBgImg}
                resizeMethod="resize">
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
                    <AppButton text='Continue' disabled={!canSend} style={styles.submitBtn} textStyle={styles.btnText} />
                </View>
            </ImageBackground>
        </ImageBackground>
    );
}


export default SignupScreen;

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: responsiveScreenWidth(4),

    },

    secondBgImg: {
        flex: 1,
        height: responsiveScreenHeight(100)
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
        fontFamily:'blues-smile'
    },

    disabled: {
        backgroundColor: '#DFCBCF'
    }
});