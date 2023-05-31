import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Image, ScrollView, ImageBackground, Alert, StatusBar, BackHandler } from 'react-native';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from "../../utils/normalize";
import { unwrapResult } from '@reduxjs/toolkit';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import {
    endGame, nextQuestion, setHasPlayedTrivia, setSelectedOption, setShowCorrectAnswer, setSubmissionResult
} from "./GameSlice";

import AppButton from "../../shared/AppButton";
import EStyleSheet from "react-native-extended-stylesheet";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { useFocusEffect } from "@react-navigation/native";
import PlayGameHeader from "../../shared/PlayGameHeader";
import GameTopicProgress from "../../shared/GameTopicProgress";
import AvailableGameSessionBoosts from "../../shared/AvailableGameSessionBoosts";
import GameQuestions from "../../shared/GameQuestions";
import UserAvailableBoosts from "../../shared/UserAvailableBoosts";
import { logActionToServer } from "../CommonSlice";
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import analytics from '@react-native-firebase/analytics';
import useSound from "../../utils/useSound";
import NextButton from "../../shared/NextButton";
import TopIcons from "../../shared/TopIcons";
import GameSettings from "../../shared/GameSettings";
import GameModal from "../../shared/GameModal";
import logToAnalytics from "../../utils/analytics";



export default function GameInProgressScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const params = route.params;
    const [showModal, setShowModal] = useState(false);
    const gameSessionToken = useSelector(state => state.game.gameSessionToken);
    const chosenOptions = useSelector(state => state.game.chosenOptions);
    const consumedBoosts = useSelector(state => state.game.consumedBoosts);
    const isPlayingTrivia = useSelector(state => state.game.isPlayingTrivia);
    const isStaking = useSelector(state => state.game.amountStaked);
    const user = useSelector(state => state.auth.user);
    const isEnded = useSelector(state => state.game.isEnded);
    const newUser = useSelector(state => state.auth.user.joinedOn);
    const newUserDate = newUser.slice(0, 10);
    let formattedDate = new Date().toISOString().split('T')[0];
    const { playSound } = useSound(require('../../../assets/sounds/game-started.mp3'))
    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }

    const [ending, setEnding] = useState(false);
    useEffect(() => {
        playSound()
    }, [])

    const onEndGame = (confirm = false) => {

        if (ending) {
            //doe not delete
            // console.log("Trying to end second time. If this happens, please notify Oye")
            return;
        }
        setShowModal(false)
        setEnding(true);
        if (confirm) {
            showExitConfirmation()
            return;
        }
        dispatch(setSelectedOption(null))
        dispatch(setSubmissionResult())
        dispatch(setShowCorrectAnswer(false))

        dispatch(endGame({
            token: gameSessionToken,
            chosenOptions,
            consumedBoosts
        }))
            .then(unwrapResult)
            .then(async () => {
                crashlytics().log('User completed exhibition game');
                if (formattedDate !== newUserDate && !isStaking && !isPlayingTrivia) {
                    logToAnalytics('exhibition_game_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate === newUserDate && !isStaking && !isPlayingTrivia) {
                    logToAnalytics('new_user_exhibition_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                dispatch(logActionToServer({
                    message: "Game session " + gameSessionToken + " chosen options for " + user.username,
                    data: chosenOptions
                }))
                setEnding(false);
                if (isPlayingTrivia) {
                    dispatch(setHasPlayedTrivia(true))
                    crashlytics().log('User completed live trivia');
                    logToAnalytics('live_trivia_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    })
                    navigation.navigate('TriviaEndResult', {
                        triviaId: params.triviaId,
                    })
                } else {
                    navigation.navigate('GameEndResult');
                }
            })
            .catch((error, rejectedValueOrSerializedError) => {
                crashlytics().recordError(error);
                crashlytics().log('failed to end exhibition game');
                setEnding(false);
                // console.log(rejectedValueOrSerializedError);
                Alert.alert('failed to end game')
            });
    }

    const showExitConfirmation = () => {
        // onEndGame();
        setShowModal(true)
    }

    //disable back button
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('light-content');
        }, [])
    );

    if (isEnded) {
        return null;
    }
    return (
        <ImageBackground source={require('../../../assets/images/quiz-background-large.png')}
            style={styles.image}
            resizeMode="cover" >
            <View style={styles.top}>
                <TopIcons />
            </View>
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <GameProgressAndBoosts onComplete={() => onEndGame()} ending={ending} />
                <GameQuestions />
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={350}
                    subComponent={<UserAvailableBoosts onClose={closeBottomSheet} />}
                />
            </ScrollView>
            <View style={styles.buttonCase}>
                <View style={styles.nextBtnCase}>
                    <NextButton ending={ending} onEndGame={() => onEndGame()} />
                </View>
                <View style={styles.setting}>
                    <GameSettings navigationHandler={() => showExitConfirmation()} isDisabled={true} />
                </View>
            </View>
            <GameModal
                showModal={showModal}
                setShowModal={setShowModal}
                multipleBtn={true}
                title='Exit Game?'
                modalBody='You have an ongoing game. Do you want to end this game ?'
                btnText='Yes'
                btnText_2='No'
                btnHandler_2={() => setShowModal(false)}
                btnHandler={() => onEndGame()}
            />
        </ImageBackground>
    );
}

const GameProgressAndBoosts = ({ onComplete, ending }) => {
    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress onComplete={onComplete} ending={ending} />
            <AvailableGameSessionBoosts />
        </View>
    )
}

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: responsiveScreenWidth(6),
    },
    image: {
        width: responsiveWidth(100),
        height: responsiveHeight(100)
    },
    gameProgressAndBoost: {
        display: 'flex',
        backgroundColor: 'rgba(57, 15, 15, 0.4)',
        shadowColor: 'inset 0px 4px 0px rgba(0, 0, 0, 0.05)',
        borderRadius: 16,
        // marginVertical: normalize(18)
        marginVertical: normalize(10)
    },
    setting: {
        // marginBottom: normalize(8)
    },
    top: {
        paddingTop: responsiveHeight(2),
    },
    buttonCase: {
        paddingBottom: normalize(20),
    },
    nextBtnCase: {
        paddingHorizontal: responsiveScreenWidth(6),
    }
});
