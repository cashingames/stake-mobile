import React, { useCallback, useEffect } from "react";
import { BackHandler, Image, Platform, ScrollView, StatusBar, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency, isTrue } from "../../../utils/stringUtl";
import EStyleSheet from "react-native-extended-stylesheet";
import Constants from 'expo-constants';
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import AppButton from "../../../shared/AppButton";
import { useFocusEffect } from "@react-navigation/native";
import { clearSession } from "./TriviaChallengeGameSlice";


const ChallengeEndGameScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    console.log(challengeDetails.score, challengeDetails.opponent.score, 'ended')

    const goHome = () => {
        navigation.navigate('Home');
        dispatch(clearSession());
    };

    useFocusEffect(
        useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor("transparent");
                return;
            }
            StatusBar.setBarStyle('light-content');
        }, [])
    );

    //disable back button
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView >
                {challengeDetails.score > challengeDetails.opponent.score &&
                    <Text style={styles.headText}>Congrats {user.username}</Text>
                }
                {challengeDetails.score < challengeDetails.opponent.score &&
                    <Text style={styles.headText}>Sorry {user.username}, you can try again</Text>
                }
                {challengeDetails.score === challengeDetails.opponent.score &&
                    <Text style={styles.headText}>Draw, you can try again</Text>
                }
                <ChallengePlayers challengeDetails={challengeDetails} />
                {challengeDetails.score > challengeDetails.opponent.score &&
                    <WinningAmount />
                }
                <FinalScoreBoard challengeDetails={challengeDetails} />
            </ScrollView>
            <AppButton text="Return to Dashboard" onPress={goHome} style={styles.button} />
        </View>
    )
}

const WinningAmount = () => {
    const amount = useSelector(state => state.triviaChallenge.challengeDetails.amount_won);
    return (
        <View style={styles.winningsContainer}>
            <Text style={styles.winningsText}>You have won <Text style={styles.winningsAmount}> &#8358;{formatCurrency(amount)}!</Text></Text>
        </View>
    )
}

const ChallengePlayers = ({ challengeDetails }) => {

    console.log("challenge",)
    return (
        <View style={styles.playersContainer}>
            {challengeDetails.score > challengeDetails.opponent.score &&
                <>
                    <ChallengeWinner playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                    <ChallengeLoser playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                </>
            }
            {challengeDetails.score < challengeDetails.opponent.score &&
                <>
                    <ChallengeWinner playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                    <ChallengeLoser playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                </>
            }
            {challengeDetails.score === challengeDetails.opponent.score &&
                <>
                    <ChallengeWinner playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                    <ChallengeLoser playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
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

const FinalScoreBoard = ({ challengeDetails }) => {
    return (
        <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Final score</Text>
            <View style={styles.scoreCountContainer}>
                {challengeDetails.score > challengeDetails.opponent.score &&
                    <>
                        <Text style={styles.winnerScoreCount}>{challengeDetails.score}</Text>
                        <Text style={styles.colon}>:</Text>
                        <Text style={styles.loserScoreCount}>{challengeDetails.opponent.score}</Text>
                    </>
                }
                {challengeDetails.score < challengeDetails.opponent.score &&
                    <>
                        <Text style={styles.winnerScoreCount}>{challengeDetails.opponent.score}</Text>
                        <Text style={styles.colon}>:</Text>
                        <Text style={styles.loserScoreCount}>{challengeDetails.score}</Text>
                    </>
                }

                {challengeDetails.score === challengeDetails.opponent.score &&
                    <>
                        <Text style={styles.winnerScoreCount}>{challengeDetails.score}</Text>
                        <Text style={styles.colon}>:</Text>
                        <Text style={styles.loserScoreCount}>{challengeDetails.opponent.score}</Text>
                    </>
                }

            </View>
        </View>
    )
}


export default ChallengeEndGameScreen;
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop: normalize(45),
        backgroundColor: '#9C3DB8',
        paddingBottom: normalize(15),

    },
    headText: {
        fontSize: '1.2rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        textAlign: 'center',
        lineHeight: '2rem'
    },
    winningsContainer: {
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '2rem',
        marginVertical: '.5rem',
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
        marginVertical: '1rem',

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
        marginTop: '.3rem',
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
    button: {
        marginBottom: 10,
        marginTop: 0
    }
})