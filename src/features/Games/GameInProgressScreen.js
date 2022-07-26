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


export default function GameInProgressScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const params = route.params;

    const gameSessionToken = useSelector(state => state.game.gameSessionToken);
    const chosenOptions = useSelector(state => state.game.chosenOptions);
    const consumedBoosts = useSelector(state => state.game.consumedBoosts);
    const isPlayingTrivia = useSelector(state => state.game.isPlayingTrivia);

    const [ending, setEnding] = useState(false);

    const onEndGame = (confirm = false) => {

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
            .then(() => {
                setEnding(false);
                if (isPlayingTrivia) {
                    dispatch(setHasPlayedTrivia(true));
                    navigation.navigate('TriviaEndResult', {
                        triviaId: params.triviaId,
                    })
                } else {
                    navigation.navigate('GameEndResult');
                }

            })
            .catch((rejectedValueOrSerializedError) => {
                setEnding(false);
                console.log(rejectedValueOrSerializedError);
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
                        console.log("show exit from exit button")
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

    useEffect(() => {
        StatusBar.setBackgroundColor('#9C3DB8');
        StatusBar.setBarStyle('light-content');
        return () => {
            StatusBar.setBackgroundColor('#FFFF');
            StatusBar.setBarStyle('dark-content');
        }
    }, []);

    return (
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="contain">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader onPress={() => onEndGame(true)} onPressBoost={() => refRBSheet.current.open()} />
                <GameProgressAndBoosts onComplete={() => onEndGame()} ending={ending} />
                <GameQuestions />
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={400}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0, 0, 0, 0.5)"
                        },
                        draggableIcon: {
                            backgroundColor: "#000",
                        },
                        container: {
                            borderTopStartRadius: 25,
                            borderTopEndRadius: 25,
                        }
                    }}
                >
                    <UserAvailableBoosts />
                </RBSheet>
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
        console.log('pressed next')
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
        paddingTop: normalize(40),
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
