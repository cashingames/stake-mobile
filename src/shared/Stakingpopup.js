import * as React from 'react';
import { Platform, Pressable, Text, View, Modal } from 'react-native';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { formatCurrency } from '../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from './LottieAnimations';
import { Image } from 'react-native';




const Stakingpopup = ({ setModalVisible, modalVisible }) => {
    return (
        <View style={styles.onView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.container}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.closeStyle}>x</Text>
                            </Pressable>
                            <View style={styles.resultContainer}>
                                <Image
                                    source={require("../../assets/images/tag.png")}
                                />
                            </View>
                            <Text style={styles.modalTopText}>Winner Alert</Text>
                            <View style={styles.resultContainer}>
                                <Image
                                    style={styles.hat}
                                    source={require("../../assets/images/coin-hat.png")}
                                />
                            </View>
                        </View>
                        <View style={styles.modalItems}>
                            <Text style={styles.infoText}>A fellow Cashingamer just cashed out, stake cash now 🤑. and stand a chance to win big</Text>
                        </View>

                    </View>
                    <Pressable style={styles.stake} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.stakeText}>
                            Stake cash now
                        </Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}
export default Stakingpopup;
const styles = EStyleSheet.create({
    contentContainer: {
        display: 'flex',
        backgroundColor: '#5d5fef',
        flexDirection: 'column',
        paddingTop: responsiveScreenWidth(3.5),
        paddingHorizontal: responsiveScreenWidth(7),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        borderColor: Platform.OS === 'ios' ? '#E0E0E0' : '#FFFF'
    },
    prizeTitle: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        textDecoration: 'underline'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#66142E',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    container: {
        paddingHorizontal: normalize(25),
        paddingVertical: normalize(18),
    },
    buttonClose: {
        marginLeft: 'auto',
        marginBottom: normalize(2),
        backgroundColor: '#FAC502',
        borderRadius: 100,
        width: '.75rem',
        height: '.75rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeStyle: {
        fontSize: '0.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    modalItems: {
        marginTop: normalize(15),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAC502',
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        paddingTop: '.65rem',
        paddingBottom: '1.2rem',

    },
    infoText: {
        textAlign: 'center',
        width: '12rem',
        fontFamily: 'graphik-medium',
        lineHeight: '1rem'
    },
    resultContainer: {
        alignItems: 'center'
    },
    hat: {
        width: '11rem',
        height: '6.rem',
        marginTop: '1rem'
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(10)

    },
    stake: {
        backgroundColor: '#EF2F55',
        padding: '.3rem',
        borderRadius: 10,
        position: 'absolute',
        bottom: 230,
        borderColor: '#66142E',
        borderWidth: 1
    },
    stakeText: {
        fontSize: '0.65rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    modalWinnerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(18)
    },
    modalTopText: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginBottom: normalize(10),
        textAlign: 'center'
    },
    winnerItemText: {
        fontSize: '0.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    itemText: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: responsiveScreenWidth(4),
    },
    title: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    winner: {
        alignItems: 'center',
    },
    others: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 75
    },
    avatar: {
        width: normalize(55),
        height: normalize(55),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    otherAvatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '2rem'
    },
    viewText: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    stage: {
        width: normalize(88),
        height: normalize(88),
    },
    winnerStage: {
        width: normalize(98),
        height: normalize(98),
    },

});