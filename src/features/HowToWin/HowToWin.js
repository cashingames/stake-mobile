import React from 'react';
import { Text,  ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';


const HowToWin = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.question}>How can i win on Cashingames?</Text>
            <Text style={styles.answer}>Winning on Cashingames is very easy. You choose the category you are most knowledgeable in, answer
                the questions and you stand a chance to win. The more questions you answer,the more you increase your winnings.
            </Text>
        </ScrollView>
    )
}

export default HowToWin;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(25),
    },
    question: {
        fontFamily: 'graphik-medium',
        fontSize: '0.9rem',
        marginVertical: normalize(20),
        color: '#000000',
        lineHeight: '1.3rem'
    },
    answer: {
        fontFamily: 'graphik-regular',
        fontSize: '0.9rem',
        color: '#151C2F',
        lineHeight: '1.3rem'
    }
});