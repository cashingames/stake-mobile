import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DatePicker from 'react-native-date-picker'
// import SelectDropdown from 'react-native-select-dropdown'
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderBack from '../components/HeaderBack';
import DetailInput from '../components/DetailInput';

export default function EditDetails({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.headerBack}>
                        <HeaderBack onPress={() => navigation.navigate('UserProfile')} />
                        <Text style={styles.headerTextStyle}>Edit Details</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.saveChanges}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <DetailsInput />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const DetailsInput = () => {
    const genders = ["Male", "Female"]
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState(new Date())

    return (
        <View>
            <DetailInput
                inputLabel='First name'
                value={firstname}
                onChange={setFirstname}
                style={styles.input}
            />
            <DetailInput
                inputLabel='Last name'
                value={lastname}
                onChange={setLastname}
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
                value={phone}
                onChange={setPhone}
                maxLength={11}
                keyboardType='numeric'
                style={styles.input}
            />
            <DetailInput
                inputLabel='Email'
                value="arunajoy2602@gmail.com"
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
        // marginVertical: normalize(20)
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
    },
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(25),
        marginBottom: normalize(20)

    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
        justifyContent: 'space-between'
    },
    headerBack: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    detail: {
        marginVertical: normalize(10)
    },
    saveChanges: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    inputLabel: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: normalize(5)
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
    }

});
