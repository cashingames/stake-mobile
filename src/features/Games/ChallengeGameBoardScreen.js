import React from "react";
import { ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../utils/normalize";
import PlayGameHeader from "../../shared/PlayGameHeader";
import { useSelector } from "react-redux";

const ChallengeGameBoardScreen = () => {

    return (
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="contain">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader />
                <GameQuestions />
            </ScrollView>
        </ImageBackground>

    )
}

const GameQuestions = () => {
    const questions = useSelector(state => state.triviaChallenge.questions || []);
    return (
        <>
            {questions.map(question => <RenderQuestion key={question.question_id} question={question} />)}
        </>
    );
}

const RenderQuestion = ({ question }) => {
    return (
        <View>
            <Text>{question.label}</Text>
            {question.options.map(option => <RenderOption key={option.id} option={option} />)}
        </View>
    )
}

const RenderOption = ({ option }) => {
    return (
        <Pressable style={styles.answer} >
            <Text style={styles.answerText}>{option.title}</Text>
        </Pressable>
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
        // backgroundColor: '#9C3DB8',
        paddingTop: normalize(45),
    },
})
