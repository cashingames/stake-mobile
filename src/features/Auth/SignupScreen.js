import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, TextInput } from 'react-native';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, Link } from '@react-navigation/native';
import Input from '../../shared/Input';
import AuthTitle from '../../shared/AuthTitle';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import { registerUser } from './AuthSlice';
import logToAnalytics from '../../utils/analytics';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import CustomAlert from '../../shared/CustomAlert';




const SignupScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [canSend, setCanSend] = useState(true);
    const [passErr, setPassError] = useState(false);
    const [emailErr, setEmailError] = useState(false);
    const [usernameErr, setUsernameError] = useState(false);
    const [phoneErr, setPhoneError] = useState(false);
    const [fNameErr, setFnameErr] = useState(false);
    const [lNameErr, setLnameErr] = useState(false);
    const [confirmPassErr, setConfirmPassError] = useState(false);
    const [allError, setAllError] = useState('')
    const [checked, setChecked] = useState(false);
    const [bonusChecked, setBonusChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('+234');
    const [referrer, setReferrer] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    //check for device ids
    const deviceBrand = Device.brand;
    const deviceModelName = Device.modelName;
    const [deviceId, setDeviceId] = useState('');

    const deviceTokenNumber = async () => {
        const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
        setDeviceId(deviceToken)
    }
    deviceTokenNumber;
    // console.log(deviceId, 'device id o')


    useEffect(() => {

        deviceTokenNumber()

    }, []);


    const contactUs = () => {
        logToAnalytics("clicked_contact_us_from_login")
        navigation.navigate('AuthContact')
    }

    const onChangeEmail = (text) => {
        const rule = /^\S+@\S+\.\S+$/;
        setEmailError(!rule.test(text))
        setEmail(text)
    }
    const onChangeUsername = (text) => {
        const rule = /^[a-zA-Z][a-zA-Z0-9]+$/;
        setUsernameError(!rule.test(text))
        setUsername(text)
    }

    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }
    const onChangeConfirmPassword = (text) => {
        text.length > 0 && text.length < 8 ? setConfirmPassError(true) : setConfirmPassError(false);
        setConfirmPassword(text)
    }
    const onChangePhone = (text) => {
        text.length > 0 && text.length < 10 ? setPhoneError(true) : setPhoneError(false);
        setPhone(text)
    }

    const toggleBonusOffer = () => {
        setBonusChecked(!bonusChecked);
    }
    const toggleAgreement = () => {
        setChecked(!checked);
    }

    const onSend = () => {
        setLoading(true);
        registerUser({
            email, password,
            username,
            password_confirmation: password,
            phone_number: phone,
            first_name: firstname,
            last_name: lastname,
            country_code: countryCode,
            bonus_checked: bonusChecked,
            referrer: referrer,
            device_brand: deviceBrand,
            device_model: deviceModelName,
            device_token: deviceId
        }).then(response => {
            navigation.navigate('SignupVerifyPhone', {
                phone_number: phone,
                username: username,
                device_brand: deviceBrand,
                device_model: deviceModelName,
                device_token: deviceId,
                next_resend_minutes: response.data.data.next_resend_minutes
            })
        }, err => {
            if (!err || !err.response || err.response === undefined) {
                setAllError("Your Network is Offline.");
                setModalVisible(true)
            }
            else if (err.response.status === 500) {
                setAllError("Service not currently available. Please contact support");
                setModalVisible(true)
            }
            else {
                const errors =
                    err.response && err.response.data && err.response.data.errors;
                const firstError = Object.values(errors, {})[0];
                setAllError(firstError[0])
                setModalVisible(true)
            }
            setLoading(false);
        })
    }
    const close = () => {

    }

    useEffect(() => {
        const nameRule = /\d/;
        const validFirstName = !nameRule.test(firstname);
        const validLastName = !nameRule.test(lastname);
        setFnameErr(!validFirstName);
        setLnameErr(!validLastName);

        const invalid = passErr || emailErr || phoneErr || usernameErr || !checked || fNameErr || firstname === "" || lNameErr || lastname === "" ||
            confirmPassErr || confirmPassword === '' || confirmPassword !== password;
        setCanSend(!invalid);

    }, [emailErr, phoneErr, passErr, checked, fNameErr, firstname,
        lNameErr, lastname, confirmPassErr, confirmPassword, password])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerBox}>
                <AuthTitle text='Create Account' />
            </View>
            <View style={styles.inputContainer}>
                {/* {allError.length > 0 &&
                    <Text>{allError}</Text>
                } */}
                <View style={styles.phoneHeadContainer}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.inputLabel}>Phone number</Text>
                        <Text style={styles.requiredText}>Required</Text>
                    </View>
                    <View style={phoneErr ? styles.phonePickeri : styles.phonePicker}>
                        <Pressable
                            onPress={() => setShow(true)}
                            style={styles.codeButton}
                        >
                            <Text style={styles.countryCodeDigit}>
                                {countryCode}
                            </Text>
                            <Ionicons name="caret-down-outline" size={14} color="#072169" />
                        </Pressable>
                        <TextInput
                            style={styles.phoneNumberInput}
                            placeholder="80xxxxxxxx"
                            value={phone}
                            onChangeText={text => onChangePhone(text)}
                            error={phoneErr && '*input a valid phone number'}
                            type="phone"
                            maxLength={11}
                            keyboardType='numeric'

                        />
                    </View>
                    {phoneErr && <Text style={styles.error} >*please input a correct phone number</Text>}

                </View>

                <CountryPicker
                    show={show}
                    showOnly={['NG', 'EN']}
                    style={{
                        // Styles for whole modal [View]
                        modal: {
                            height: 500,
                            // backgroundColor: 'red'
                        },
                    }}
                    pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code);
                        setShow(false);
                    }}
                />
                <Input
                    label='First name'
                    placeholder="Enter first name on your bank account"
                    value={firstname}
                    type="text"
                    error={fNameErr && "First name can't have numbers"}
                    onChangeText={setFirstname}
                    isRequired={true}
                />
                <Input
                    label='Last name'
                    placeholder="Enter last name on your bank account"
                    value={lastname}
                    type="text"
                    error={lNameErr && "Last name can't have numbers"}
                    onChangeText={setLastname}
                    isRequired={true}
                />
                <Input
                    label='Email'
                    placeholder="e.g john@example.com"
                    value={email}
                    type="email"
                    error={emailErr && '*invalid email address'}
                    onChangeText={text => onChangeEmail(text)}
                    isRequired={true}
                />
                <Input
                    label='Username'
                    placeholder="input a username"
                    value={username}
                    type="text"
                    error={usernameErr && '*username is invalid. It must start with an alphabet and have more than 2 characters'}
                    onChangeText={text => onChangeUsername(text)}
                    isRequired={true}
                />

                <Input
                    type="password"
                    label='Password'
                    value={password}
                    placeholder="Password must not be less than 8 digits"
                    error={passErr && '*password must not be less than 8 digits'}
                    onChangeText={text => { onChangePassword(text) }}
                />
                <Input
                    type="password"
                    label='Confirm password'
                    value={confirmPassword}
                    error={confirmPassErr && '*passwords must match'}
                    placeholder="Password must not be less than 8 digits"
                    onChangeText={text => { onChangeConfirmPassword(text) }}
                />
                <Input
                    label='Referral Code (optional)'
                    value={referrer}
                    onChangeText={setReferrer}
                    placeholder="Enter referral code"
                />
            </View>
            <View style={styles.agreement}>
                <Ionicons name={checked ? 'checkmark-circle' : "ellipse-outline"} size={30} color={checked ? '#00FFA3' : '#D9D9D9'} onPress={toggleAgreement} />
                <Text style={styles.agreementText}>I agree to the
                    <Link style={styles.linkText} to={{ screen: 'Terms' }}> Terms & condition, </Link>and
                    <Link style={styles.linkText} to={{ screen: 'Privacy' }}> Privacy Policy </Link>
                    of Cashingames. I also declare i am 18 years and above
                </Text>
            </View>
            <View style={styles.agreementI}>
                <Ionicons name={bonusChecked ? 'checkmark-circle' : "ellipse-outline"} size={30} color={bonusChecked ? '#00FFA3' : '#D9D9D9'} onPress={toggleBonusOffer} />
                <Text style={styles.agreementText}> I would like to receive my sign up bonus</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <AppButton text={loading ? 'Creating' : 'Create Account'} onPress={onSend} disabled={!canSend || loading} style={styles.loginButton} textStyle={styles.buttonText}
                    isIcon={true} iconColor="#FFF" />
                <Text style={styles.orText}>Or</Text>
                <RenderCreateAccount />
            </View>
            <Text style={styles.contactUs} onPress={contactUs}>You need help? Contact us</Text>
            <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                 textLabel={allError} buttonLabel='Ok, got it'
                alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={close}  />
        </ScrollView>
    );
}


