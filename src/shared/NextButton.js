import { useState } from "react";
import { Text } from "react-native";
import { Pressable } from "react-native";
import { View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet"
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion, pauseGame, setSelectedOption, setShowCorrectAnswer, setSubmissionResult } from "../features/Games/GameSlice";
import normalize from "../utils/normalize";
import useSound from "../utils/useSound";
import AppButton from "./AppButton"

const NextButton = ({ ending, onEndGame }) => {
    const dispatch = useDispatch();
    const selectedOption = useSelector(state => state.game.selectedOption);
    const correctAnswer = useSelector(state => state.game.correctAnswer);
    const isLastQuestion = useSelector(state => state.game.isLastQuestion);
    const [timerId, setTimerId] = useState(null);
    const submitBtnSound = useSound(require('../../assets/sounds/pop-up.wav'));


    const pressNext = () => {
        dispatch(nextQuestion())
        dispatch(pauseGame(false))
        dispatch(setSelectedOption(null))
        dispatch(setSubmissionResult())
        dispatch(setShowCorrectAnswer(false))
    }


    const handleSubmission = () => {
        if (correctAnswer) {
            dispatch(setSubmissionResult(true));
        } else {
            dispatch(setSubmissionResult(false));
        }

        if (selectedOption) {
            dispatch(pauseGame(true))
        }

        if (isLastQuestion) {
            const id = setTimeout(() => {
                onEndGame();
            }, 300);
            setTimerId(id);
        }
        dispatch(setShowCorrectAnswer(true))
        submitBtnSound.playSound()

        let timeoutId;
        timeoutId = setTimeout(() => {
            if (isLastQuestion) {
                onEndGame()
            } else {
                pressNext();
            }
        }, 1000);
    };
    return (
        <View style={styles.btnContainer}>
            <Pressable
                style={ ending ? styles.disabled : styles.nextButton}
                onPress={handleSubmission}
                disabled={ending}
            >
                <Text style={styles.btnText}>{isLastQuestion ? 'Finish' : 'Next'}</Text>
            </Pressable>
            {/* <AppButton
            disabled={ending}
            text=
            onPress={handleSubmission}
            style={styles.nextButton}
        /> */}
        </View>
    )
}

const styles = EStyleSheet.create({

    btnContainer: {
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: '#15397D',
        borderRadius: 20,
        height: normalize(35),
        paddingHorizontal: 60,
        justifyContent: 'center',
        borderBottomColor: '#0A1F45',
        borderBottomWidth: 4,
    },
    btnText:{
        color:'#fff',
        fontSize:'0.9rem',
        fontFamily:'blues-smile'
    },
    disabled: {
        backgroundColor: 'gray',
        borderRadius: 20,
        height: normalize(42),
        paddingHorizontal: 60,
        justifyContent: 'center',
        borderBottomColor: '#0A1F45',
        borderBottomWidth: 4,
      },

})

export default NextButton