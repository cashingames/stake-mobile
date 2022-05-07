import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../shared/AppButton';
import Input from '../../shared/Input';
import { useDispatch } from 'react-redux';
import { changePassword } from '../Auth/AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { isStaging } from '../../utils/BaseUrl';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';


export default function ChangePasswordScreen({ navigation }) {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [password, setPassword] = useState(isStaging ? '123456789' : '');
    const [new_password, setNewPassword] = useState(isStaging ? '12345678' : '');
    const [new_password_confirmation, setConfirmPassword] = useState(isStaging ? '12345678' : '');
    const [passErr, setPassError] = useState(false);


    const onChangePassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setPassword(text)
    }
    const onChangeNewPassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setNewPassword(text)
    }
    const onChangeConfirmPassword = (text) => {
        text.length > 0 && text.length < 8 ? setPassError(true) : setPassError(false);
        setConfirmPassword(text)
    }
    useEffect(() => {
        const invalid = passErr || new_password_confirmation !== new_password || password === '' || new_password === '';
        setCanSave(!invalid);
    }, [passErr, new_password_confirmation, new_password, password])

    const onSavePassword = () => {

        setSaving(true);
        setCanSave(false);
        console.log(new_password + 'fish')
        dispatch(changePassword({ password, new_password, new_password_confirmation }))
            .then(unwrapResult)
            .then(result => {
                console.log(result);
                console.log("success");
                // dispatch(getUser())
                Alert.alert('Password changed successfully')
                navigation.navigate("Home")
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError);
                setSaving(false);
                setCanSave(true);
                Alert.alert('Invalid data provided')
                // after login eager get commond data for the whole app
                // console.log("failed");
                // console.log(rejectedValueOrSerializedError)
            });
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.submitButton}>
                        <>
                            <Input
                                type="password"
                                label='Old Password'
                                value={password}
                                placeholder="Enter password"
                                error={passErr && '*password must not be less than 8 digits'}
                                onChangeText={text => { onChangePassword(text) }}
                            />
                            <Input
                                type="password"
                                label='New Password'
                                value={new_password}
                                placeholder="Enter new password"
                                error={passErr && '*password must not be less than 8 digits'}
                                onChangeText={text => { onChangeNewPassword(text) }}
                            />
                            <Input
                                type="password"
                                label='Password'
                                value={new_password_confirmation}
                                placeholder="Confirm new password"
                                error={new_password_confirmation !== new_password && '*password confirmation must match password'}
                                onChangeText={text => { onChangeConfirmPassword(text) }}
                            />
                        </>
                        <PasswordRequirement />
                    </View>
                    <AppButton text={saving ? 'Saving' : 'Change Password'} onPress={onSavePassword} disabled={!canSave} />

                </View>
            </ScrollView>
        </SafeAreaView >
    );
}


const PasswordRequirement = () => {
    return (
        <View>
            <Text style={styles.requirementTitle}>Password Requirements</Text>
            <Text style={styles.requirement}>Minimum of 8 characters</Text>
        </View>
    )
}



const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
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
        fontSize: '0.76rem',
        fontFamily: 'graphik-medium',
        color: '#000000',
        marginBottom: normalize(8)
    },
    requirement: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#000000',
        opacity: 0.4,
    },

});