const RenderCreateAccount = () => {
    const navigation = useNavigation();

    return (
        <AppButton text='Login to account' onPress={() => navigation.navigate('Login')}
            style={styles.signupButton} textStyle={styles.signupText} isIcon={true} iconColor="#072169" />
    )
}

export default SignupScreen;

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingHorizontal: normalize(22),

    },
    headerBox: {
        marginTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(15),
    },
    inputContainer: {
        marginTop: responsiveScreenWidth(10),
    },
    linkText: {
        fontFamily: 'sansation-regular',
        fontSize: '0.85rem',
        textDecorationLine: 'underline',
    },
    agreementText: {
        fontFamily: 'sansation-regular',
        fontSize: '0.9rem',
        color: '#072169',
        lineHeight: '1.2rem',
        marginLeft: '.6rem',
        textAlign: 'justify'
    },

    agreement: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: '.8rem',
        paddingRight: '2rem'
    },
    agreementI: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '.8rem'
    },
    phoneHeadContainer: {
        marginBottom: normalize(15),

    },
    phonePicker: {
        flexDirection: 'row',
        height: normalize(52),
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#D9D9D9',
        alignItems: 'center',
        backgroundColor: '#fff'

    },
    phonePickeri: {
        flexDirection: 'row',
        height: normalize(52),
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#EF2F55',
        alignItems: 'center',
        // marginBottom: normalize(15),
        backgroundColor: '#fff'

    },
    phoneNumberInput: {
        fontFamily: 'sansation-regular',
        color: '#072169',
        fontSize: '0.85rem',
        marginLeft: '.8rem',
        width: '8rem'
    },
    countryCodeDigit: {
        fontFamily: 'sansation-regular',
        color: '#072169',
        fontSize: '0.85rem'
    },
    codeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderRightWidth: 1,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '.6rem'
    },
    inputLabel: {
        fontFamily: 'gotham-medium',
        color: '#072169',
        fontSize: '0.98rem',
    },
    requiredText: {
        fontFamily: 'sansation-regular',
        color: '#E15220',
        fontSize: '0.95rem',
    },
    contactUs: {
        fontSize: '.7rem',
        fontFamily: 'gotham-medium',
        color: '#E15220',
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '1.2rem'
    },
    buttonsContainer: {
        marginTop: '1rem'
    },
    loginButton: {
        // backgroundColor: '#E15220',
        marginVertical: 20,
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    orText: {
        fontFamily: 'sansation-bold',
        fontSize: '1.1rem',
        color: '#072169',
        textAlign: 'center'
    },
    signupButton: {
        backgroundColor: '#F9FBFF',
        marginVertical: 20,
        paddingVertical: normalize(19),
        borderWidth: 2,
        borderColor: '#072169'
    },
    signupText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        color: '#072169'
    },
    error: {
        fontFamily: 'gotham-medium',
        color: '#EF2F55',
        fontSize: normalize(13),
        marginTop: '.5rem'
    },
});