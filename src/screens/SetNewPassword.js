import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNextButton from '../components/AppNextButton';
import HeaderBack from '../components/HeaderBack';
import UserPassword from '../components/UserPassword';


export default function SetNewPassword({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('ChangePassword')} />
                    <Text style={styles.headerTextStyle}>Set New Password</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.submitButton}>
                        <PasswordInputs />
                        <PasswordRequirement />
                    </View>
                    <AppNextButton onPress={() => navigation.navigate('Dashboard')} text='Change Password' />
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}
const PasswordInputs = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureType, setSecureType] = useState(true);
    const toggleSecureText = () => {
        secureType ? setSecureType(false) : setSecureType(true)
    }
    return (
        <>
            <UserPassword
                inputLabel='Enter Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureType}
                onPress={toggleSecureText}
                secureStyle={styles.passwordIcon}
            />
            <UserPassword
                inputLabel='New Password'
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={secureType}
                onPress={toggleSecureText}
                secureStyle={styles.passwordIcon}
            />
            <UserPassword
                inputLabel='Confirm New Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureType}
                onPress={toggleSecureText}
                secureStyle={styles.passwordIcon}
            />
        </>
    )
}

const PasswordRequirement = () => {
    return (
        <View>
            <Text style={styles.requirementTitle}>Password Requirements</Text>
            <Text style={styles.requirement}>Minimum of 8 characters</Text>
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
        marginBottom: normalize(140)
    },
    passwordIcon: {
        left: '100%',
        top: '50%',
        transform: [{ translateY: normalize(-8) }],
        position: 'absolute',
        zIndex: 2,

    },
    requirementTitle: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        color: '#000000',
        marginBottom: normalize(8)
    },
    requirement: {
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#000000',
        opacity: 0.4,
    },

});
