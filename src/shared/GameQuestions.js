import React from "react"
import { ImageBackground, Text, View, Animated } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion, questionAnswered } from "../features/Games/GameSlice";
import normalize from "../utils/normalize";
import GameOption from "./GameOption";
import AppButton from "./AppButton";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'



const GameQuestions = ({ onPress, ending, onComplete, exiting }) => {
    const dispatch = useDispatch();
    const displayedQuestion = useSelector(state => state.game.displayedQuestion);
    const displayedOptions = useSelector(state => state.game.displayedOptions);
    const countdownKey = useSelector(state => state.game.countdownKey);
    const isGamePaused = useSelector(state => state.game.countdownFrozen);
    const gameDuration = useSelector(state => state.game.gameDuration);
    const isEnded = useSelector(state => state.game.isEnded);
    const index = useSelector(state => state.game.currentQuestionPosition);

    const optionSelected = (option) => {
        dispatch(questionAnswered(option));
    }

    return (
        <View style={styles.questionsContainer}>
            <ImageBackground source={require('../../assets/images/coins-background.png')} style={{ flex: 1 }}>
                <View style={styles.timerContainer}>
                    <Text style={styles.questionCount}>Q{index + 1}</Text>
                    <View>
                        {!isEnded &&
                            <CountdownCircleTimer
                                // isPlaying
                                isPlaying={!isGamePaused && !ending}
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
                        }
                    </View>
                </View>
                <View style={styles.gameQuestions}>
                    <Text style={styles.questions}>{displayedQuestion.label}</Text>
                </View>
                <Text style={styles.pickText}>Pick correct answer</Text>
                <View style={styles.options}>
                    {displayedOptions.map((option, i) => <GameOption option={option} key={i} onSelected={() => optionSelected(option)} />)}
                </View>
                <NextButton onPress={onPress} ending={ending} exiting={exiting} index={index} />
            </ImageBackground>
        </View>
    )
}

const NextButton = ({ onPress, ending, exiting, index }) => {
    const dispatch = useDispatch()
    const isLastQuestion = useSelector(state => state.game.isLastQuestion);
    const pressNext = () => {
        dispatch(isLastQuestion ? onPress : nextQuestion())
    }

    return (
        <AppButton
            disabled={ending || exiting}
            text={isLastQuestion ? 'Finish' : `Next Q${index + 2}`}
            onPress={pressNext}
            style={styles.nextButton}
            disabledStyle={styles.disabled}
        />
    )
}
export default GameQuestions;

const styles = EStyleSheet.create({
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
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        marginBottom: '.8rem'
    },
    gameQuestions: {
        marginBottom: normalize(20)

    },
    questions: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
        lineHeight: normalize(26)
    },
    timeText: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem',
    },
    questionCount: {
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
        color: '#072169',
    },
    disabled: {
        backgroundColor: '#EA8663'
    },

})