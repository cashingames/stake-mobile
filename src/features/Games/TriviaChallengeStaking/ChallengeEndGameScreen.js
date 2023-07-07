import React, { useCallback, useEffect } from "react";
import { BackHandler, Image, ImageBackground, Platform, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency, isTrue } from "../../../utils/stringUtl";
import EStyleSheet from "react-native-extended-stylesheet";
import Constants from 'expo-constants';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../../utils/normalize";
import { useFocusEffect } from "@react-navigation/native";
import { clearSession } from "./TriviaChallengeGameSlice";
import { useState } from "react";
// import BoostPopUp from "../../../shared/BoostPopUp";
import logToAnalytics from "../../../utils/analytics";
import AppButton from "../../../shared/AppButton";


const ChallengeEndGameScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const [loading, setLoading] = useState(false);
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);



    const goHome = () => {
        navigation.navigate('Home');
        dispatch(clearSession());
    };


    const onPlayButtonClick = () => {
        setLoading(true);
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

                <SelectedPlayers challengeDetails={challengeDetails} />
                {Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>You won the challenge</Text>
                }
                {Number.parseFloat(challengeDetails.score) < Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>You lost the challenge</Text>
                }
                {Number.parseFloat(challengeDetails.score) === Number.parseFloat(challengeDetails.opponent.score) &&
                    <Text style={styles.headText}>Draw, you can try again</Text>
                }
                <WinningAmount challengeDetails={challengeDetails} practiceMode={practiceMode} cashMode={cashMode} />
                <FinalScore challengeDetails={challengeDetails} cashMode={cashMode} practiceMode={practiceMode} />
                {/* <BoostPopUp modalVisible={modalVisible} setModalVisible={setModalVisible} /> */}
                <View style={styles.gameButtons}>
                    <AppButton onPress={onPlayButtonClick} text='Stake again' disabled={loading} textStyle={styles.againText} style={styles.stakeButton} disabledStyle={styles.disabled} />
                    <AppButton onPress={goHome} text='Return to home' style={styles.homeButton} textStyle={styles.buttonText} />
                </View>
            </ScrollView>


        </ImageBackground>
    )
}

const WinningAmount = ({ challengeDetails, cashMode, practiceMode }) => {
    const amount = useSelector(state => state.triviaChallenge.challengeDetails.amount_won);
    return (
        <View style={styles.winningsContainer}>
            {practiceMode &&
                <Text style={styles.winningsHeader}>Demo scores</Text>
            }
            {cashMode &&
                <Text style={styles.winningsHeader}>Scores</Text>
            }
            <View style={styles.scoreCountContainer}>
                <View style={styles.userCountContainer}>
                    <Text style={styles.countName}>You</Text>
                    <Text style={styles.scoreCount}>{challengeDetails.score}</Text>
                </View>
                <View style={styles.userCountContainer}>
                    <Text style={styles.countName}>{challengeDetails.opponent.username}</Text>
                    <Text style={styles.scoreCount}>{challengeDetails.opponent.score}</Text>
                </View>
            </View>
            {/* {Number.parseFloat(challengeDetails.score) > Number.parseFloat(challengeDetails.opponent.score) &&
                <Text style={styles.winningsText}>You have won <Text style={styles.winningsAmount}> &#8358;{formatCurrency(amount)}!</Text></Text>
            } */}
        </View>
    )
}

const SelectedPlayers = ({ challengeDetails }) => {
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />

            <Image
                source={require('../../../../assets/images/versus.png')}
            />
            <SelectedPlayer playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
        </View>
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
        color: '#072169',
        textAlign: 'center',
        lineHeight: '2rem'
    },
    winningsContainer: {
        backgroundColor: '#AAD880',
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingVertical: '1.5rem',
        paddingHorizontal: '3rem',
        marginVertical: '.5rem',
        borderRadius: 10
    },
    winningsHeader: {
        fontSize: '.9rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
        textAlign: 'center',
    },
    scoreCountContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: '1rem'
    },
    userCountContainer: {
        alignItems: 'center'
    },
    countName: {
        fontSize: '.85rem',
        fontFamily: 'sansation-regular',
        color: '#072169',
        // width:'5rem',
        textAlign: 'center'
    },
    scoreCount: {
        fontSize: '1.5rem',
        fontFamily: 'gotham-bold',
        color: '#072169',

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
    username: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginBottom: '.4rem'
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
    homeButton: {
        marginVertical: 5,
        backgroundColor: 'none',
        borderWidth: 2,
        borderColor: '#072169',
        paddingVertical: normalize(19),
    },
    stakeButton: {
        marginBottom: 20,
        marginTop: 0,
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        color: '#072169'
    },
    againText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
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
    avatarBackground: {
        alignItems: 'center'
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#F6F4FF',
        borderRadius: 50,
    },
    username: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
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
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '1.3rem',
        marginBottom: '.7rem'
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: '1rem'
    },
    pointTitle: {
        color: '#072169',
        fontSize: '1.1rem',
        fontFamily: 'gotham-medium',
    },
    point: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
        marginLeft: '.7rem'
    },
})