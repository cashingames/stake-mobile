import * as React from 'react';
import { Text, View, ScrollView, Share, Pressable, Platform } from 'react-native';
import normalize from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from 'react-redux';
import LottieAnimations from '../shared/LottieAnimations';
import logToAnalytics from '../utils/analytics';
import { useState } from 'react';
import CustomAlert from '../shared/CustomAlert';


const InviteFriendsScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    const startModal = () => {
        setModalVisible(true)
    }
    const close = () => {

    }


    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.content}>
                <LottieAnimations
                    animationView={require('../../assets/friends.json')}
                    width={normalize(160)}
                    height={normalize(160)}
                />
                <Heading />
                <Instructions />
                <InviteLink startModal={startModal} setAlertMessage={setAlertMessage} />
                <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                    textLabel={alertMessage} buttonLabel='Ok, got it'
                    alertImage={require('../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={close} />

            </ScrollView>
        </View>


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
                Share the fun! Refer your friends to us so they can participate in our exciting games.
            </Text>
        </>
    )
}

const InviteLink = ({ startModal, setAlertMessage }) => {
    const user = useSelector(state => state.auth.user);

    const referralUrl = (user.referralCode)
    const referralMsg = `Play exciting games with me on Cashingames and stand a chance to earn great rewards! Create an account with my referral code - ${referralUrl}`

    const onShare = async () => {
        try {
            await Share.share({
                message: referralMsg,
            });
            logToAnalytics("share_referral", {
                'id': user.username,
            })

        } catch (error) {
            startModal()
            setAlertMessage("Notice", error.message);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setStringAsync(referralUrl).then(() => {
            startModal()
            setAlertMessage("Copied to clipboard.");
        });
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
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18)
    },
    content: {
        flex: 1,
        justifyContent: 'center'

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
