import React from "react";
import { Pressable, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize, { responsiveScreenWidth } from "../utils/normalize";
import { Ionicons } from "@expo/vector-icons";

const GameOption = ({ option: { title, isSelected }, onSelected }) => {
    return (
        <Pressable style={styles.answer} onPress={onSelected}>
            <Ionicons name={isSelected ? 'checkmark-circle' : "ellipse-outline"} size={30} color={isSelected ? '#00FFA3' : '#D9D9D9'} />
            <Text style={styles.answerText}>{title}</Text>
        </Pressable>
    )
}
export default GameOption;

const styles = EStyleSheet.create({
    answer: {
        flexDirection: 'row',
        alignItems:'center',
        marginBottom:'1rem',
        height: responsiveScreenWidth(8)
    },
    answerText: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
    },
})