import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import firestore from "@react-native-firebase/firestore";
import { getNextQuestion, selectedOption, setChallengeDetails, submitGameSession, setIsEnded, submitPracticeGameSession } from "./TriviaChallengeGameSlice";
import ChallengeGameBoardWidgets from "./ChallengeGameBoardWidgets";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import PlayGameHeader from "../../../shared/PlayGameHeader";
import AppButton from "../../../shared/AppButton";
import logToAnalytics from "../../../utils/analytics";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DoubleButtonAlert from "../../../shared/DoubleButtonAlert";
import CustomAlert from "../../../shared/CustomAlert";


const ChallengeGameBoardScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const documentId = useSelector(state => state.triviaChallenge.documentId);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const isEnded = useSelector(state => state.triviaChallenge.isEnded);
    const [submitting, setSubmitting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [exiting, setExiting] = useState(false);
    const [exitClicked, setExitClicked] = useState(false);
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);


    const startModal = () => {
        setModalVisible(true)
    }


    useEffect(() => {
        logToAnalytics("trivia_challenge_stake_started", {
            'documentId': documentId,
            'opponentName': challengeDetails.opponent.username,
            'username': challengeDetails.username,
        })
    }, [])

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
        setExitClicked(false)
        setModalVisible(false)
        if (isEnded) {
            return;
        };

        setSubmitting(true);
        dispatch(setIsEnded(true));
        if (cashMode) {
            dispatch(submitGameSession())
                .then(unwrapResult)
                .then(async () => {
                    const status = await getOpponentStatus();
                    setSubmitting(false);
                    navigation.navigate(
                        status === 'MATCHED' ?
                            'ChallengeGameEndWaiting' : 'ChallengeEndGame'
                    );
                })
                .catch((error, rejectedValueOrSerializedError) => {
                    crashlytics().recordError(error);
                    crashlytics().log('failed to end challenge game');
                    setEnding(false);
                    startModal()
                    setAlertMessage("failed to end game");
                });
        }
        if (practiceMode) {
            dispatch(submitPracticeGameSession())
                .then(unwrapResult)
                .then(async () => {
                    const status = await getOpponentStatus();
                    setSubmitting(false);
                    navigation.navigate(
                        status === 'MATCHED' ?
                            'ChallengeGameEndWaiting' : 'ChallengeEndGame'
                    );
                })
                .catch((error, rejectedValueOrSerializedError) => {
                    crashlytics().recordError(error);
                    crashlytics().log('failed to end demo challenge game');
                    setEnding(false);
                    startModal()
                    setAlertMessage("failed to end demo game");
                });

        }
    }
    const showExitConfirmation = () => {
        setExitClicked(true);
        startModal()
        if (practiceMode) {
            setAlertMessage("Are you sure you want to cancel demo game?");
        }
        else if (cashMode) {
            setAlertMessage("Are you sure you want to end staked game?");
        }    }

    const getOpponentStatus = async () => {
        const result = await firestore()
            .doc(documentId)
            .get();

        const data = result.data();
        dispatch(setChallengeDetails(data));
        return data.opponent.status;
    }
    const close = () => {
        navigation.navigate('Home');
    }

    return (
        <ImageBackground source={require('../../../../assets/images/game-play-background.png')} style={styles.image} resizeMode="contain">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader onPress={showExitConfirmation} challengeGame={true} />
                <ChallengeGameBoardWidgets />
                <RenderQuestion onComplete={gameEnded} onEnd={gameEnded} submitting={submitting} exiting={exiting} />
                {exitClicked ?
                    <DoubleButtonAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                        textLabel={alertMessage} buttonLabel='Continue playing' actionLabel='Exit'
                        alertImage={require('../../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} onPress={() => gameEnded()} />
                    :
                    <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                        textLabel={alertMessage} buttonLabel='Ok, got it'
                        alertImage={require('../../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={close} />
                }
            </ScrollView>
        </ImageBackground>

    )
}

const RenderQuestion = ({ onComplete, onEnd, submitting, exiting }) => {
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
                <RenderActionButton onEnd={onEnd} submitting={submitting} exiting={exiting} />
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

const RenderActionButton = ({ onEnd, submitting, exiting }) => {
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
            disabled={submitting || exiting}
            disabledStyle={styles.disabled}
        />

    )
}
export default ChallengeGameBoardScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop: responsiveScreenWidth(13),
    },
    image: {
        flex: 1,

    },

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
        color: '#1C453B',
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
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        marginBottom: '.8rem'
    },
    gameQuestions: {
        marginBottom: normalize(20)

    },
    questions: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
        lineHeight: normalize(26)
    },
    timeText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem',
    },
    questionCount: {
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
        color: '#1C453B',
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
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
    },
})
