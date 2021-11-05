import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function DuelGameEndResult({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../assets/images/game_end.png')} style={styles.image} resizeMode="cover">
                <ScrollView>
                    <View style={styles.content}>
                        <UserResultEmoji userEmoji={require('../../assets/images/fire-cracker.png')} />
                        {/* <UserResultEmoji userEmoji={require('../../assets/images/sad-face-emoji.png')} /> */}
                        <Username userName='Joy' />
                        <UserResultInfo />
                        <PlayersDetails avatar={require('../../assets/images/user-icon.png')} opponentAvatar={require('../../assets/images/user-icon.png')} />
                        <FinalScore pointsGained='8' opponentScore='5' />
                        <GameButtons />
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const UserResultEmoji = ({ userEmoji }) => {
    return (
        <View style={styles.emojiContainer}>
            <Image
                style={styles.emoji}
                source={userEmoji}
            />
        </View>
    )
}

const Username = ({ userName }) => {
    return (
        <View style={styles.nameContainer}>
            <Text style={styles.name}>Congrats, {userName}</Text>
            {/* <Text style={styles.name}>Sorry, {userName}</Text> */}
        </View>
    )
}

const UserResultInfo = () => {
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.info}>you won this duel</Text>
            {/* <Text style={styles.info}>you lost this duel</Text>
            <Text style={styles.info}>Challenge a friend to play again</Text> */}
        </View>
    )
}

const PlayersDetails = ({ avatar, opponentAvatar }) => {
    return (
        <View style={styles.playerDetails}>
            <View style={styles.player}>
                <Text style={styles.playerName}>Joy</Text>
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatar}
                        source={avatar}
                    />
                </View>
            </View>
            <View style={styles.player}>
                <Text style={styles.playerName}>Zubby</Text>
                <Image
                    style={styles.avatar1}
                    source={opponentAvatar}
                />
            </View>
        </View>
    )
}


const FinalScore = ({ pointsGained, opponentScore }) => {
    return (
        <View style={styles.finalScore}>
            <Text style={styles.finalScoreText}>Your final score point is</Text>
            <Text style={styles.point}>{pointsGained}</Text>
            <Text style={styles.point1}>:</Text>
            <Text style={styles.point2}>{opponentScore}</Text>
        </View>
    )
}

const GameButton = ({ buttonText, onPress }) => {
    return (
        <View style={styles.gameButton}>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

const GameButtons = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.gameButtons}>
            <GameButton buttonText='Return to Dashboard'
                onPress={() => navigation.navigate('Dashboard')}
            />
            <GameButton buttonText='Play Again'
                onPress={() => navigation.navigate('GameInProgress')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
    },
    content: {
        marginHorizontal: normalize(18),
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: normalize(40),
    },
    image: {
        flex: 1,
    },
    emojiContainer: {
        alignItems: 'center',
        marginBottom: normalize(18)
    },
    emoji: {
        width: normalize(80),
        height: normalize(80)
    },
    nameContainer: {
        alignItems: 'center',
        marginBottom: normalize(15)
    },
    name: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(30),
    },
    infoContainer: {
        alignItems: 'center',
        textAlign: 'center',
        marginHorizontal: normalize(25),
        marginBottom: normalize(15)
    },
    info: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        fontSize: normalize(16),
        lineHeight: normalize(26)
    },
    seeRank: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    seeRankText: {
        // textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
    },
    goToLeaderboard: {
        backgroundColor: '#701F88',
        borderRadius: 8,
        padding: normalize(13),
        marginBottom: normalize(15)
    },
    finalScore: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9E821',
        padding: normalize(10),
        borderRadius: 16,
        marginBottom: normalize(75)
    },
    finalScoreText: {
        // textAlign: 'center',
        color: '#9236AD',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
    },
    point: {
        // textAlign: 'center',
        color: '#6895FF',
        fontFamily: 'graphik-bold',
        fontSize: normalize(65),
    },
    point1: {
        // textAlign: 'center',
        color: '#9236AD',
        fontFamily: 'graphik-bold',
        fontSize: normalize(65),
        marginBottom: normalize(15)
    },
    point2: {
        // textAlign: 'center',
        color: '#FF716C',
        fontFamily: 'graphik-bold',
        fontSize: normalize(65),
    },
    gameButton: {
        borderColor: '#FFFF',
        borderWidth: 1,
        width: normalize(130),
        height: normalize(40),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    gameButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(50)
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
    },
    avatar: {
        width: normalize(70),
        height: normalize(70),
        borderRadius: 100,
    },
    avatarContainer: {
        padding: normalize(10),
        backgroundColor: '#6895FF',
        borderRadius: 100,
        borderColor: '#F1F5FF',
        borderWidth: 7,
        marginRight: normalize(10)
    },
    avatar1: {
        width: normalize(50),
        height: normalize(50),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderColor: '#FF716C',
        borderWidth: 3
    },
    playerDetails: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: normalize(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    player: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    playerName: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        marginBottom: normalize(8)
    },
    pointContainer: {
        display: 'flex',
        flexDirection: 'row',
    }

});
