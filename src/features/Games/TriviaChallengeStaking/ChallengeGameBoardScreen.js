import React, { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, Image, ImageBackground, Platform, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import firestore from "@react-native-firebase/firestore";
import { getNextQuestion, selectedOption, setChallengeDetails, submitGameSession, setIsEnded } from "./TriviaChallengeGameSlice";
import ChallengeGameBoardWidgets from "./ChallengeGameBoardWidgets";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import PlayGameHeader from "../../../shared/PlayGameHeader";
import AppButton from "../../../shared/AppButton";
import logToAnalytics from "../../../utils/analytics";
import { isTrue } from "../../../utils/stringUtl";
import Constants from 'expo-constants';
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const ChallengeGameBoardScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const documentId = useSelector(state => state.triviaChallenge.documentId);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const isEnded = useSelector(state => state.triviaChallenge.isEnded);
    const [submitting, setSubmitting] = useState(false);
    const user = useSelector(state => state.auth.user);


    useEffect(() => {
        logToAnalytics("trivia_challenge_stake_started", {
            'documentId': documentId,
            'opponentName': challengeDetails.opponent.username,
            'username': challengeDetails.username,
        })
    }, [])

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

    const gameEnded = () => {
        if (isEnded) {
            console.log("game already ended", "timer bug is trying to submit again");
            return;
        };

        setSubmitting(true);
        dispatch(setIsEnded(true));
        dispatch(submitGameSession())
            .then(unwrapResult)
            .then(async () => {
                const status = await getOpponentStatus();
                setSubmitting(false);
                navigation.navigate(
                    status === 'MATCHED' ?
                        'ChallengeGameEndWaiting' : 'ChallengeEndGame'
                );
            });
    }
    const showExitConfirmation = () => {
        Alert.alert(
            'Exit Game?',
            'You have an ongoing game. Do you want to submit this game ?',
            [
                {
                    text: "Continue playing",
                    style: 'cancel',
                    onPress: () => setSubmitting(false)
                },
                {
                    text: 'Exit',
                    onPress: () => {
                        // console.log("show exit from exit button")
                        gameEnded();
                    },
                },
            ]
        );
    }

    const getOpponentStatus = async () => {
        const result = await firestore()
            .doc(documentId)
            .get();

        const data = result.data();
        dispatch(setChallengeDetails(data));
        return data.opponent.status;
    }

    return (
        <ImageBackground source={require('../../../../assets/images/game-play-background.png')} style={styles.image} resizeMode="contain">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader onPress={showExitConfirmation} challengeGame={true} />
                <ChallengeGameBoardWidgets />
                <SelectedPlayers user={user} challengeDetails={challengeDetails} />
                <RenderQuestion onComplete={gameEnded} onEnd={gameEnded} submitting={submitting} />
            </ScrollView>
        </ImageBackground>

    )
}

const SelectedPlayers = ({ user, challengeDetails }) => {
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

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

const RenderQuestion = ({ onComplete, onEnd, submitting }) => {
    const dispatch = useDispatch();
    const currentQuestion = useSelector(state => state.triviaChallenge.currentQuestion || []);
    const options = currentQuestion.options;
    const countdownKey = useSelector(state => state.triviaChallenge.countdownKey);
    const isGamePaused = useSelector(state => state.triviaChallenge.countdownFrozen);
    const gameDuration = useSelector(state => state.triviaChallenge.gameDuration);
    const currentQuestionIndex = useSelector(state => state.triviaChallenge.currentQuestionIndex);


    const optionSelected = (option) => {
        dispatch(selectedOption(option));
    }
    return (

        <View style={styles.questionsContainer}>
            <ImageBackground source={require('../../../../assets/images/coins-background.png')} style={{ flex: 1 }}>
                <View style={styles.timerContainer}>
                    <Text style={styles.questionCount}>Q{currentQuestionIndex + 1}</Text>
                    <View>
                        <CountdownCircleTimer
                            // isPlaying
                            isPlaying={!isGamePaused}
                            duration={gameDuration}
                            colors={['#F2C8BC', '#E15220', '#E15220']}
                            colorsTime={[gameDuration / 2, gameDuration / 4, 0]}
                            trailColor="#E15220"
                            size={50}
                            strokeWidth={5}
                            key={countdownKey}
                            onComplete={onComplete}

                        >
                            {({ remainingTime, animatedColor }) => (
                                <Animated.Text style={styles.timeText}>
                                    {remainingTime}
                                </Animated.Text>
                            )}
                        </CountdownCircleTimer>
                    </View>
                </View>
                <View style={styles.gameQuestions}>
                    <Text style={styles.questions}>{currentQuestion.label}</Text>
                </View>
                <Text style={styles.pickText}>Pick correct answer</Text>
                <View style={styles.options}>
                    {options.map((option, i) => <RenderOption option={option} key={option.id} onSelect={optionSelected} />)}
                </View>
                <RenderActionButton onEnd={onEnd} submitting={submitting} />
            </ImageBackground>
        </View>
    )
}

const RenderOption = ({ option, onSelect }) => {
    const activeStyle = option.active ? styles.activeOption : '';
    return (
        <Pressable
            style={styles.answer}
            onPress={() => onSelect(option)} >
            <Ionicons name={option.active ? 'checkmark-circle' : "ellipse-outline"} size={30} color={option.active ? '#00FFA3' : '#D9D9D9'} />
            <Text style={styles.optionText}>{option.title}</Text>
        </Pressable>
    )
}

const RenderActionButton = ({ onEnd, submitting }) => {
    const dispatch = useDispatch();
    const totalQuestions = useSelector(state => state.triviaChallenge.totalQuestions);
    const currentQuestionIndex = useSelector(state => state.triviaChallenge.currentQuestionIndex);
    const isLastQuestion = totalQuestions - 1 === currentQuestionIndex;

    const onPress = () => {

        if (isLastQuestion) {
            onEnd()
        }
        else
            dispatch(getNextQuestion());

    }

    return (
        <AppButton
            text={isLastQuestion ? 'Finish' : 'Next'}
            onPress={onPress}
            style={styles.nextButton}
            disabled={submitting}
            disabledStyle={styles.disabled}
        />

    )
}
export default ChallengeGameBoardScreen;

const styles = EStyleSheet.create({
    image: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop: responsiveScreenWidth(18),
    },
    // options: {
    //     paddingBottom: normalize(45),
    // },

    activeOption: {
        backgroundColor: '#F5D2FF'
    },
    nextButton: {
        display: 'flex',
        marginTop: 0
    },
    disabled: {
        backgroundColor: '#EA8663'
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
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        backgroundColor: '#fff'
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
    questionsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        paddingHorizontal: '1.3rem',
        paddingVertical: '1rem',
        marginBottom: '5.5rem'
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pickText: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        marginBottom: '.8rem'
    },
    gameQuestions: {
        marginBottom: normalize(20)

    },
    questions: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
        lineHeight: normalize(26)
    },
    timeText: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem',
    },
    questionCount: {
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
        color: '#072169',
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
    answer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '1rem',
        height: responsiveScreenWidth(8),
        // backgroundColor: 'red',
    },
    optionText: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '0.9rem',
    },
})
