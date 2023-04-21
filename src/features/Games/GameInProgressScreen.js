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
import DashboardSettings from "../../shared/DashboardSettings";
import GameSettings from "../../shared/GameSettings";



export default function GameInProgressScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const params = route.params;
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
                    await analytics().logEvent('exhibition_game_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate === newUserDate && !isStaking && !isPlayingTrivia) {
                    await analytics().logEvent('new_user_exhibition_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate === newUserDate && isStaking) {
                    await analytics().logEvent('new_user_staking_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate !== newUserDate && isStaking) {
                    crashlytics().log('User completed staking game');
                    await analytics().logEvent('staking_game_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                }
                dispatch(logActionToServer({
                    message: "Game session " + gameSessionToken + " chosen options for " + user.username,
                    data: chosenOptions
                }))
                setEnding(false);
                if (isPlayingTrivia) {
                    dispatch(setHasPlayedTrivia(true))
                    crashlytics().log('User completed live trivia');
                    await analytics().logEvent('live_trivia_completed', {
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
        Alert.alert(
            'Exit Game?',
            'You have an ongoing game. Do you want to submit this game ?',
            [
                {
                    text: "Continue playing",
                    style: 'cancel',
                    onPress: () => setEnding(false)
                },
                {
                    text: 'Exit',
                    onPress: () => {
                        // console.log("show exit from exit button")
                        onEndGame();
                    },
                },
            ]
        );
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
            </View>
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <TopIcons />
                <GameProgressAndBoosts onComplete={() => onEndGame()} ending={ending} />
                <GameQuestions />
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={350}
                    subComponent={<UserAvailableBoosts onClose={closeBottomSheet} />}
                />
            </ScrollView>
            <View style={styles.buttonCase}>
                <NextButton ending={ending} onEndGame={() => onEndGame()} />
                <View style={styles.setting}>
                    <GameSettings onPress={() => showExitConfirmation()} isDisabled={true} />
                </View>
            </View>
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
    buttonCase:{
        position: 'absolute',
        left:0,
        right:0,
        top:responsiveHeight(85),
    }
});
