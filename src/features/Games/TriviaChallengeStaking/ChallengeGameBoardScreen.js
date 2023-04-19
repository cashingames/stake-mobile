import React, { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, ImageBackground, Platform, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from '@reduxjs/toolkit';
import firestore from "@react-native-firebase/firestore";
import analytics from '@react-native-firebase/analytics';
import { getNextQuestion, selectedOption, setChallengeDetails, submitGameSession, setIsEnded } from "./TriviaChallengeGameSlice";
import ChallengeGameBoardWidgets from "./ChallengeGameBoardWidgets";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import PlayGameHeader from "../../../shared/PlayGameHeader";
import AppButton from "../../../shared/AppButton";

const ChallengeGameBoardScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const documentId = useSelector(state => state.triviaChallenge.documentId);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const isEnded = useSelector(state => state.triviaChallenge.isEnded);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        analytics().logEvent("trivia_challenge_stake_started", {
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
        <ImageBackground source={require('../../../../assets/images/game_mode.png')} style={styles.image} resizeMode="contain">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader onPress={showExitConfirmation} />
                <ChallengeGameBoardWidgets onComplete={gameEnded} />
                <RenderQuestion />
            </ScrollView>
            <RenderActionButton onEnd={gameEnded} submitting={submitting} />
        </ImageBackground>

    )
}

const RenderQuestion = () => {
    const dispatch = useDispatch();
    const currentQuestion = useSelector(state => state.triviaChallenge.currentQuestion || []);
    const options = currentQuestion.options;

    const optionSelected = (option) => {
        dispatch(selectedOption(option));
    }
    return (
        <View style={styles.gameQuestions}>
            <Text style={styles.questions}>{currentQuestion.label}</Text>
            <View style={styles.options}>
                {options.map(option => <RenderOption key={option.id} option={option} onSelect={optionSelected} />)}
            </View>
        </View>
    )
}

const RenderOption = ({ option, onSelect }) => {
    const activeStyle = option.active ? styles.activeOption : '';
    return (
        <Pressable
            style={[styles.optionContainer, activeStyle]}
            onPress={() => onSelect(option)} >
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
        />

    )
}
export default ChallengeGameBoardScreen;

const styles = EStyleSheet.create({
    image: {
        paddingHorizontal: normalize(18),
        backgroundColor: '#9C3DB8',
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: responsiveScreenWidth(10),
    },
    gameQuestions: {
        // marginHorizontal: normalize(15),
    },
    options: {
        paddingBottom: normalize(45),
    },
    questions: {
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.9rem',
        lineHeight: normalize(26),
        marginTop: '1rem',
        marginBottom: '2rem'
    },
    optionContainer: {
        backgroundColor: '#FFFF',
        marginBottom: normalize(8),
        padding: normalize(12),
        borderRadius: 16,
        borderBottomColor: '#C97AE0',
        borderBottomWidth: 7,
    },
    optionText: {
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
        textAlign: 'center',
    },
    activeOption: {
        backgroundColor: '#F5D2FF'
    },
    nextButton: {
        display: 'flex',
        // marginTop:'7rem'
    }
})
