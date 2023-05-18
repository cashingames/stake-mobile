import * as React from 'react';
import { Pressable, Text, View, Modal, Alert, ImageBackground } from 'react-native';
import normalize, { responsiveHeight, responsiveScreenWidth, responsiveWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Image } from 'react-native';
import Constants from 'expo-constants';
import { useSelector } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import useSound from '../utils/useSound';
import TopIcons from './TopIcons';


const AchievementPopup = ({ setAchievementPopup, achievementPopup }) => {
    const [achievement, setAchievement] = React.useState({});
    const user = useSelector(state => state.auth.user);
    const achievementBadges = useSelector(state => state.achievementSlice)
    const { playSound } = useSound(require('../../assets/sounds/achievement-unlocked1.wav'))


    // listen for changes and prompt alert
    React.useEffect(() => {
        // code to check
        console.log(achievementBadges.mine)
        if ((achievementBadges.mine).length != 0) {
            const newAchievement = (achievementBadges.mine).find(val => ((val.is_claimed == "1") && (val.is_notified == "0")));
            if (newAchievement != undefined) {
                setAchievement(newAchievement);
                setAchievementPopup(true)
                analytics().logEvent(`${newAchievement.title.replace(/\s/g, '_').toLowerCase()}_badge`, {
                    'achievement_title': newAchievement.title,
                    'user_id': user.username,
                })
            }
        }
    }, [achievementBadges])

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={achievementPopup}
                onRequestClose={() => {
                    setAchievementPopup(!achievementPopup);
                }}
            >
                <View style={styles.centeredView}>
                    <TopIcons />
                    <View style={styles.container}>
                        <View>
                            <ImageBackground style={styles.achievementBg} resizeMode="contain" source={require('./../../assets/images/invite-bg.png')}>
                                <Text style={styles.modalTitle}>{achievement?.title || ""}Good starter</Text>
                                <View style={styles.imgContainer}>
                                    <Image
                                        style={styles.achievementImage}
                                        source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${achievement?.quality_image || achievement?.medal || achievement?.logoUrl}` }}
                                    />
                                </View>
                                <Text style={styles.congratulatoryText}>
                                    Congrats on your new badge.
                                </Text>
                                <Text style={styles.congratulatoryText}> You've earned {(achievement.rewardType === "POINTS") ? "" : ""}
                                    <Text style={styles.prize}>{achievement.reward}50 {(achievement.rewardType === "POINTS") ? "coins!" : "coins!"}</Text>
                                </Text>

                                <Pressable style={styles.closeBtn}
                                    onPress={() => setAchievementPopup(false)}
                                >
                                    <Image style={styles.closeIcon} source={require('./../../assets/images/close-icon.png')} />
                                </Pressable>
                            </ImageBackground>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default AchievementPopup;

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
    achievementBg: {
        paddingVertical: '2rem',
        paddingHorizontal: '2rem',
        alignItems: 'center',
        height: responsiveHeight(35),
        width: responsiveWidth(65)
    },
    modalTitle: {
        color: '#fff',
        fontSize: '1.4rem',
        marginTop: responsiveHeight(100) * 0.001,
        fontFamily: 'blues-smile',
        textAlign: 'center'
    },
    imgContainer: {
        alignItems: 'center',
        marginVertical: responsiveHeight(100) * 0.03
    },
    achievementImage: {
        height: 100,
        width: 100
    },
    congratulatoryText: {
        fontFamily: 'poppins',
        fontSize: '0.8rem',
        textAlign: 'center',
        color: '#fff'
    },
    prize: {
        color: '#FFD600',
        fontFamily: 'blues-smile'
    },
    closeBtn: {
        position: 'absolute',
        left: responsiveWidth(55),
        top: responsiveHeight(-1),
    },
    closeIcon: {
        width: 40,
        height: 40,
    },
});