import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Alert, Pressable, TextInput } from 'react-native';
import { CountryPicker } from "react-native-country-codes-picker";

import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../../shared/Input';
import { Ionicons } from "@expo/vector-icons";
import { editPersonalDetails, getUser, sendEmailOTP } from '../Auth/AuthSlice';
import normalize from '../../utils/normalize';
import { isTrue } from '../../utils/stringUtl';
import AppButton from '../../shared/AppButton';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomAlert from '../../shared/CustomAlert';

export default function EditProfileDetailsScreen({ navigation }) {

    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const isEmailVerified = user.isEmailVerified;
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [firstName, setFirstName] = useState(user.firstName ? user.firstName : '');
    const [lastName, setLastName] = useState(user.lastName ? user.lastName : '');
    const [username, setUsername] = useState(user.username);
    const [emailError, setEmailError] = useState(false);
    const [usernameErr, setUsernameErr] = useState(false);
    const [firstNameErr, setFirstNameError] = useState(false);
    const [lastNameErr, setLastNameError] = useState(false);
    const [phoneNumberErr, setPhoneNumberError] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(isTrue(user.dateOfBirth) ? new Date(Date.parse(user.dateOfBirth)) : new Date(2003, 0, 1));
    const [gender, setGender] = useState(user.gender ? user.gender : 'male');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState(user.countryCode);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');



    const onChangeDateOfBirth = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setDateOfBirth(currentDate);
        setShowDatePicker(false);
    };

    const onChangeEmail = (text) => {
        const rule = /^\S+@\S+\.\S+$/;
        setEmailError(!rule.test(text))
        setEmail(text)
    }

    const onChangeUsername = (text) => {
        const usernameRule = /^[a-zA-Z][a-zA-Z0-9]+$/;
        const invalidUsername = !usernameRule.test(text)
        setUsernameErr(invalidUsername)
        setUsername(text)
    }

    const onChangeFirstName = (text) => {
        text.length > 0 && text.length < 3 ? setFirstNameError(true) : setFirstNameError(false);
        setFirstName(text)
    }

    const onChangeLastName = (text) => {
        text.length > 0 && text.length < 3 ? setLastNameError(true) : setLastNameError(false);
        setLastName(text)
    }

    const onChangePhoneNumber = (text) => {
        text.length > 0 && text.length < 4 ? setPhoneNumberError(true) : setPhoneNumberError(false);
        setPhoneNumber(text)
    }

    const goToVerifyEmailScreen = () => {
        dispatch(sendEmailOTP())
        navigation.navigate('EmailVerification')
    }

    useEffect(() => {
        const invalid = firstNameErr || firstName === '' || lastNameErr || lastName === '' ||
            phoneNumber === '' || phoneNumberErr || email === '' || emailError || username === '' || usernameErr
        setCanSave(!invalid);
    }, [firstNameErr, firstName, lastNameErr, lastName, phoneNumber, phoneNumberErr, email, emailError, username, usernameErr])

    const genderData = [
        { key: '1', value: 'Male' },
        { key: '2', value: 'Female' },
    ]

    const onSavePersonalDetails = () => {
        setSaving(true);
        editPersonalDetails({
            firstName,
            lastName,
            // phoneNumber,
            username,
            email,
            dateOfBirth,
            gender
        })
            .then(result => {
                dispatch(getUser());
                setModalVisible(true)
                setAlertMessage('Personal details updated successfully');
                setSaving(false);
            },
                err => {
                    if (!err || !err.response || err.response === undefined) {
                        setModalVisible(true)
                        setAlertMessage('Your Network is Offline.');
                        setSaving(false);
                    }
                    else if (err.response.status === 500) {
                        setModalVisible(true)
                        setAlertMessage('Service not currently available. Please contact support');
                        setSaving(false);
                    }
                    else {
                        const errors =
                            err.response && err.response.data && err.response.data.errors;
                        const firstError = Object.values(errors, {})[0];
                        setModalVisible(true)
                        setAlertMessage(firstError[0]);
                        setSaving(false);
                    }
                }
            )

    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.content}>
                    <View style={styles.emailContainer}>
                        <Input
                            label='Email'
                            value={email}
                            onChangeText={text => { onChangeEmail(text) }}
                            editable={!isEmailVerified ? true : false}
                            style={styles.input}
                        />
                        {!isEmailVerified &&
                            <Text style={styles.unverifyText}>unverified</Text>
                        }
                    </View>
                    {!isEmailVerified &&
                        <Text style={styles.verifyText} onPress={goToVerifyEmailScreen}>Your email is not verified. Please, CLICK to verify your email!</Text>
                    }
                    <Input
                        label='Username'
                        value={username}
                        onChangeText={text => { onChangeUsername(text) }}
                        error={usernameErr && '*username cannot include space'}
                    />

                    <>
                        <Text style={styles.inputLabel} >phone number</Text>
                        <View style={styles.phonePicker}>
                            <Pressable
                                onPress={() => setShow(true)}
                                style={styles.codeButton}
                                disabled
                            >
                                <Text style={styles.countryCodeDigit}>
                                    {countryCode}
                                </Text>
                                <Ionicons name="caret-down-outline" size={14} color="#00000080" />
                            </Pressable>
                            <TextInput
                                style={styles.phoneNumberInput}
                                value={phoneNumber}
                                onChangeText={text => { onChangePhoneNumber(text) }}
                                error={phoneNumberErr && '*input a valid phone number'}
                                type="phone"
                                maxLength={12}
                                keyboardType='numeric'
                                editable={false}

                            />
                        </View>
                    </>

                    <CountryPicker
                        show={show}
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
                        value={firstName}
                        onChangeText={text => { onChangeFirstName(text) }}
                        error={firstNameErr && '*first name must not be empty'}
                        editable={false}
                    />
                    <Input
                        label='Last name'
                        value={lastName}
                        onChangeText={text => { onChangeLastName(text) }}
                        error={lastNameErr && '*last name must not be empty'}
                        editable={false}
                    />


                    <View style={styles.detail}>

                        {!showDatePicker ?
                            <Input
                                label='Date of Birth'
                                value={dateOfBirth.toDateString()}
                                onPressIn={() => setShowDatePicker(true)}
                            />

                            :
                            <>
                                <Text style={styles.inputLabel}>Date of Birth</Text>
                                <DateTimePicker
                                    value={dateOfBirth}
                                    mode={"date"}
                                    display="default"
                                    onChange={onChangeDateOfBirth}
                                    maximumDate={new Date(2003, 0, 1)}
                                    style={styles.dateOfBirth}
                                    textColor='#00000080'
                                />
                            </>
                        }
                        <View style={styles.genderContainer}>
                            <Text style={styles.bankLabel}>Choose gender</Text>
                            <SelectList
                                setSelected={(gender) => setGender(gender)}
                                data={genderData}
                                save="value"
                                placeholder="Select gender"
                                fontFamily='sansation-regular'
                                boxStyles={{ height: normalize(52), alignItems: 'center', borderColor: '#D9D9D9', backgroundColor: '#fff' }}
                                inputStyles={{ fontSize: 18, color: '#072169' }}
                            />
                        </View>

                    </View>
                </View>
                <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                    textLabel={alertMessage} buttonLabel='Ok, got it'
                    alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} />
            </ScrollView>
            <AppButton
                text={saving ? 'Saving' : 'Save Changes'}
                onPress={onSavePersonalDetails}
                disabled={!canSave || saving}
                style={styles.saveButton}
                disabledStyle={styles.disabled}
            />
        </View>
    );
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(20),
    },
    contentContainer: {
        paddingTop: normalize(20),
    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        fontSize: '0.76rem',
        marginBottom: normalize(8)
    },
    dateOfBirth: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: normalize(6),
        width: normalize(285),
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#00000080',
        marginRight: 'auto',
    },
    emailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    verifyText: {
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
        fontSize: '0.76rem',
        marginBottom: normalize(8)
    },
    unverifyText: {
        fontFamily: 'graphik-medium',
        color: '#FFF',
        fontSize: '0.65rem',
        marginBottom: normalize(8),
        backgroundColor: '#EF2F55',
        paddingHorizontal: normalize(8),
        borderRadius: 15,
        paddingVertical: normalize(3),
    },
    detail: {
        marginVertical: normalize(10)
    },
    select: {
        color: '#000000B2',
        borderWidth: 1,
        borderColor: '#CDD4DF',
        backgroundColor: "#ebeff5",
    },
    pickerItem: {
        fontSize: '0.75rem',
    },
    saveButton: {
        marginVertical: 10,
    },
    phonePicker: {
        flexDirection: 'row',
        height: normalize(38),
        alignItems: 'center',
        marginBottom: '.8rem'
    },
    phoneNumberInput: {
        fontFamily: 'graphik-regular',
        color: '#00000080',
        fontSize: '0.75rem',
        marginLeft: '.5rem'
    },
    countryCodeDigit: {
        fontFamily: 'graphik-regular',
        color: '#00000080',
        fontSize: '0.75rem',
        marginRight: '.2rem'
    },
    codeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderRightWidth: 1,
    },
    genderContainer: {
        marginBottom: normalize(35),
        marginTop: normalize(10),
    },
    bankLabel: {
        fontFamily: 'gotham-medium',
        color: '#072169',
        fontSize: '0.98rem',
        marginBottom: '.6rem'
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
});
