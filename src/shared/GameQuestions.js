import React, { useState } from "react"
import { useEffect } from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import { questionAnswered, setCorrectAnswer, setSelectedOption, setShowCorrectAnswer } from "../features/Games/GameSlice";
import normalize, { responsiveScreenWidth } from "../utils/normalize";
import useSound from "../utils/useSound";
import GameOption from "./GameOption";


const GameQuestions = () => {
    const dispatch = useDispatch();
    const displayedQuestion = useSelector(state => state.game.displayedQuestion);
    const displayedOptions = useSelector(state => state.game.displayedOptions);
    const selectedOption = useSelector(state => state.game.selectedOption);
    const correctAnswer = useSelector(state => state.game.correctAnswer);
    const showCorrectAnswer = useSelector(state => state.game.showCorrectAnswer);
    const submissionResult = useSelector(state => state.game.submissionResult);
    const { playSound } = useSound(require('../../assets/sounds/button-clicked2.wav'));

    const optionSelected = (option) => {
        try {
            if (!option) {
                return; // add this check to handle undefined or null values
            }
            dispatch(questionAnswered(option));
            dispatch(setSelectedOption(option));
            dispatch(setCorrectAnswer(option.is_correct == 1))
            playSound()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        dispatch(setShowCorrectAnswer(false))
    }, [])

    return (
        <>
            <View style={styles.gameQuestions}>
                <Text style={styles.questions}>{displayedQuestion.label}</Text>
            </View>
            <View style={styles.options}>
                {displayedOptions.map((option, i) => <GameOption
                    option={option} key={i}
                    onSelected={() => optionSelected(option)}
                    correctAnswer={correctAnswer}
                    submissionResult={submissionResult}
                    selectedOption={selectedOption}
                    showCorrectAnswer={showCorrectAnswer}
                />)}
            </View>
        </>
    )
}
export default GameQuestions;

const styles = EStyleSheet.create({
    gameQuestions: {
        // width: normalize(270),
        paddingHorizontal: responsiveScreenWidth(3),
        marginBottom: normalize(20),
        borderRadius:15,
        padding:'1rem',
        backgroundColor: '#15397D'

    },
    options: {
        // paddingBottom: normalize(),
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
    }
})