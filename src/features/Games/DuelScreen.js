import * as React from 'react';
import { Text, View, Image, ScrollView, Pressable, ImageBackground } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppButton from '../../shared/AppButton';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';

export default function DuelScreen({ navigation }) {

    useApplyHeaderWorkaround(navigation.setOptions);

    const proccedToInstruction = () => {
        navigation.navigate('GameInstructions')
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <SelectedPlayers />
                <SelectedGame gameIcon={require('../../../assets/images/music.png')} gameTitle='Music' />
                <ChallengeFriendMessage />
                <StartGameButton text='Proceed' onPress={proccedToInstruction} />
            </ScrollView>
        </SafeAreaView>
    );
}

const SelectedPlayers = () => {
    return (
        <>
            <ImageBackground source={require('../../../assets/images/player_stage.png')} style={styles.image} resizeMode="cover">
                <SelectedPlayer playerName='Holygrail' playerAvatar={require('../../../assets/images/user-icon.png')} />
                <Image
                    source={require('../../../assets/images/versus.png')}
                />
                <SelectedPlayer playerName='Adamantine' playerAvatar={require('../../../assets/images/user-icon.png')} />
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
                style={styles.gameIcon}
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
        <AppButton text={text} onPress={onPress} style={styles.startButton} />
    )
};



const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001523',
    },
    contentContainer: {
        paddingHorizontal: normalize(18),
        paddingBottom: responsiveScreenWidth(5),
        paddingTop: responsiveScreenWidth(5)
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
    avatarBackground: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    username: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF',
        width: responsiveScreenWidth(22),
        textAlign: 'center'
    },
    gameDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#9C3DB8',
        paddingVertical: responsiveScreenWidth(4),
        paddingLeft: responsiveScreenWidth(5),
        paddingRight: responsiveScreenWidth(8),
        borderRadius: 16
    },
    gameIcon: {
        width: normalize(55),
        height: normalize(55)
    },
    gameTitle: {
        fontSize: '0.8rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
    challenge: {
        marginTop: responsiveScreenWidth(8),
    },
    challengeHeader: {
        fontFamily: 'graphik-medium',
        fontSize: '1.35rem',
        color: '#E0E0E0',
        marginBottom: normalize(10),
    },
    challengeMessage: {
        fontFamily: 'graphik-regular',
        fontSize: '0.75rem',
        color: '#E0E0E0',
        lineHeight: '1.5rem'
    },
    startButton: {
        marginTop: responsiveScreenWidth(23),
    },

});
