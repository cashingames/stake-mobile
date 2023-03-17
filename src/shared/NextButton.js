import { useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet"
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion, pauseGame, setSelectedOption, setShowCorrectAnswer, setSubmissionResult } from "../features/Games/GameSlice";
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
            if(isLastQuestion){
                onEndGame()
            }else{
            pressNext();
            }
        },1000);
    };
    return (
        <AppButton
            disabled={ending}
            text={isLastQuestion ? 'Finish' : 'Next'}
            onPress={handleSubmission}
            style={styles.nextButton}
        />
    )
}

const styles = EStyleSheet.create({
    nextButton: {
        // position: 'absolute',
        // bottom: 0,
        // right: 0,
        // left: 0,
        // display: 'flex'
        marginVertical: 10
    }

})

export default NextButton