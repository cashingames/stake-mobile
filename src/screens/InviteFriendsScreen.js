import * as React from 'react';
import { Text, View, ScrollView, Share, Alert, Pressable, Platform } from 'react-native';
import normalize from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import useApplyHeaderWorkaround from '../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../shared/LottieAnimations';
import { clearTour } from '../features/Tour/TourSlice';
import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/native';


const InviteFriendsScreen = () => {

    const navigation = useNavigation

    const [refreshing, setRefreshing] = React.useState(false);
    const isTourActive = useSelector(state => state.tourSlice.isTourActive);

    const dispatch = useDispatch()

    useApplyHeaderWorkaround(navigation.setOptions);
    const handleTourStop = ()=>{
        console.log("tour stopped, going to next screen to continue....")
        
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
            <LottieAnimations
                animationView={require('../../assets/friends.json')}
                width={normalize(160)}
                height={normalize(160)}
            />
            <Heading />
            <Instructions />
{/* 
            <CopilotStep text={
                <View>
                    <Text style={styles.tourTitle} >Invite Friends</Text>
                    <Text>Refer your friends and get bonuses for each friend referred and also stand a chance of winning cash prizes</Text>
                </View>
            } order={1} name={`Invite1`}>
                <Walkthroughable> */}
                    <InviteLink />
                {/* </Walkthroughable>
            </CopilotStep> */}


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
    const referralMsg = `Play exciting games with me on Cashingames and stand a chance to earn great rewards! Create an account with my referral code - ${referralUrl}`

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
    container: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18)
    },

    heading: {
        marginVertical: normalize(30),
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    value: {
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium',
        color: '#151C2F',
        marginBottom: Platform.OS === 'ios' ? normalize(10) : normalize(0),
    },
    points: {
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    instructions: {
        fontSize: '0.95rem',
        fontFamily: 'graphik-regular',
        color: '#151C2F',
        lineHeight: '1.7rem',
        opacity: 0.6,
        marginBottom: normalize(40),
    },
    inviteLink: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: '0.79rem',
        fontFamily: 'graphik-medium',
        lineHeight: '1.2rem',
        marginBottom: normalize(12),
    },
    link: {
        fontSize: '0.73rem',
        fontFamily: 'graphik-medium',
        lineHeight: '1.1rem',
        color: '#151C2F',
        width: '80%',
    },
    linkContainer: {
        backgroundColor: '#FFFF',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    shareIcons: {
        display: 'flex',
        flexDirection: 'row'
    },
    iconText: {
        color: '#EB5757',
        fontSize: '0.55rem',
        fontFamily: 'graphik-bold',
    },
    icon: {
        marginLeft: normalize(10),
        alignItems: 'center'
    },
    tourTitle: {
        color: '#EF2F55',
        fontWeight: '600',
        fontSize: 22,
        marginBottom: 10
    }
});
