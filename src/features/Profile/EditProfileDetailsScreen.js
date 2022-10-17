import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Alert, Pressable, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CountryPicker from "react-native-country-codes-picker";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../../shared/Input';
import { Ionicons } from "@expo/vector-icons";
import { editPersonalDetails, getUser } from '../Auth/AuthSlice';
import normalize from '../../utils/normalize';
import { isTrue } from '../../utils/stringUtl';
import AppButton from '../../shared/AppButton';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';

export default function EditProfileDetailsScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    console.log(user)

    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [username, setUsername] = useState(user.username);
    const [firstNameErr, setFirstNameError] = useState(false);
    const [lastNameErr, setLastNameError] = useState(false);
    const [phoneNumberErr, setPhoneNumberError] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(isTrue(user.dateOfBirth) ? new Date(Date.parse(user.dateOfBirth)) : new Date(2003, 0, 1));
    const [gender, setGender] = useState(user.gender);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState(user.countryCode);

    const onChangeDateOfBirth = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setDateOfBirth(currentDate);
        setShowDatePicker(false);
    };

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

    useEffect(() => {
        const invalid = firstNameErr || firstName === '' || lastNameErr || lastName === '' ||
            phoneNumber === '' || phoneNumberErr;
        setCanSave(!invalid);
    }, [firstNameErr, firstName, lastNameErr, lastName, phoneNumber, phoneNumberErr])

    const onSavePersonalDetails = () => {
        setSaving(true);
        dispatch(editPersonalDetails({
            firstName,
            lastName,
            // phoneNumber,
            dateOfBirth,
            gender
        }))
            .then(unwrapResult)
            .then(result => {
                dispatch(getUser())
                Alert.alert('Personal details updated successfully')
                navigation.navigate("UserProfile")
            })
            .catch((rejectedValueOrSerializedError) => {
                if (rejectedValueOrSerializedError.message === "Request failed with status code 422") {
                    Alert.alert('The phone number has already been taken')
                }
                else {
                    Alert.alert("Could not update profile, Please try again later.");
                }
                console.log(rejectedValueOrSerializedError.message);
                setSaving(false);
                // after login eager get commond data for the whole app
                // console.log("failed");
                // console.log(rejectedValueOrSerializedError.message);
            });
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Input
                        label='Username'
                        value={username}
                        onChangeText={setUsername}
                        editable={false}
                    />
                    <Input
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
                        editable={false}
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
                    />
                    <Input
                        label='Last name'
                        value={lastName}
                        onChangeText={text => { onChangeLastName(text) }}
                        error={lastNameErr && '*last name must not be empty'}
                    />
                    {/* <Input
                        label='Phone number'
                        value={phoneNumber}
                        onChangeText={text => { onChangePhoneNumber(text) }}
                        error={phoneNumberErr && '*input a valid phone number'}
                        type="phone"
                        maxLength={11}
                        keyboardType='numeric'
                    /> */}


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

                        <View style={styles.detail}>
                            <Text style={styles.inputLabel}>Select Gender</Text>
                            <Picker
                                selectedValue={gender}
                                onValueChange={(itemValue, itemIndex) =>
                                    setGender(itemValue)
                                }
                                mode='dropdown'
                                style={styles.select}
                            >
                                <Picker.Item label="Male" value="male" style={styles.pickerItem} />
                                <Picker.Item label="Female" value="female" style={styles.pickerItem} />
                            </Picker>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <AppButton
                text={saving ? 'Saving' : 'Save Changes'}
                onPress={onSavePersonalDetails}
                disabled={!canSave}
                style={styles.saveButton} />
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
        marginBottom:'.8rem'
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
        marginRight:'.2rem'
    },
    codeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderRightWidth: 1,
    }
});
