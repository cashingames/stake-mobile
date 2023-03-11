import React, { useState } from "react"
import { useEffect } from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion, pauseGame, questionAnswered, setCorrectAnswer, setSelectedOption, setShowCorrectAnswer, setSubmissionResult } from "../features/Games/GameSlice";
import normalize from "../utils/normalize";
import useSound from "../utils/useSound";
import AppButton from "./AppButton";
import GameOption from "./GameOption";
import { Base64 } from "js-base64";


const GameQuestions = ({ onEndGame, ending }) => {
    const dispatch = useDispatch();
    const displayedQuestion = useSelector(state => state.game.displayedQuestion);
    const displayedOptions = useSelector(state => state.game.displayedOptions);
    const selectedOption = useSelector(state => state.game.selectedOption);
    const correctAnswer = useSelector(state => state.game.correctAnswer);
    const showCorrectAnswer = useSelector(state => state.game.showCorrectAnswer);
    const submissionResult = useSelector(state => state.game.submissionResult);
    const isLastQuestion = useSelector(state => state.game.isLastQuestion);
    const [submit, setSubmit] = useState(true)
    const [timerId, setTimerId] = useState(null);



    const { playSound } = useSound(require('../../assets/sounds/button-clicked1.mp3'));
    const submitBtnSound = useSound(require('../../assets/sounds/pop-up.wav'));
    const nextBtnSound = useSound(require('../../assets/sounds/button-clicked2.wav'));

    const optionSelected = (option) => {
        try {
            if (!option) {
                return; // add this check to handle undefined or null values
            }
            dispatch(questionAnswered(option));
            dispatch(setSelectedOption(option));
            dispatch(setCorrectAnswer(Base64.decode(option.is_correct) == 1))
            playSound()
        } catch (error) {
            console.log(error)
        }
    }

    const pressNext = () => {
        dispatch(nextQuestion())
        dispatch(pauseGame(false))
        setSubmit(!submit)
        dispatch(setSelectedOption(null))
        dispatch(setSubmissionResult())
        dispatch(setShowCorrectAnswer(false))
        nextBtnSound.playSound()
    }


    const handleSubmission = () => {
        if (correctAnswer) {
            dispatch(setSubmissionResult(true));
        } else {
            dispatch(setSubmissionResult(false));
        }
        console.log('hello world')
        setSubmit(!submit)

        if (selectedOption) {
            dispatch(pauseGame(true))
            console.log('paused game')
        }

        if (isLastQuestion) {
            const id = setTimeout(() => {
                onEndGame();
            }, 1000);
            setTimerId(id);
        }
        dispatch(setShowCorrectAnswer(true))
        submitBtnSound.playSound()
    };

    useEffect(() => {
        dispatch(setShowCorrectAnswer(false))
    }, [])

    return (
        <>
            <View style={styles.gameQuestions}>
                <Text style={styles.questions}>{Base64.decode(displayedQuestion.label)}</Text>
            </View>
            <View style={styles.options}>
                {displayedOptions.map((option, i) => <GameOption
                    option={option} key={i}
                    onSelected={() => optionSelected(option)}
                    correctAnswer={correctAnswer}
                    submit={submit}
                    submissionResult={submissionResult}
                    selectedOption={selectedOption}
                    showCorrectAnswer={showCorrectAnswer}
                />)}
            </View>
            <View style={styles.buttonContainer}>
                <NextButton onPress={handleSubmission} submit={submit} next={pressNext} ending={ending} selectedOption={selectedOption} isLastQuestion={isLastQuestion} />
            </View>
        </>
    )
}
export default GameQuestions;

const NextButton = ({ onPress, ending, submit, next, isLastQuestion }) => {
    return (
        <AppButton
            disabled={ending}
            text={submit ? 'Submit' : (isLastQuestion ? 'Finish' : 'Next')}
            onPress={submit ? onPress : next}
            style={styles.nextButton}
        />
    )
}

const styles = EStyleSheet.create({
    gameQuestions: {
        // width: normalize(270),
        marginHorizontal: normalize(15),
        marginBottom: normalize(20)

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
        lineHeight: normalize(26)
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex'
    }

})