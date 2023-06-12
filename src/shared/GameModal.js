import * as React from 'react';
import { Text, View, ScrollView, Share, Alert, Pressable, Platform, Modal } from 'react-native';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveWidth } from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import useApplyHeaderWorkaround from '../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../shared/LottieAnimations';
// import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
// import { Walkthroughable } from '../features/Tour/Walkthrouable';
import { clearTour } from '../features/Tour/TourSlice';
import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/core';
import { Image } from 'react-native';
import TopIcons from '../shared/TopIcons';
import { ImageBackground } from 'react-native';
import Input from './Input';
import { useState } from 'react';

const GameModal = ({ showModal, setShowModal, title, modalBody, btnText, multipleBtn = false, btnHandler, btnHandler_2, btnText_2, inputBox = false }) => {

    const navigation = useNavigation()
    const user = useSelector(state => state.auth.user);
    const [referrer, setReferrer] = useState('');
    const onChangeReferral = (text) => {
        setReferrer(text)
    }

    const dispatch = useDispatch()

    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    setShowModal(!showModal);
                }}
            >
                <View style={styles.centeredView}>
                    <TopIcons />
                    <View style={styles.container}>
                        <View>
                            <ImageBackground style={styles.inviteBg} resizeMode="contain" source={require('./../../assets/images/invite-bg.png')}>
                                {title && <Text style={styles.modalTitle}>{title}</Text>}
                                <View style={styles.modalBodyContainer}>
                                    <Text style={styles.modalBody}>{modalBody}</Text>
                                </View>
                               {inputBox && <View style={styles.inputContainer}>
                                <Input
                                    label='Referral'
                                    value={referrer}
                                    type="text"
                                    // error={uNameErr && 'username is not valid'}
                                    labelStyle={styles.label}
                                    onChangeText={text => onChangeReferral(text)}
                                />
                                </View>}
                                <View style={styles.btnContainer}>
                                    <Pressable style={styles.btn} onPress={btnHandler}>
                                        <ImageBackground style={styles.btnBg} resizeMode="contain" source={require('./../../assets/images/button-case.png')} >
                                            <Text style={styles.btnText}>{btnText}</Text>
                                        </ImageBackground>
                                    </Pressable>
                                    {multipleBtn && <Pressable style={styles.btn} onPress={btnHandler_2}>
                                        <ImageBackground style={styles.btnBg} resizeMode="contain" source={require('./../../assets/images/button-case.png')} >
                                            <Text style={styles.btnText}>{btnText_2}</Text>
                                        </ImageBackground>
                                    </Pressable>}
                                </View>
                                <Pressable style={styles.closeBtn}
                                    onPress={() => setShowModal(false)}
                                >
                                    <Image style={styles.closeIcon} source={require('./../../assets/images/close-icon.png')} />
                                </Pressable>
                            </ImageBackground>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


export default GameModal;

const styles = EStyleSheet.create({
    centeredView: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        backgroundColor: 'rgba(17, 41, 103, 0.77)'
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inviteBg: {
        paddingVertical: normalize(15),
        paddingHorizontal: '2rem',
        // alignItems: 'center',
        height: responsiveHeight(35),
        width: responsiveWidth(80)
    },
    modalTitle: {
        color: '#fff',
        fontSize: '1.4rem',
        marginTop: responsiveHeight(100) * 0.02,
        fontFamily: 'poppins',
        textAlign: 'center'
    },
    modalBodyContainer:{
        alignItems: 'center',
    },
    modalBody: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '0.95rem',
        fontFamily: 'graphik-medium',
        marginVertical: '1rem',
        lineHeight: '1.5rem',
        width: responsiveWidth(50),
    },
    gift: {
        color: '#FFBB4F',
        textAlign: 'center',
        fontSize: '1.7rem',
        fontFamily: 'graphik-medium'
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
    },
    btnBg: {
        height: responsiveHeight(13),
        width: responsiveWidth(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {

    },
    btnText: {
        color: '#A92101',
        fontSize: '0.7rem',
        fontFamily: 'blues-smile'
    },
    closeBtn: {
        position: 'absolute',
        left: responsiveWidth(62),
        top: responsiveHeight(-2),
    },
    closeIcon: {
        width: 40,
        height: 40,
    },
    inputContainer:{
        paddingHorizontal: '2rem',
    },
    label:{
        textAlign:'center'
    }
});
