import * as React from 'react';
import { Text, View, ScrollView, Share, Alert, Pressable, Platform, Modal } from 'react-native';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Image } from 'react-native';
import TopIcons from '../shared/TopIcons';
import { ImageBackground } from 'react-native';

const NetworkModal = ({ showModal, setShowModal, onPress }) => {
    
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
                                <Text style={styles.modalTitle}>Poor Connection</Text>
                                <View style={styles.imgContainer}>
                                    <Image style={styles.networkImage} resizeMode="contain" source={require('./../../assets/images/poor-network.png')} />
                                </View>
                                <Pressable style={styles.btn}
                                onPress={onPress}>
                                        <ImageBackground style={styles.btnBg} resizeMode="contain" source={require('./../../assets/images/button-case.png')} >
                                            <Text style={styles.btnText}>Try{'\n'}Again</Text>
                                        </ImageBackground>
                                    </Pressable>
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


export default NetworkModal;

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
        alignItems: 'center',
        height: responsiveHeight(40),
        width: responsiveWidth(80)
    },
    modalTitle: {
        color: '#fff',
        fontSize: '1.4rem',
        marginTop: responsiveHeight(100) * 0.02,
        fontFamily: 'poppins',
    },
    imgContainer:{
        alignItems:'center',
    },
    networkImage:{
        height: 200,
        width: 200
    },
    closeBtn: {
        position: 'absolute',
        left: responsiveWidth(65),
        top: responsiveHeight(-2),
    },
    closeIcon: {
        width: 40,
        height: 40,
    },
    btnBg: {
        height: responsiveHeight(20),
        width: responsiveWidth(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        position: 'absolute',
        top: responsiveHeight(29),
        zIndex: 10
    },
    btnText: {
        color: '#A92101',
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        textAlign:'center'
    },
});