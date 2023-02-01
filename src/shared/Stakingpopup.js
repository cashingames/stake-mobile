import * as React from 'react';
import { Platform, Pressable, Text, View, Modal, Image } from 'react-native';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setGameMode } from '../features/Games/GameSlice';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';



const Stakingpopup = ({ setModalVisible, modalVisible, gameModes }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const gameModeSelected = gameModes.find(mode => mode.name === 'STAKING')
    const user = useSelector(state => state.auth.user);

    const playStaking = async () => {
        setModalVisible(!modalVisible)
        dispatch(setGameMode(gameModeSelected));
        await analytics().logEvent('stake_cash_now_button_clicked', {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        });
        navigation.navigate('SelectGameCategory')
    }
    return (
        <View style={styles.onView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
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
                                <Ionicons name="close" size={10} color="#fff" />
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
                            <Pressable style={styles.stake} onPress={playStaking}>
                                <Text style={styles.stakeText}>
                                    Stake cash now
                                </Text>
                            </Pressable>
                        </View>

                    </View>

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
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
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
        width: '1rem',
        height: '1rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeStyle: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    modalItems: {
        marginTop: normalize(15),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAC502',
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        paddingTop: '.65rem',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    infoText: {
        textAlign: 'center',
        width: '15rem',
        fontSize: '.8rem',
        fontFamily: 'graphik-medium',
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: normalize(10)

    },
    stake: {
        backgroundColor: '#EF2F55',
        padding: '.3rem',
        borderRadius: 10,
        borderColor: '#66142E',
        borderWidth: 1,
        top: normalize(12),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
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
        marginBottom: normalize(8),
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