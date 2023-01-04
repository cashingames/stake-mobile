import * as React from 'react';
import { Platform, Pressable, Text, View, Modal } from 'react-native';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { formatCurrency } from '../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from './LottieAnimations';




const TopLeadersModal = ({setModalVisible, modalVisible}) => {
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
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.closeStyle}>Close x</Text>
                    </Pressable>
                    <Text style={styles.modalTopText}>Monthly Leaders Prizes</Text>
                    <View style={styles.resultContainer}>
                        <LottieAnimations
                            animationView={require('../../assets/leaderboard.json')}
                            width={normalize(170)}
                            height={normalize(170)}
                        />
                    </View>
                    <View style={styles.modalItems}>
                        <View style={styles.modalWinnerItem}>
                            <Text style={styles.winnerItemText}>Grand Prize</Text>
                            <Text style={styles.winnerItemText}>&#8358;{formatCurrency(5000)}</Text>

                        </View>
                        <View style={styles.modalItem}>
                            <Text style={styles.itemText}>2nd Prize</Text>
                            <Text style={styles.itemText}>&#8358;{formatCurrency(3000)}</Text>

                        </View>
                        <View style={styles.modalItem}>
                            <Text style={styles.itemText}>3rd Prize</Text>
                            <Text style={styles.itemText}>&#8358;{formatCurrency(2000)}</Text>

                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
    )
}
export default TopLeadersModal
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
        textDecoration:'underline'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#5d5fef',
        borderRadius: 20,
        paddingHorizontal: normalize(30),
        paddingVertical: normalize(18),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonClose: {
        marginLeft: 'auto',
        marginBottom: normalize(20)
    },
    closeStyle: {
        fontSize: '0.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    modalItems: {
        marginTop: normalize(25)
    },
    resultContainer: {
        alignItems: 'center'
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(10)

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
        marginBottom: normalize(10)
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