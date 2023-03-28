import React from "react";
import { ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import PlayGameHeader from "../../shared/PlayGameHeader";
import { useDispatch, useSelector } from "react-redux";
import { getNextQuestion, selectedOption } from "./TriviaChallengeStaking/TriviaChallengeGameSlice";
import AppButton from "../../shared/AppButton";
import ChallengeGameBoardProgress from "./TriviaChallengeStaking/ChallengeGameBoardProgress";
import { useNavigation } from "@react-navigation/native";

const ChallengeGameBoardScreen = ({ navigation }) => {
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const opponentStatus = challengeDetails.opponent.status


    const gameEnded = () => {
        if (opponentStatus === 'ONGOING') {
            navigation.navigate('ChallengeGameEndWaiting');
            return
        }
        navigation.navigate('ChallengeEndGame');
    }

    return (
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="contain">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader />
                <ChallengeGameBoardProgress onComplete={gameEnded} />
                <RenderQuestion />
                <RenderActionButton endGame={gameEnded} />
            </ScrollView>
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

const RenderActionButton = ({endGame}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const totalQuestions = useSelector(state => state.triviaChallenge.totalQuestions);
    const currentQuestionIndex = useSelector(state => state.triviaChallenge.currentQuestionIndex);
    const isLastQuestion = totalQuestions - 1 === currentQuestionIndex;

    const onPress = () => {

        if (isLastQuestion) {
            endGame()
        }
        else
            dispatch(getNextQuestion());

    }

    return (
        <AppButton
            text={isLastQuestion ? 'Finish' : 'Next'}
            onPress={onPress}
            style={styles.nextButton}
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
        paddingTop: responsiveScreenWidth(15),
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
