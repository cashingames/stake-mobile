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

export default function BankDetails({ navigation }) {

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
    const banks = []
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');

    return (
        <View>
            <DetailInput
                inputLabel='Account Number'
                value={accountNumber}
                onChange={setAccountNumber}
                style={styles.input}
            />
            <DetailInput
                inputLabel='Name on Account'
                value={accountName}
                onChange={setAccountName}
                style={styles.input}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
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
        justifyContent: 'space-between',
        backgroundColor: '#FFFF',
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
