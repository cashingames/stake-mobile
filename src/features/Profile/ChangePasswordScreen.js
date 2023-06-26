import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Alert, Pressable, Platform } from 'react-native';
import { unwrapResult } from '@reduxjs/toolkit';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import normalize from '../../utils/normalize';
import AppButton from '../../shared/AppButton';
import Input from '../../shared/Input';
import { changePassword, deleteUserAccount, logoutUser } from '../Auth/AuthSlice';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import DeleteAccount from '../../shared/DeleteAccount';
import CustomAlert from '../../shared/CustomAlert';


export default function ChangePasswordScreen({ navigation }) {
    const dispatch = useDispatch();

    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [password, setPassword] = useState(Constants.expoConfig.extra.isStaging ? '123456789' : '');
    const [new_password, setNewPassword] = useState(Constants.expoConfig.extra.isStaging ? '12345678' : '');
    const [new_password_confirmation, setConfirmPassword] = useState(Constants.expoConfig.extra.isStaging ? '12345678' : '');
    const [passErr, setPassError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    const startModal = () => {
        setVisible(true)
        setModalVisible(true)
    }

    const refRBSheet = useRef();

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }


    const deleteAccount = () => {
        dispatch(deleteUserAccount())
            .then(() => {
                dispatch(logoutUser())
            })
    }

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
        dispatch(changePassword({ password, new_password, new_password_confirmation }))
            .then(unwrapResult)
            .then(result => {
                startModal()
                setAlertMessage('Password changed successfully');
                // navigation.navigate("Home")
            })
            .catch((rejectedValueOrSerializedError) => {
                setSaving(false);
                setCanSave(true);
                startModal()
                setAlertMessage('Invalid data provided');
            });
    }
    return (
        <View style={styles.container}>
            <ScrollView>
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
                <Pressable style={styles.deleteContainer} onPress={openBottomSheet}>
                    <Text style={styles.deleteText}>Delete Account</Text>
                </Pressable>
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={Platform.OS === 'ios' ? 300 : 250}
                    subComponent={<DeleteAccount
                        onClose={closeBottomSheet}
                        onPressYes={deleteAccount}
                    />}
                />
                <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                    visible={visible} setVisible={setVisible} textLabel={alertMessage} buttonLabel='Ok, got it'
                    alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} />
            </ScrollView>
            <AppButton
                text={saving ? 'Saving' : 'Change Password'}
                onPress={onSavePassword}
                disabled={!canSave}
                style={styles.saveButton}
            />
        </View>
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
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(25),
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
    deleteContainer: {
        marginTop: normalize(15)
    },
    deleteText: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
    },
    saveButton: {
        marginVertical: 10,
    }

});
