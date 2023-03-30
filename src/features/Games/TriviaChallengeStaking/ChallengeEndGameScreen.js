import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { formatCurrency, isTrue } from "../../../utils/stringUtl";
import EStyleSheet from "react-native-extended-stylesheet";
import Constants from 'expo-constants';
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import AppButton from "../../../shared/AppButton";


const ChallengeEndGameScreen = ({ navigation }) => {
    const user = useSelector(state => state.auth.user);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const opponentScore = challengeDetails.opponent.score;
    const userScore = challengeDetails.score;
    const opponentUsername = challengeDetails.opponent;

    const goHome = () => {
        navigation.navigate('Home');
    }

    return (
        <ScrollView style={styles.container}>
            {userScore > opponentScore ?
                <Text style={styles.headText}>Congrats {user.username}</Text>
                :
                <Text style={styles.headText}>Sorry {user.username}, you can try again</Text>

            }
            <ChallengePlayers user={user} userScore={userScore} opponentScore={opponentScore} opponent={opponentUsername} />
            {userScore > opponentScore &&
                <WinningAmount />
            }
            <FinalScoreBoard opponentScore={opponentScore} userScore={userScore} />
            <AppButton text="Return to Dashboard" onPress={goHome} />
        </ScrollView>
    )
}

const WinningAmount = () => {
    const amountWon = 10000
    return (
        <View style={styles.winningsContainer}>
            <Text style={styles.winningsText}>You have won <Text style={styles.winningsAmount}> &#8358;{formatCurrency(amountWon)}!</Text></Text>
        </View>
    )
}

const ChallengePlayers = ({ user, userScore, opponentScore, opponentUsername }) => {
    return (
        <View style={styles.playersContainer}>
            {userScore > opponentScore ?
                <>
                    <ChallengeWinner playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                    <ChallengeLoser playerName={opponentUsername} playerAvatar={require("../../../../assets/images/user-icon.png")} />
                </>
                :
                <>
                    <ChallengeWinner playerName={opponentUsername} playerAvatar={require("../../../../assets/images/user-icon.png")} />
                    <ChallengeLoser playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                </>

            }
        </View>
    )
}

const ChallengeWinner = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.playerInfoContainer}>
            <Text style={styles.username}>{playerName}</Text>
            <View style={styles.avatarContainer}>
                <Image
                    source={playerAvatar}
                    style={styles.winnerAvatar}
                />
            </View>
        </View>
    )
}

const ChallengeLoser = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.playerInfoContainer}>
            <Text style={styles.username}>{playerName}</Text>
            <Image
                source={playerAvatar}
                style={styles.avatar}
            />
        </View>
    )
}

const FinalScoreBoard = ({ userScore, opponentScore }) => {
    return (
        <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Final score</Text>
            <View style={styles.scoreCountContainer}>
                <Text style={styles.winnerScoreCount}>{userScore > opponentScore ? userScore : opponentScore}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.loserScoreCount}>{userScore < opponentScore ? userScore : opponentScore}</Text>
            </View>
        </View>
    )
}


export default ChallengeEndGameScreen;
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop: responsiveScreenWidth(20),
        backgroundColor: '#9C3DB8',
    },
    headText: {
        fontSize: '1.2rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        textAlign: 'center',
        lineHeight:'2rem'
    },
    winningsContainer: {
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '2rem',
        marginVertical: '1rem',
        borderRadius: 10
    },
    winningsText: {
        fontSize: '.9rem',
        fontFamily: 'graphik-bold',
        color: '#000000',
        textAlign: 'center',
    },
    winningsAmount: {
        color: '#EB7474',
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#FF716C'
    },
    winnerAvatar: {
        width: normalize(120),
        height: normalize(120),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderWidth: 8,
        borderColor: '#6895FF'
    },
    avatarContainer: {
        borderRadius: 100,
        borderWidth: 6,
        borderColor: '#FFF'
    },
    username: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginBottom: '.4rem'
    },
    playersContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '2rem',

    },
    playerInfoContainer: {
        alignItems: 'center'
    },
    scoreContainer: {
        backgroundColor: '#F9E821',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '2rem',
        paddingHorizontal: '1rem',
        marginVertical: '1rem',
        borderRadius: 16

    },
    scoreCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    winnerScoreCount: {
        fontSize: '5.5rem',
        fontFamily: 'graphik-bold',
        color: '#6895FF',
        textAlign: 'center',
    },
    loserScoreCount: {
        fontSize: '5.5rem',
        fontFamily: 'graphik-bold',
        color: '#FF716C',
        textAlign: 'center',

    },
    colon: {
        fontSize: '5.5rem',
        fontFamily: 'graphik-bold',
        color: '#9236AD',
        textAlign: 'center',
        marginHorizontal: '1rem'
    },
    scoreText: {
        fontSize: '.8rem',
        fontFamily: 'graphik-medium',
        color: '#9236AD',
        textAlign: 'center',
    },
})