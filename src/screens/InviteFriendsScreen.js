import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, Share, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import normalize from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { appUrl } from '../utils/BaseUrl';
import { useSelector } from 'react-redux';


export default function InviteFriendsScreen({ navigation }) {

    return (
        <ScrollView style={styles.container}>
            <Heading />
            <Instructions />
            <InviteLink />
        </ScrollView>
    );
}

const Heading = () => {
    return (
        <View style={styles.heading}>
            <Text style={styles.value}>We value friendship</Text>
            <Text style={styles.points}>at exactly 50 pts</Text>
        </View>
    )
}

const Instructions = () => {
    return (
        <>
            <Text style={styles.instructions}>
                Refer your friends to us and they will each get 50 points.
                On top of that, we’ll give you N150 bonus for each friend that tops up and plays a game
            </Text>
        </>
    )
}

const InviteLink = () => {
    const user = useSelector(state => state.auth.user);

    const referralUrl = `${appUrl}/sign-up/${user.referralCode}`

    const onShare = async () => {
        try {
            await Share.share({
                message: referralUrl,
            });
        } catch (error) {
            Alert.alert("Notice", error.message);
        }
    };

    return (
        <View>
            <Text style={styles.inviteLink}>Your invite link</Text>
            <View style={styles.linkContainer} >
                <Text style={styles.link}>{referralUrl}</Text>
                <View style={styles.shareIcons}>
                    <ShareLink iconName="md-copy" text='Copy' onPress={() => Clipboard.setString(referralUrl)} />
                    <ShareLink iconName="md-share-social" text='Share' onPress={onShare} />
                </View>
            </View>
        </View>
    )
}
const ShareLink = ({ iconName, text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.icon}>
                <Ionicons name={iconName} size={20} color="#EB5757" />
                <Text style={styles.iconText}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18)
    },

    heading: {
        marginVertical: normalize(30),
    },
    value: {
        fontSize: normalize(20),
        fontFamily: 'graphik-medium',
        color: '#151C2F',
    },
    points: {
        fontSize: normalize(20),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    instructions: {
        fontSize: normalize(13),
        fontFamily: 'graphik-regular',
        color: '#151C2F',
        lineHeight: 24,
        opacity: 0.6,
        marginBottom: normalize(40),
    },
    link: {
        fontSize: normalize(11),
        fontFamily: 'graphik-medium',
        color: '#151C2F',
        width: '80%',
    },
    inviteLink: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        lineHeight: 16,
        marginBottom: normalize(12),
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
        fontSize: normalize(8),
        fontFamily: 'graphik-bold',
    },
    icon: {
        marginLeft: normalize(10),
        alignItems: 'center'
    }
});
