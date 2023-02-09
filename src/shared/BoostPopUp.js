import * as React from 'react';
import { Platform, Pressable, Text, View, Modal, Alert } from 'react-native';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';


const Boostspopup = ({ setModalVisible, modalVisible }) => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);

    const goToStore = async () => {
        await analytics().logEvent('buy_now_button_on_boostpopup_clicked', {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        });
        navigation.navigate('GameStore')
    }
    return (
        <View style={styles.onView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <LinearGradient
                        colors={['#151C2F', '#792592']}
                        style={styles.modalView}>
                        <View style={styles.container}>
                            <Pressable
                                style={styles.buttonClose}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Ionicons name="close" size={10} color="#fff" />
                            </Pressable>
                            <View style={styles.resultContainer}>
                                <Image
                                    source={require("../../assets/images/tag.png")}
                                />
                            </View>
                            <Text style={styles.modalTopText}>Power Ups</Text>
                            <View style={styles.resultContainer}>
                                <Image
                                    style={styles.hat}
                                    source={require("../../assets/images/boost-popup.png")}
                                />
                            </View>
                        </View>
                        <View style={styles.modalItems}>
                            <Text style={styles.infoText}>With time freeze, you get to pause the game for 15seconds and skip allows you jump a question</Text>
                            <Pressable style={styles.boost} onPress={goToStore}>
                                <Text style={styles.boostText}>Buy now</Text>
                            </Pressable>
                        </View>

                    </LinearGradient>

                </View>
            </Modal>
        </View>
    )
}
export default Boostspopup;
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
        textDecoration: 'underline',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        borderRadius: 10,
        shadowColor: "black",
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
        background: '#66142E',

    },
    buttonClose: {
        display: 'flex',
        marginLeft: 'auto',
        marginBottom: normalize(2),
        backgroundColor: '#FAC502',
        borderRadius: 100,
        width: '1rem',
        height: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
    closeStyle: {
        fontSize: '0.7rem',
        color: '#FFFF',
        alignItems: "center",
        justifyContent: 'center',
        // padding:1,
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
        fontSize: '.7rem',
        fontFamily: 'graphik-medium',
        lineHeight:'1rem',
        paddingVertical: '.65rem',  
    },
    resultContainer: {
        alignItems: 'center'
    },
    hat: {
        width: '11rem',
        height: '9.5rem',
    },
    modalItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: normalize(10)

    },
    boost: {
        backgroundColor: '#EF2F55',
        padding: '.3rem',
        borderRadius: 10,
        borderColor: '#66142E',
        borderWidth: 1,
        paddingHorizontal: '1.5rem',
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
    boostText: {
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
