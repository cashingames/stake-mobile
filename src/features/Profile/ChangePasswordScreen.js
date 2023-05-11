import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Alert, Pressable, Platform, Image, KeyboardAvoidingView } from 'react-native';
import { unwrapResult } from '@reduxjs/toolkit';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import AppButton from '../../shared/AppButton';
import Input from '../../shared/Input';
import { changePassword, deleteUserAccount, logoutUser } from '../Auth/AuthSlice';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import DeleteAccount from '../../shared/DeleteAccount';
import useSound from '../../utils/useSound';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GameArkLogo from '../../shared/GameArkLogo';
import GaButton from '../../shared/GaButton';
import { setModalOpen } from '../CommonSlice';
import AppHeader from '../../shared/AppHeader';
import TopIcons from '../../shared/TopIcons';
import GameModal from '../../shared/GameModal';


export default function ChangePasswordScreen({ navigation }) {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updateSuccessful, setUpdateSuccessful] = useState(false)
    const [canSave, setCanSave] = useState(false);
    const [password, setPassword] = useState(Constants.manifest.extra.isStaging ? '123456789' : '');
    const [new_password, setNewPassword] = useState(Constants.manifest.extra.isStaging ? '12345678' : '');
    const [new_password_confirmation, setConfirmPassword] = useState(Constants.manifest.extra.isStaging ? '12345678' : '');
    const [passErr, setPassError] = useState(false);
    const { playSound } = useSound(require('../../../assets/sounds/updated.mp3'))


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
                // console.log(result);
                // dispatch(getUser())
                playSound()
                setUpdateSuccessful(true)
                setShowModal(true)
                navigation.navigate("Home")
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                setUpdateSuccessful(false)
                setShowModal(true)
                setSaving(false);
                setCanSave(true);
                // Alert.alert('Invalid data provided')
                // after login eager get commond data for the whole app
                // console.log("failed");
                // console.log(rejectedValueOrSerializedError)
            });
    }
    return (
        <ScrollView >
            <MixedContainerBackground>
                <View style={styles.container}>
                    <TopIcons />
                    <AppHeader title="Change Password" />
                    <KeyboardAvoidingView style={styles.content}>
                        <Input
                            type="password"
                            label='Old Password'
                            value={password}
                            placeholder="Enter password"
                            error={passErr && '*password must not be less than 8 digits'}
                            onChangeText={text => { onChangePassword(text) }}
                            labelStyle={styles.inputLabel}
                        />
                        <Input
                            type="password"
                            label='New Password'
                            value={new_password}
                            placeholder="Enter new password"
                            error={passErr && '*password must not be less than 8 digits'}
                            onChangeText={text => { onChangeNewPassword(text) }}
                            labelStyle={styles.inputLabel}
                        />
                        <Input
                            type="password"
                            label='Password'
                            value={new_password_confirmation}
                            placeholder="Confirm new password"
                            error={new_password_confirmation !== new_password && '*password confirmation must match password'}
                            onChangeText={text => { onChangeConfirmPassword(text) }}
                            labelStyle={styles.inputLabel}
                        />
                        <PasswordRequirement />
                        <UniversalBottomSheet
                            refBottomSheet={refRBSheet}
                            height={Platform.OS === 'ios' ? 300 : 250}
                            subComponent={<DeleteAccount
                                onClose={closeBottomSheet}
                                onPressYes={deleteAccount}
                            />}
                        />
                        <GaButton
                            text={saving ? 'Saving' : 'Change Password'}
                            onPress={onSavePassword}
                            disabled={!canSave}
                            style={styles.saveButton}
                        />
                        <Pressable style={styles.deleteContainer} onPress={openBottomSheet}>
                            <Text style={styles.deleteText}>Delete Account</Text>
                        </Pressable>
                    </KeyboardAvoidingView>
                </View>
                <GameModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    title={updateSuccessful ? 'Update Successful!' : 'Update Failed😥'}
                    modalBody={updateSuccessful ? 'Password changed successfully' : "Sorry, Couldn't update password. Try again."}
                    btnText='Ok'
                    btnHandler={() => updateSuccessful ? navigation.goBack(null) : setShowModal(false)}
                />
            </MixedContainerBackground>
        </ScrollView>
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
        paddingVertical: normalize(25),
    },
    content: {
        paddingHorizontal: responsiveScreenWidth(3)
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
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '0.76rem',
        marginBottom: normalize(8)
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
        fontFamily: 'blues-smile',
        color: '#fff',
        marginBottom: normalize(8)
    },
    requirement: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#fff',
    },
    deleteContainer: {
        marginTop: normalize(15),
        alignItems: 'flex-end',
    },
    deleteText: {
        fontSize: '1rem',
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
    },
    saveButton: {
        marginVertical: 10,
    },
    settingIcon: {
        marginTop: responsiveScreenHeight(10),
        width: 50,
        height: 50
    },

});
