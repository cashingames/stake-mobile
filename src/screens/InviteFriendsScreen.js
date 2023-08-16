import * as React from 'react';
import { Text, View, ScrollView, Share, Pressable, Platform, Image, ImageBackground } from 'react-native';
import normalize from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from 'react-redux';
import LottieAnimations from '../shared/LottieAnimations';
import logToAnalytics from '../utils/analytics';
import { useState } from 'react';
import CustomAlert from '../shared/CustomAlert';
import AppButton from '../shared/AppButton';


const InviteFriendsScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    const startModal = () => {
        setModalVisible(true)
    }
    const close = () => {

    }


    return (
        <ImageBackground source={require('../../assets/images/success-background.png')}
            style={styles.content}
            resizeMethod="resize">
            <ScrollView style={styles.container}>
                <Heading />
                <Instructions />
                <InviteLink />
            </ScrollView>
            <ShareButtons startModal={startModal} setAlertMessage={setAlertMessage} />
            <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                textLabel={alertMessage} buttonLabel='Ok, got it'
                alertImage={require('../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={close} />
        </ImageBackground>

    );
}

const Heading = () => {
    return (
        <View style={styles.heading}>
            <Text style={styles.value}>We value friendship with your referrals</Text>
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

const InviteLink = () => {
    const user = useSelector(state => state.auth.user);
    const referralUrl = (user.referralCode)

    return (
        <>
            <Text style={styles.inviteLink}>Your referral code</Text>
            <View style={styles.linkContainer} >
                <Image
                    source={require('../../assets/images/bonus-confetti.png')}
                    style={styles.tabIcon}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.link}>Share the great news of our interesting trivia games</Text>
                    <Text style={styles.linkName}>{referralUrl}</Text>
                </View>
            </View>
        </>
    )
}

const ShareButtons = ({ startModal, setAlertMessage }) => {
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
        <View style={styles.buttonsContainer}>
            <Pressable style={styles.button} onPress={onShare}>
                <Text style={styles.text}>Share to friends</Text>
                <Ionicons name="md-share-social" size={20} color="#FFF" />
            </Pressable>
            <Pressable style={styles.buttonI} onPress={copyToClipboard}>
                <Text style={styles.textI}>Copy link</Text>
                <Ionicons name="md-copy" size={20} color="#1C453B" />
            </Pressable>
        </View>
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

    },
    content: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingVertical: '1rem'
    },


    heading: {
        marginBottom: normalize(20),
    },
    value: {
        fontSize: '.95rem',
        fontFamily: 'gotham-medium',
        color: '#1C453B',
        marginBottom: Platform.OS === 'ios' ? normalize(10) : normalize(0),
    },
    points: {
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    instructions: {
        fontSize: '0.8rem',
        fontFamily: 'gotham-medium',
        color: '#1C453B',
        lineHeight: '1.1rem',
        marginBottom: '3rem',
    },
    tabIcon: {
        width: '3.2rem',
        height: '3.2rem'
    },
    inviteLink: {
        color: '#1C453B',
        fontSize: '0.79rem',
        fontFamily: 'gotham-medium',
        marginBottom: normalize(12),
    },
    link: {
        fontSize: '0.8rem',
        fontFamily: 'gotham-medium',
        lineHeight: '1rem',
        color: '#1C453B',
        width: '80%',
        marginBottom: '.5rem'
    },
    linkName: {
        fontSize: '1rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        width: '80%',
    },
    linkContainer: {
        backgroundColor: '#FFFF',
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(10),
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#E0E0E0',
        borderWidth: 1,
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
    buttonsContainer: {
        marginBottom: '1rem'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(17),
        paddingHorizontal: normalize(28),
        marginBottom: 12,
        borderRadius: 13,
        elevation: 3,
        backgroundColor: '#E15220',
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: '1.2rem',
        marginRight: '.3rem'
    },
    buttonI: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(17),
        paddingHorizontal: normalize(28),
        borderWidth: 2,
        borderColor: '#1C453B',
        borderRadius: 13,
        elevation: 3,
        backgroundColor: '#F9FBFF',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textI: {
        letterSpacing: 0.25,
        color: '#1C453B',
        fontFamily: 'graphik-medium',
        fontSize: '1.2rem',
        marginRight: '.3rem'
    },
});
