import * as React from 'react';
import { Text, View, ScrollView, Share, Alert, Pressable, Platform, Modal } from 'react-native';
import normalize, { responsiveScreenHeight } from '../utils/normalize';
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
        console.log("tour stopped, going to next screen to continue....")

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
        <ScrollView style={styles.container}>
            <View style={styles.onView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showInviteFriends}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setShowInviteFriends(!showInviteFriends);
                    }}
                >
                    <View style={styles.centeredView}>
                        <TopIcons />
                        <View style={styles.inviteFriendsContainer}>
                            <View style={styles.inviteBg}>
                                <ImageBackground style={styles.inviteBg} source={require('./../../assets/images/invite-bg.png')}>
                                    <Text style={styles.modalTitle}>Play with friends!</Text>
                                    <View>
                                        <Image style={{height:85, width: 112, marginVertical: 10}} source={require('./../../assets/images/heart-icon.png')} />
                                    </View>
                                    <Text style={styles.giftTitle}>Free 2 Lives!</Text>
                                    <Text style={styles.inviteText}>Invite your {'\n'}
                                        friends to get</Text>
                                    <Text style={styles.gift}>FREE 2 Lives!</Text>
                                   
                                        <Pressable style={styles.btn}
                                        onPress={onShare}
                                        >
                                             <ImageBackground style={styles.btnBg} source={require('./../../assets/images/button-case.png')} >
                                            <Text style={styles.btnText}>Invite</Text>
                                            </ImageBackground>
                                        </Pressable>
                                  
                                     <Pressable style={styles.closeBtn}
                                        onPress={() => setShowInviteFriends(false)}
                                    >
                                        <Image style={styles.closeIcon} source={require('./../../assets/images/close-icon.png')} />
                                    </Pressable>
                                    <Image style={styles.friendImage} source={require('./../../assets/images/friend.png')} /> 
                                </ImageBackground>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>

    );
}


export default InviteFriendsScreen;

const styles = EStyleSheet.create({
    centeredView: {
        flex: 1,
        paddingVertical: responsiveScreenHeight(2),
        backgroundColor: 'rgba(17, 41, 103, 0.77)'
    },

    inviteFriendsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inviteBg: {
        paddingVertical: normalize(15),
        paddingHorizontal: '3rem',
        alignItems: 'center',
        height: normalize(376),
        width: normalize(311)
    },
    modalTitle: {
        color: '#fff',
        fontSize: '1.7rem',
        marginVertical: normalize(5),
        fontFamily: 'graphik-medium'
    },
    giftTitle:{
        color: '#fff',
        fontSize: '1.7rem',
        marginTop: normalize(5),
        fontFamily: 'graphik-medium',
        marginBottom: normalize(20)
    },
    inviteText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium',
        marginVertical:'0.3rem'
    },
    gift: {
        color: '#FFBB4F',
        textAlign: 'center',
        fontSize: '1.7rem',
        fontFamily: 'graphik-medium'
    },
    btnBg: {
        width: 120,
        height: 70,
        alignItems:'center',
        justifyContent: 'center'
    },
    btn: {
        position: 'absolute',
        bottom:-20,
        zIndex: 10
    },
    btnText: {
        color: '#A92101',
        fontSize: '1.4rem',
        fontFamily: 'blues-smile'
    },
    closeBtn: {
        position: 'absolute',
        right: -15,
        top: -20,
    },
    closeIcon:{
        width: 50,
        height: 50,
    },
    friendImage:{
        position: 'absolute',
        bottom: 50,
        right: normalize(-30),
        height: normalize(200),
        width: normalize(110)        
    }
});
