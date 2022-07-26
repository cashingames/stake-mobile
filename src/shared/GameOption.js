import { Base64 } from "js-base64";
import React from "react";
import { Pressable, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";

const GameOption = ({ option: { title, isSelected }, onSelected }) => {
    return (
        <Pressable style={[styles.answer, isSelected ? styles.selectedOption : {}]} onPress={onSelected}>
            <Text style={styles.answerText}>{Base64.decode(title)}</Text>
        </Pressable>
    )
}
export default GameOption;

const styles = EStyleSheet.create({
    answer: {
        backgroundColor: '#FFFF',
        marginBottom: normalize(8),
        padding: normalize(12),
        borderRadius: 16,
        borderBottomColor: '#C97AE0',
        borderBottomWidth: 7,
    },
    answerText: {
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
        textAlign: 'center',
    },
    selectedOption: {
        backgroundColor: '#F5D2FF'
    },
})