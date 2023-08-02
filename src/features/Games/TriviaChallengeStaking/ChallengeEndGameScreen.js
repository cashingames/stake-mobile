import React, { useCallback, useEffect } from "react";
import { BackHandler, Image, ImageBackground, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EStyleSheet from "react-native-extended-stylesheet";
import Constants from 'expo-constants';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../../utils/normalize";
import { useFocusEffect } from "@react-navigation/native";
import { clearSession } from "./TriviaChallengeGameSlice";
import { useState } from "react";
// import BoostPopUp from "../../../shared/BoostPopUp";
import logToAnalytics from "../../../utils/analytics";
import AppButton from "../../../shared/AppButton";
import { formatCurrency, isTrue } from "../../../utils/stringUtl";
import { getUser } from "../../Auth/AuthSlice";


const ChallengeEndGameScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const [loading, setLoading] = useState(false);
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);



    const goHome = () => {
        navigation.navigate('Home');
        dispatch(getUser());
        dispatch(clearSession());
    };


    const onPlayButtonClick = () => {
        setLoading(true);
        dispatch(getUser());
        dispatch(clearSession());
        logToAnalytics('trivia_challenge_play_again_clicked', {
            'id': user.username,
        });
        navigation.navigate("Games")
        setLoading(false);

    }

    useEffect(() => {
        logToAnalytics("trivia_challenge_stake_completed", {
            'opponentName': challengeDetails.opponent.username,
            'username': challengeDetails.username,
        })
        if (Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score)) {
            logToAnalytics("trivia_challenge_stake_won", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }
        if (Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score)) {
            logToAnalytics("trivia_challenge_stake_lost", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }
        if (Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score)) {
            logToAnalytics("trivia_challenge_stake_draw", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }
        if (challengeDetails.opponent.is_bot === true) {
            logToAnalytics("trivia_challenge_bot_opponent", {
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
            return
        }

    }, [])

    // useEffect(() => {
    //     if ((Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score)) || (Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score))) {
    //         setModalVisible(true)
    //     }
    // }, [challengeDetails])


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
        <ImageBackground source={require('../../../../assets/images/success-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={styles.container}>

                <SelectedPlayers challengeDetails={challengeDetails} user={user} />
                {Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>You won the challenge</Text>
                }
                {Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>You lost the challenge</Text>
                }
                {Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>Draw, you can try again</Text>
                }
                <Winnings />
                <ScoreDetails challengeDetails={challengeDetails} practiceMode={practiceMode} cashMode={cashMode} />
                <FinalScore challengeDetails={challengeDetails} cashMode={cashMode} practiceMode={practiceMode} />
                {/* <BoostPopUp modalVisible={modalVisible} setModalVisible={setModalVisible} /> */}
                <View style={styles.gameButtons}>
                    <AppButton onPress={onPlayButtonClick} text='Stake again' disabled={loading} textStyle={styles.againText} style={styles.stakeButton} disabledStyle={styles.disabled} />
                    <Pressable style={styles.homeButton} onPress={goHome}>
                        <Text style={styles.buttonText}>Return to home</Text>
                    </Pressable>
                </View>
            </ScrollView>


        </ImageBackground>
    )
}

const Winnings = () => {
    const amount = useSelector(state => state.triviaChallenge.challengeDetails.amount_won);
    return (
        <View style={styles.winningsAmountCont}>
            <Text style={styles.winningsHeaderI}>Winnings</Text>
            <Text style={styles.scoreCountI}>NGN {formatCurrency(amount)}</Text>
        </View>
    )
}

const ScoreDetails = ({ challengeDetails, cashMode, practiceMode }) => {
    return (
        <View style={styles.winningsContainer}>
            <View style={styles.scoreCountContainer}>
                <View style={styles.userCountContainer}>
                    <Text style={styles.countName}>You</Text>
                    <Text style={styles.scoreCount}>{challengeDetails.score}</Text>
                </View>
                {practiceMode &&
                    <Text style={styles.winningsHeader}>Demo scores</Text>
                }
                {cashMode &&
                    <Text style={styles.winningsHeader}>Scores</Text>
                }
                <View style={styles.userCountContainer}>
                    <Text style={styles.countName}>{challengeDetails.opponent.username}</Text>
                    <Text style={styles.scoreCount}>{challengeDetails.opponent.score}</Text>
                </View>
            </View>
        </View>
    )
}

const SelectedPlayers = ({ challengeDetails, user }) => {
    const username = user.username?.charAt(0) + user.username?.charAt(1);
    const opponentName = challengeDetails.opponent?.username?.charAt(0) + challengeDetails.opponent?.username?.charAt(1)

    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={user.username} playerAvatar={username} backgroundColor='#ccded48c' />
            <Image
                source={require('../../../../assets/images/versus.png')}
                style={styles.versus}
            />
            <SelectedPlayer playerName={challengeDetails.opponent.username} playerAvatar={opponentName} backgroundColor='#FEECE7' />
        </View>
    )
}

const SelectedPlayer = ({ playerName, playerAvatar, backgroundColor }) => {
    return (
        <View style={styles.avatarBackground}>
            <View style={[styles.avatarContent, { backgroundColor: backgroundColor }]}>
                <Text style={styles.avatarText}>{playerAvatar}</Text>
            </View>
            <Text style={styles.username}>{playerName}</Text>
        </View>
    )
}


const FinalScore = ({ challengeDetails, practiceMode, cashMode }) => {
    return (
        <View style={styles.finalScore}>
            {cashMode &&
                <Text style={styles.finalScoreText}>Game play statistics</Text>
            }
            {practiceMode &&
                <Text style={styles.finalScoreText}>Demo game statistics</Text>
            }
            <View style={styles.scoreContainer}>
                <Text style={styles.pointTitle}>Questions answered</Text>
                <Text style={styles.point}>{challengeDetails.questions?.length / 2}</Text>
            </View>
            <View style={styles.scoreContainer}>
                <Text style={styles.pointTitle}>Answered correctly</Text>
                <Text style={styles.point}>{challengeDetails.score}</Text>
            </View>
            <View style={styles.scoreContainer}>
                <Text style={styles.pointTitle}>Points earned</Text>
                <Text style={styles.point}>{challengeDetails.score} pts</Text>
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
        paddingBottom: normalize(15),
    },
    headText: {
        fontSize: '1.2rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        textAlign: 'center',
        lineHeight: '2rem'
    },
    winningsAmountCont: {
        backgroundColor: '#AAD880',
        alignItems: 'center',
        paddingVertical: '.7rem',
        marginVertical: '.5rem',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
    },
    winningsContainer: {
        backgroundColor: '#fff',
        paddingVertical: '.5rem',
        paddingHorizontal: '3rem',
        marginVertical: '.5rem',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
    },
    homeButton: {
        marginVertical: 5,
        backgroundColor: 'none',
        borderWidth: 2,
        borderColor: '#1C453B',
        paddingVertical: normalize(19),
        borderRadius: 13,
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        color: '#1C453B'
    },
    winningsHeader: {
        fontSize: '1.1rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        textAlign: 'center',
    },
    winningsHeaderI: {
        fontSize: '1.2rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        textAlign: 'center',
        marginBottom: '.5rem'
    },
    scoreCountContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center'
        // marginTop: '.5rem'
    },
    userCountContainer: {
        alignItems: 'center'
    },
    countName: {
        fontSize: '1rem',
        fontFamily: 'sansation-regular',
        color: '#1C453B',
        textAlign: 'center'
    },
    scoreCountI: {
        fontSize: '1rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',

    },
    scoreCount: {
        fontSize: '2rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',

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
    avatarBackground: {
        alignItems: 'center',
        marginVertical: normalize(15)
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#F6F4FF',
        borderRadius: 50,
    },
    avatarContent: {
        width: normalize(80),
        height: normalize(80),
        backgroundColor: '#ccded48c',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: '1.6rem',
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        textTransform: 'uppercase'
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
    gameButtons: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: responsiveScreenHeight(18),
        // paddingHorizontal: '2rem'
    },
    stakeButton: {
        marginBottom: 20,
        marginTop: 0,
        paddingVertical: normalize(19),
    },
    againText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
    },
    versus: {
        width: '3rem',
        height: '5rem'
    },
    playerImage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 13,
        marginBottom: '1rem',
    },
    username: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginTop: '.8rem'
    },
    finalScore: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: responsiveScreenWidth(12),
        padding: Platform.OS === 'ios' ? normalize(25) : normalize(20),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
    },
    finalScoreText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1.2rem',
        marginBottom: '.3rem',
        textAlign: 'center'
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: '.5rem'
    },
    pointTitle: {
        color: '#1C453B',
        fontSize: '1.1rem',
        fontFamily: 'gotham-medium',
    },
    point: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
        marginLeft: '.7rem'
    },
})