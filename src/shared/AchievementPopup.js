import * as React from 'react';
import { Platform, Pressable, Text, View, Modal, Alert } from 'react-native';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';


const AchievementPopup = ({ setAchievementPopup, achievementPopup }) => {
    const navigation = useNavigation();
    const [achievement, setAchievement] = React.useState({});
    const user = useSelector(state => state.auth.user);
    const achievementBadges = useSelector(state => state.achievementSlice)

    const goToStore = async () => {
        await analytics().logEvent('buy_now_button_on_boostpopup_clicked', {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        });
        navigation.navigate('GameStore')
    }

    // listen for changes and prompt alert
    React.useEffect(()=>{
        // code to check
        // console.log('reached')
        if((achievementBadges.mine).length != 0){
            const newAchievement = (achievementBadges.mine).find(val => ( (val.is_claimed == "1") && (val.is_rewarded == "1") && (val.is_notified == "0") ) );
            if(newAchievement != undefined){
                setAchievement(newAchievement);
                setAchievementPopup(true);
            }

        }
    }, [achievementBadges])
    return (
        <View style={styles.onView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={achievementPopup}
                onRequestClose={() => {
                    // Alert.alert("Modal has been closed.");
                    setAchievementPopup(!achievementPopup);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.container}>
                        <View style={styles.modalView}>
                            <Pressable
                                style={styles.buttonClose}
                                onPress={() => setAchievementPopup(!achievementPopup)}
                            >
                                <Text style={styles.closeModal}> close x </Text>
                            </Pressable>
                            <Text style={styles.achievementTitle}>{achievement?.title || ""}</Text>
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.image}
                                    source={require("../../assets/images/achievement.png")}
                                />
                            </View>
                            <Text style={styles.congratulatoryText}>
                                {achievement?.description || ""}
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default AchievementPopup;
const styles = EStyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        backgroundColor: '#151C2F',
        marginTop: 100,
        paddingHorizontal: normalize(25),
        paddingVertical: normalize(18),
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
    // container: {
    //     paddingHorizontal: normalize(25),
    //     paddingVertical: normalize(18),
    // },
    closeModal: {
        display: 'flex',
        marginLeft: 'auto',
        marginBottom: normalize(2),
        color: '#fff',
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular'
    },
    achievementTitle: {
        fontSize: '1.5rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginBottom: normalize(8),
        textAlign: 'center',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 4,
        textShadowColor: 'rgba(255, 255, 255, 0.25)'
    },

    imageContainer: {
        alignItems: 'center',
        marginBottom:'1rem'
    },
    image: {
        width: 200,
        height: 200,
    },
    congratulatoryText: {
        textAlign: 'center',
        width: '16.5rem',
        fontSize: '.8rem',
        fontFamily: 'graphik-medium',
        color: '#FFF',
        lineHeight: '1.5rem',
        paddingVertical: '.65rem',
    }
});
