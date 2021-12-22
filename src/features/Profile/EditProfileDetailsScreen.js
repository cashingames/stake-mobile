import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../../shared/Input';
import { editPersonalDetails, getUser } from '../Auth/AuthSlice';
import normalize from '../../utils/normalize';
import { isTrue } from '../../utils/stringUtl';

export default function EditProfileDetailsScreen({ navigation }) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user)

    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [username, setUsername] = useState(user.username);
    const [dateOfBirth, setDateOfBirth] = useState(isTrue(user.dateOfBirth) ? new Date(Date.parse(user.dateOfBirth)) : new Date(2003, 0, 1));
    const [gender, setGender] = useState(user.gender);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChangeDateOfBirth = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setDateOfBirth(currentDate);
        setShowDatePicker(false);
    };

    const onSavePersonalDetails = () => {
        setSaving(true);
        dispatch(editPersonalDetails({
            firstName,
            lastName,
            phoneNumber,
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
                console.log(rejectedValueOrSerializedError);
                setSaving(false);
                Alert.alert('Invalid data provided')
                // after login eager get commond data for the whole app
                // console.log("failed");
                // console.log(rejectedValueOrSerializedError)
            });
    }

    console.log(setShowDatePicker);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={onSavePersonalDetails}>
                    <Text style={styles.saveChanges}>{saving ? 'Saving' : 'Save Changes'}</Text>
                </TouchableOpacity>
                {/* <DetailsInput /> */}
                <View>
                    <Input
                        label='First name'
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <Input
                        label='Last name'
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    <Input
                        label='Username'
                        value={username}
                        onChangeText={setUsername}
                        editable={false}
                    />
                    <Input
                        label='Phone number'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        type="phone"
                        maxLength={11}
                        keyboardType='numeric'
                    />
                    <Input
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
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

                            <DateTimePicker
                                value={dateOfBirth}
                                mode={"date"}
                                display="default"
                                onChange={onChangeDateOfBirth}
                                minimumDate={new Date(2003, 0, 1)}
                                style={styles.dateOfBirth}
                                textColor='#00000080'
                            />
                        }
                    </View>
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
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
    },
    content: {
        marginHorizontal: normalize(18),
        marginVertical: normalize(10),
        marginBottom: normalize(20),
    },
    inputLabel: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: normalize(5)
    },
    saveChanges: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
        marginLeft: 'auto'
    },
    input: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        padding: normalize(6),
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#000000',

    },
    dateOfBirth: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: normalize(6),
        width: normalize(285),
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#00000080',
        marginRight: 'auto',
    },

    detail: {
        marginVertical: normalize(10)
    },
    select: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
    },
    pickerItem: {
        height: normalize(20)
    }

});
