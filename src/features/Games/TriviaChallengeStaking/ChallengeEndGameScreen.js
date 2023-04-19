import React, { useCallback, useEffect } from "react";
import { BackHandler, Image, Platform, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency, formatNumber, isTrue } from "../../../utils/stringUtl";
import EStyleSheet from "react-native-extended-stylesheet";
import Constants from 'expo-constants';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../../utils/normalize";
import AppButton from "../../../shared/AppButton";
import { useFocusEffect } from "@react-navigation/native";
import { clearSession } from "./TriviaChallengeGameSlice";
import analytics from '@react-native-firebase/analytics';
import { useState } from "react";
import Boostspopup from "../../../shared/BoostPopUp";


const ChallengeEndGameScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    // console.log(challengeDetails)
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);



    const goHome = () => {
        navigation.navigate('Home');
        dispatch(clearSession());
    };


    const onPlayButtonClick = async () => {
        setLoading(true);
        dispatch(clearSession());
        analytics().logEvent('trivia_challenge_play_again_clicked', {
            'id': user.username,
        });
        navigation.navigate("SelectGameCategory")
        setLoading(false);

    }

    useEffect(() => {
        if (Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score)) {
            analytics().logEvent("trivia_challenge_stake_won", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }
        if (Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score)) {
            analytics().logEvent("trivia_challenge_stake_lost", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }
        if (Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score)) {
            analytics().logEvent("trivia_challenge_stake_draw", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }
        if (challengeDetails.opponent.is_bot === true) {
            analytics().logEvent("trivia_challenge_bot_opponent", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }
        return
    }, [])

    useEffect(() => {
        if ((challengeDetails.score < challengeDetails.opponent.score) || (challengeDetails.score === challengeDetails.opponent.score)) {
            setModalVisible(true)
        }
    }, [challengeDetails])

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
            <ScrollView contentContainerStyle={styles.content}>
                {Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>Congrats {user.username}</Text>
                }
                {Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>Sorry {user.username}</Text>
                }
                {Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>Draw, you can try again</Text>
                }
                <ChallengePlayers challengeDetails={challengeDetails} />
                <WinningAmount challengeDetails={challengeDetails} />
                <FinalScoreBoard challengeDetails={challengeDetails} />
                <Boostspopup modalVisible={modalVisible} setModalVisible={setModalVisible} />
            </ScrollView>
            {/* <AppButton text="Return to Dashboard" onPress={goHome} style={styles.button} /> */}
            <View style={styles.gameButtons}>
                <GameButton buttonText='Return to Home'
                    onPress={goHome}
                />
                <GameButton buttonText={loading ? 'loading...' : 'Play Again'}
                    onPress={onPlayButtonClick}
                    disabled={loading}
                />
            </View>
        </View>
    )
}

const WinningAmount = ({ challengeDetails }) => {
    const amount = useSelector(state => state.triviaChallenge.challengeDetails.amount_won);
    return (
        <View style={styles.winningsContainer}>
            {Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score) &&
                <Text style={styles.winningsText}>You have won <Text style={styles.winningsAmount}> &#8358;{formatCurrency(amount)}!</Text></Text>
            }
            {Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score) &&
                <Text style={styles.winningsText}>You can try again</Text>
            }
            {Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score) &&
                <Text style={styles.winningsText}>You have been refunded</Text>
            }
        </View>
    )
}

const ChallengePlayers = ({ challengeDetails }) => {

    console.log("challenge",)
    return (
        <View style={styles.playersContainer}>
            {Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score) &&
                <>
                    <ChallengeWinner playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                    <ChallengeLoser playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                </>
            }
            {Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score) &&
                <>
                    <ChallengeLoser playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                    <ChallengeWinner playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                </>
            }
            {Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score) &&
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
                <Text style={styles.winnerScoreCount}>{challengeDetails.score}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.loserScoreCount}>{challengeDetails.opponent.score}</Text>
            </View>
        </View>
    )
}

const GameButton = ({ buttonText, onPress, disabled }) => {
    return (
        <Pressable onPress={onPress} style={[styles.gameButton, disabled ? styles.gameButtonDisabled : {}]} >
            <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
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
    content: {
        flex: 1,
        justifyContent: 'center'

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
        paddingVertical: '.8rem',
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
    },
    gameButton: {
        borderColor: '#FFFF',
        borderWidth: 1,
        width: responsiveScreenWidth(35),
        height: responsiveScreenHeight(6.5),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    gameButtonDisabled: {
        backgroundColor: '#DFCBCF'
    },
    gameButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(50),
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.72rem',
    },
})