import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";


const GameOption = ({ option: { title, isSelected, is_correct }, onSelected, submissionResult, selectedOption, showCorrectAnswer}) => {
    const [showTrue, setShowTrue] = useState(null)
    const isWrongOption = isSelected && submissionResult == false;
    const isCorrectOption = isSelected && submissionResult;
    // const showRight = !isSelected && !submissionResult;

    useEffect(() => {
        if(showCorrectAnswer){
            try {
                const a = is_correct ? is_correct : null;                
                const showCorrectOption = !isSelected && a == 1;
                setShowTrue(showCorrectOption);
              } catch (error) {
                console.log( error);
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
            <Text style={styles.answerText}>{title}</Text>
            
            {isCorrectOption || showTrue ? (
                <View style={styles.checkmark}>
                    <Ionicons name="checkmark-sharp" size={15} color="#6FCF97" />
                </View>
            ) : <></>}
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
        marginBottom: normalize(8),
        padding: normalize(15),
        borderRadius: 16,
        borderBottomColor: '#15397D',
        borderBottomWidth: 4,
    },
    answerText: {
        color: '#15397D',
        fontFamily: 'poppins',
        fontSize: '0.7rem',
        textAlign: 'left',
        height:normalize(14),
        // backgroundColor:'yellow'
    },
    selectedOption: {
        backgroundColor: '#F5D2FF'
    },
    correctOption: {
        backgroundColor: '#FFBC10',
        borderBottomColor: '#15397D',
        borderBottomWidth: 4,
        padding: normalize(15),
    },
    wrongOption: {
        backgroundColor: '#E7262A',
        borderBottomColor: '#15397D',
        padding: normalize(15),
    },
    checkmark: {
        backgroundColor: '#fff',
        borderRadius: 100,
        width: '1.3rem',
        height: '1.3rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

