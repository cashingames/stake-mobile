import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import { Base64 } from "js-base64";


const GameOption = ({ option: { title, isSelected, is_correct }, onSelected, submissionResult, selectedOption, showCorrectAnswer}) => {
    const [showTrue, setShowTrue] = useState(null)
    const isWrongOption = isSelected && submissionResult == false;
    const isCorrectOption = isSelected && submissionResult;
    // const showRight = !isSelected && !submissionResult;

    useEffect(() => {
        if(selectedOption && showCorrectAnswer){
            try {
                const a = is_correct ? Base64.decode(is_correct) : null;                
                const showCorrectOption = !isSelected && a == 1;
                setShowTrue(showCorrectOption);
              } catch (error) {
                console.log("Error decoding base64 string:", error);
              }
        }else{
            setShowTrue(null)
        }
    }, [selectedOption, showCorrectAnswer])

    // console.log(isCorrectAnswer)
    return (
        <Pressable  style={[styles.answer, isSelected ? styles.selectedOption : {}, 
            isCorrectOption ? styles.correctOption :{}, 
            isWrongOption ? styles.wrongOption : {},
            // showRight ? styles.answer : {},
            showTrue ? styles.correctOption : {}]} 
            onPress={onSelected}>
            <Text style={styles.answerText}>{Base64.decode(title)}</Text>
            {isCorrectOption || showTrue ? <Text style={styles.checkmark}> <Ionicons name="checkmark-sharp" size={15} color="#6FCF97" /></Text> : <></>}
        </Pressable>
    )
}
export default GameOption;

const styles = EStyleSheet.create({
    answer: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        marginBottom: normalize(10),
        padding: normalize(15),
        borderRadius: 16,
        borderBottomColor: '#C97AE0',
        borderBottomWidth: 7,
    },
    answerText: {
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
        textAlign: 'left',
    },
    selectedOption: {
        backgroundColor: '#F5D2FF'
    },
    correctOption: {
        backgroundColor: 'rgba(111, 207, 151, 0.76)',
        borderBottomColor: '#6FCF97',
        borderBottomWidth: 7,
    },
    wrongOption: {
        backgroundColor: 'rgba(255, 68, 9, 0.42)',
        borderBottomColor: '#FF4409',
    },
    checkmark: {
        display: 'flex',
        marginLeft: 'auto',
        marginBottom: normalize(2),
        backgroundColor: '#fff',
        borderRadius: 100,
        overflow: 'hidden',
        width: '1.5rem',
        height: '1.5rem',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center'
    },
})

