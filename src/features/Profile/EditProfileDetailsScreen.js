import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import normalize from '../../utils/normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../shared/Input';
import { editPersonalDetails } from '../Auth/AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { getUser } from "../Auth/AuthSlice";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProfileDetailsScreen({ navigation }) {
    const user = useSelector(state => state.auth.user)
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [username, setUsername] = useState(user.username);
    const [dateOfBirth, setDateOfBirth] = useState(new Date(Date.parse(user.dateOfBirth)));
    const [gender, setGender] = useState(user.gender);
    useEffect(() => {
        // let msec = Date.parse(user.dateOfBirth);
        // const d = Date.now();
        // setDateOfBirth(new Date(d))
        console.log(dateOfBirth);
    }, [dateOfBirth]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        // setShow(Platform.OS === 'ios');
        setDateOfBirth(currentDate);
    };
    const dispatch = useDispatch();

    const onSavePersonalDetails = () => {
        setSaving(true);
        console.log(firstName + 'fish')
        dispatch(editPersonalDetails({
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            gender
        }))
            .then(unwrapResult)
            .then(result => {
                console.log(result);
                console.log("success");
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
                        style={styles.editable}
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
                        style={styles.editable}
                    />
                    <View style={styles.detail}>
                        <Text style={styles.inputLabel}>Date of Birth</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={dateOfBirth}
                            mode={"date"}
                            display="default"
                            onChange={onChange}
                            minimumDate={new Date(2003, 0, 1)}

                            style={styles.date}
                            textColor='#00000080'
                        />
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
    date: {
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
    editable: {
        height: normalize(38),
        borderWidth: normalize(1),
        borderRadius: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#535761',
        opacity: 0.3
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
