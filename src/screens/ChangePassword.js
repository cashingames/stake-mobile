import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DatePicker from 'react-native-date-picker'
// import SelectDropdown from 'react-native-select-dropdown'
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNextButton from '../components/AppNextButton';
import HeaderBack from '../components/HeaderBack';
import DetailInput from '../components/DetailInput';

export default function ChangePassword({ navigation }) {
    const [email, setEmail] = useState('');
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('UserProfile')} />
                    <Text style={styles.headerTextStyle}>Change Password</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.text}>Enter email associated with your account and we will
                        send an email with instructions to reset your password
                    </Text>
                    <DetailInput
                        inputLabel='Email Address'
                        value={email}
                        onChange={setEmail}
                        style={styles.input}
                    />
                    <View style={styles.submitButton}>
                        <AppNextButton onPress={() => navigation.navigate('SetNewPassword')} text='Submit' />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
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
    },
    text: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#000000',
        opacity: 0.4,
        lineHeight: 22
    },
    submitButton: {
        marginTop: normalize(250)
    }

});
