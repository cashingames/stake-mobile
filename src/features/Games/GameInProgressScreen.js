import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Image, ScrollView, ImageBackground, Alert, StatusBar, BackHandler } from 'react-native';
import normalize from "../../utils/normalize";
import { unwrapResult } from '@reduxjs/toolkit';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';


import {
    endGame, nextQuestion, setHasPlayedTrivia
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



export default function GameInProgressScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const params = route.params;

    const gameSessionToken = useSelector(state => state.game.gameSessionToken);
    const chosenOptions = useSelector(state => state.game.chosenOptions);
    const consumedBoosts = useSelector(state => state.game.consumedBoosts);
    const isPlayingTrivia = useSelector(state => state.game.isPlayingTrivia);
    const user = useSelector(state => state.auth.user);
    const isEnded = useSelector(state => state.game.isEnded);

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }

    const [ending, setEnding] = useState(false);

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

        dispatch(endGame({
            token: gameSessionToken,
            chosenOptions,
            consumedBoosts
        }))
            .then(unwrapResult)
            .then(async () => {
                await analytics().logEvent('exhibition_completed', {
                    'action': 'complete',
                    'id': user.username

                });
                dispatch(logActionToServer({
                    message: "Game session " + gameSessionToken + " chosen options for " + user.username,
                    data: chosenOptions
                }))
                    .then(unwrapResult)
                    .then(result => {
                        // console.log(result, 'Action logged to server to end game');
                    })
                    .catch(() => {
                        // console.log('failed to log to server');
                    });
                setEnding(false);
                if (isPlayingTrivia) {
                    dispatch(setHasPlayedTrivia(true))
                    await analytics().logEvent('trivia_completed', {
                        'action': 'complete',
                        'id': user.username
                    })
                    navigation.navigate('TriviaEndResult', {
                        triviaId: params.triviaId,
                    })
                } else {
                    navigation.navigate('GameEndResult');
                }

            })
            .catch((rejectedValueOrSerializedError) => {
                setEnding(false);
                // console.log(rejectedValueOrSerializedError);
                Alert.alert('failed to end game')
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
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="contain">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader onPress={() => onEndGame(true)} onPressBoost={openBottomSheet} />
                <GameProgressAndBoosts onComplete={() => onEndGame()} ending={ending} />
                <GameQuestions />
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={350}
                    subComponent={<UserAvailableBoosts onClose={closeBottomSheet} />}
                />
            </ScrollView>
            <NextButton onPress={() => onEndGame()} ending={ending} />
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

const NextButton = ({ onPress, ending }) => {
    const dispatch = useDispatch()
    const isLastQuestion = useSelector(state => state.game.isLastQuestion);
    const pressNext = () => {
        dispatch(isLastQuestion ? onPress : nextQuestion())
    }

    return (
        <AppButton
            disabled={ending}
            text={isLastQuestion ? 'Finish' : 'Next'}
            onPress={pressNext}
            style={styles.nextButton}
        />
    )
}

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
        paddingTop: normalize(45),
    },
    image: {
        paddingHorizontal: normalize(18),
        backgroundColor: '#9C3DB8',
        flex: 1,
    },
    gameProgressAndBoost: {
        display: 'flex',
        backgroundColor: 'rgba(57, 15, 15, 0.4)',
        shadowColor: 'inset 0px 4px 0px rgba(0, 0, 0, 0.05)',
        borderRadius: 16,
        marginVertical: normalize(18)
    },
    nextButton: {
        marginVertical: 10,
    }
});
