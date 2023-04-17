import * as React from 'react';
import { Text, View, ScrollView, Share, Alert, Pressable, Platform, Modal } from 'react-native';
import normalize from '../utils/normalize';
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

// export default copilot({
//     animated: true,
//     overlay: 'svg'
// })(function InviteFriendsScreen(props) {
// const CopilotProps = props;
const InviteFriendsScreen = ({showInviteFriends, setShowInviteFriends}) => {

    const navigation = useNavigation()

    const [refreshing, setRefreshing] = React.useState(false);
    const isTourActive = useSelector(state => state.tourSlice.isTourActive);

    const dispatch = useDispatch()

    useApplyHeaderWorkaround(navigation.setOptions);

    // tour

    // React.useEffect(()=>{
    //     setTimeout(()=>{
    //         if((isTourActive?.payload || isTourActive) ){
    //             // tourStart(7)
    //             // setForceRender(!forceRender);
    //             // console.log(canStart, 7)
                
    //             console.log('reach11')
    //             CopilotProps.start()
    //             CopilotProps.copilotEvents.on('stop', handleTourStop)

    //             // eventEmitter.on('stop', handleTourStop)
    
    //             return () => {
    //                 // eventEmitter.off('stop', handleTourStop)
    //                 CopilotProps.copilotEvents.off('stop', handleTourStop)
    //             }
    //         }else{
    //             // console.log(AppTourStep)
    //             // AppTour.start();
    //             // AppTour.stop();
    //         }
    //     }, 1000)
    // }, [isTourActive])

    const handleTourStop = ()=>{
        console.log("tour stopped, going to next screen to continue....")
        
        // end tour
        try{
            dispatch(clearTour())
            navigation.popToTop()
            navigation.navigate("AppRouter")
        }catch(e){
            navigation.navigate("AppRouter")
        }
    }


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
                 
                            <Pressable
                                style={styles.buttonClose}
                                onPress={() => setShowInviteFriends(!showInviteFriends)}
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
                        </Modal>
                        </View>
        </ScrollView>

    );
}

const Heading = () => {
    return (
        <View style={styles.heading}>
            <Text style={styles.value}>We value friendship</Text>
            <Text style={styles.points}>with your referrals</Text>
        </View>
    )
}

const Instructions = () => {
    return (
        <>
            <Text style={styles.instructions}>
                Refer your friends to us and get 2 bonus games for each friend referred, and has played at least 1 game,
                and also stand a chance of winning exciting prizes.
            </Text>
        </>
    )
}

const InviteLink = () => {
    const user = useSelector(state => state.auth.user);

    const referralUrl = (user.referralCode)
    const referralMsg = `Play exciting games with me on Gameark! Create an account with my referral code - ${referralUrl}`

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

    const copyToClipboard = () => {
        Clipboard.setString(referralUrl);
        Alert.alert('Copied to clipboard')
    };

    return (
        <>
            <Text style={styles.inviteLink}>Your referral code</Text>
            <View style={styles.linkContainer} >
                <Text style={styles.link}>{referralUrl}</Text>
                <View style={styles.shareIcons}>
                    <ShareLink iconName="md-copy" text='Copy' onPress={copyToClipboard} />
                    <ShareLink iconName="md-share-social" text='Share' onPress={onShare} />
                </View>
            </View>
        </>
    )
}
const ShareLink = ({ iconName, text, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={styles.icon}>
                <Ionicons name={iconName} size={20} color="#EB5757" />
                <Text style={styles.iconText}>{text}</Text>
            </View>
        </Pressable>
    )
}
export default InviteFriendsScreen;

const styles = EStyleSheet.create({
    
});
