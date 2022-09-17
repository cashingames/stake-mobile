import { Base64 } from "js-base64";
import React from "react"
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import { questionAnswered } from "../features/Games/GameSlice";
import normalize from "../utils/normalize";
import GameOption from "./GameOption";

const GameQuestions = () => {
    const dispatch = useDispatch();
    const displayedQuestion = useSelector(state => state.game.displayedQuestion);
    const displayedOptions = useSelector(state => state.game.displayedOptions);

    const optionSelected = (option) => {
        dispatch(questionAnswered(option));
    }

    return (
        <>
            <View style={styles.gameQuestions}>
                <Text style={styles.questions}>{Base64.decode(displayedQuestion.label)}</Text>
            </View>
            <View style={styles.options}>
                {displayedOptions.map((option, i) => <GameOption option={option} key={i} onSelected={() => optionSelected(option)} />)}
            </View>
        </>
    )
}
export default GameQuestions;

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

    })