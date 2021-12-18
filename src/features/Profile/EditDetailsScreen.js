import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DatePicker from 'react-native-date-picker'
// import SelectDropdown from 'react-native-select-dropdown'
import normalize from '../../utils/normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import DetailInput from '../../shared/DetailInput';

export default function EditDetailsScreen({ navigation }) {

    return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                <TouchableOpacity>
                        <Text style={styles.saveChanges}>Save Changes</Text>
                    </TouchableOpacity>
                    <DetailsInput />
                </View>
            </ScrollView>
    );
}

const DetailsInput = () => {
    const user = useSelector(state => state.auth.user)

    const genders = ["Male", "Female"]
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [username, setUsername] = useState(user.username);
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    const [gender, setGender] = useState('');
    const [date, setDate] = useState(new Date())

    return (
        <View>
            <DetailInput
                inputLabel='First name'
                value={firstName}
                onChange={setFirstName}
                style={styles.input}
            />
            <DetailInput
                inputLabel='Last name'
                value={lastName}
                onChange={setLastName}
                style={styles.input}
            />
            <DetailInput
                inputLabel='Username'
                value={username}
                onChange={setUsername}
                style={styles.input}
            />
            {/* <SelectDropdown
                data={genders}
                onSelect={setGender}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    return item
                }}
            /> */}
            <DetailInput
                inputLabel='Phone number'
                value={phoneNumber}
                onChange={setPhoneNumber}
                maxLength={11}
                keyboardType='numeric'
                style={styles.input}
            />
            <DetailInput
                inputLabel='Email'
                value={email}
                onChange={setEmail}
                editable={false}
                style={styles.email}
            />
        </View>
    )
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
    email: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        padding: normalize(6),
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#535761',
        opacity: 0.5
    }

});
