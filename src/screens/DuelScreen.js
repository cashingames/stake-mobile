import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, ImageBackground } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function DuelScreen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DuelSelectPlayer')}
                    >
                        <Ionicons name="md-arrow-back-outline" size={22} color="#FFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTextStyle}>Duel</Text>
                </View>
                <View style={styles.content}>
                    <SelectedPlayers />
                    <SelectedGame gameIcon={require('../../assets/images/music.png')} gameTitle='Music' />
                    <ChallengeFriendMessage />
                    <StartGameButton text='Start Game' onPress={() => navigation.navigate('DuelGameCountdown')} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const SelectedPlayers = () => {
    return (
        <>
            <ImageBackground source={require('../../assets/images/player_stage.png')} style={styles.image} resizeMode="cover">
                <SelectedPlayer playerName='Holygrail' playerAvatar={require('../../assets/images/user-icon.png')} />
                <Image
                    source={require('../../assets/images/versus.png')}
                />
                <SelectedPlayer playerName='Adamantine' playerAvatar={require('../../assets/images/user-icon.png')} />
            </ImageBackground></>
    )
}

const SelectedPlayer = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.avatarBackground}>
            <Image
                source={playerAvatar}
                style={styles.avatar}
            />
            <Text style={styles.username}>@{playerName}</Text>
        </View>
    )
}

const SelectedGame = ({ gameTitle, gameIcon }) => {
    return (
        <View style={styles.gameDetails}>
            <Image
                source={gameIcon}
            // style={styles.avatar}
            />
            <Text style={styles.gameTitle}>{gameTitle}</Text>
        </View>
    )
}

const ChallengeFriendMessage = () => {
    return (
        <View style={styles.challenge}>
            <Text style={styles.challengeHeader}>Challenge a friend</Text>
            <Text style={styles.challengeMessage}>Your Invite for the Duel will be sent to your opponent. If your opponent is offline.</Text>
        </View>
    )
}

const StartGameButton = ({ text, onPress }) => {
    return (
        <View style={styles.startContainer}>
            <Pressable onPress={onPress}
                style={styles.button}
            >
                <Text style={styles.playButton}>{text}</Text>
            </Pressable>
        </View>
    )
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001523',
    },
    contentContainer: {
    },
    content: {
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(50),

    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(20),
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        marginLeft: normalize(15)
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    avatarBackground: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    players: {
        marginVertical: normalize(20),
        display: 'flex',
        flexDirection: 'row',
        // backgroundColor: '#FFFF',
    },
    image: {
        marginVertical: normalize(20),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(20),
        alignItems: 'center',

    },
    username: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#FFFF',
        width: normalize(80)
    },
    gameDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#9C3DB8',
        paddingVertical: normalize(18),
        paddingHorizontal: normalize(12),
        borderRadius: 16
    },
    gameTitle: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        borderRadius: 12,
        backgroundColor: '#EF2F55'
    },
    playButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFFF'
    },
    startContainer: {
        marginTop: normalize(90),
    },
    challenge: {
        marginTop: normalize(20),
    },
    challengeHeader: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(22),
        color: '#E0E0E0',
        marginBottom: normalize(10),
    },
    challengeMessage: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(12),
        color: '#E0E0E0',
        lineHeight: 24
    }

});
