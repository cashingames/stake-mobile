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

const InviteFriendsScreen = ({ showInviteFriends, setShowInviteFriends }) => {

    const navigation = useNavigation()
    const user = useSelector(state => state.auth.user);

    const referralUrl = (user.referralCode)
    const referralMsg = `Play exciting games with me on Gameark! Create an account with my referral code - ${referralUrl}`
    const [refreshing, setRefreshing] = React.useState(false);
    const isTourActive = useSelector(state => state.tourSlice.isTourActive);

    const dispatch = useDispatch()

    useApplyHeaderWorkaround(navigation.setOptions);


    const handleTourStop = () => {

        // end tour
        try {
            dispatch(clearTour())
            navigation.popToTop()
            navigation.navigate("AppRouter")
        } catch (e) {
            navigation.navigate("AppRouter")
        }
    }

    const onShare = async () => {
        try {
            await Share.share({
                message: referralMsg,
            });
            await analytics().logEvent("share_referral", {
                'id': user.username,
            })

        } catch (error) {
            Alert.alert("Notice", error.message);
        }
    };

    return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showInviteFriends}
                    onRequestClose={() => {
                        setShowInviteFriends(!showInviteFriends);
                    }}
                >
                    <View style={styles.centeredView}>
                        <TopIcons />
                        <View style={styles.inviteFriendsContainer}>
                            <View>
                                <ImageBackground style={styles.inviteBg} resizeMode="contain" source={require('./../../assets/images/invite-bg.png')}>
                                    <Text style={styles.modalTitle}>Play with friends!</Text>
                                    <View>
                                        <Image style={{ height: 85, width: 112, marginVertical: 10 }} source={require('./../../assets/images/heart-icon.png')} />
                                    </View>
                                    <Text style={styles.giftTitle}>Free 2 Lives!</Text>
                                    <Text style={styles.inviteText}>Invite your {'\n'}
                                        friends to get</Text>
                                    <Text style={styles.gift}>FREE 2 Lives!</Text>

                                    <Pressable style={styles.btn}
                                        onPress={onShare}
                                    >
                                        <ImageBackground style={styles.btnBg} resizeMode="contain" source={require('./../../assets/images/button-case.png')} >
                                            <Text style={styles.btnText}>Invite</Text>
                                        </ImageBackground>
                                    </Pressable>

                                    <Pressable style={styles.closeBtn}
                                        onPress={() => setShowInviteFriends(false)}
                                    >
                                        <Image style={styles.closeIcon} source={require('./../../assets/images/close-icon.png')} />
                                    </Pressable>
                                    <Image style={styles.friendImage} resizeMode="contain" source={require('./../../assets/images/friend.png')} />
                                </ImageBackground>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
    );
}


export default InviteFriendsScreen;

const styles = EStyleSheet.create({
    centeredView: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        backgroundColor: 'rgba(17, 41, 103, 0.77)'
    },

    inviteFriendsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inviteBg: {
        paddingVertical: normalize(15),
        paddingHorizontal: '0.5rem',
        alignItems: 'center',
        height: responsiveHeight(50),
        width: responsiveWidth(80)
    },
    modalTitle: {
        color: '#fff',
        fontSize: '1.7rem',
        marginVertical: responsiveHeight(100) * 0.02,
        fontFamily: 'graphik-medium',
    },
    giftTitle: {
        color: '#fff',
        fontSize: '1.5rem',
        marginTop: normalize(5),
        fontFamily: 'graphik-medium',
        marginBottom: normalize(10)
    },
    inviteText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium',
    },
    gift: {
        color: '#FFBB4F',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium'
    },
    btnBg: {
        height: responsiveHeight(20),
        width: responsiveWidth(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        position: 'absolute',
        top: responsiveHeight(38),
        zIndex: 10
    },
    btnText: {
        color: '#A92101',
        fontSize: '1.4rem',
        fontFamily: 'blues-smile'
    },
    closeBtn: {
        position: 'absolute',
        left: responsiveWidth(70),
        top: responsiveHeight(-2),
    },
    closeIcon: {
        width: 50,
        height: 50,
    },
    friendImage: {
        position: 'absolute',
        left: responsiveWidth(53),
        top: responsiveHeight(15),
        height: responsiveHeight(30),
        width: responsiveWidth(35),
    }
});
