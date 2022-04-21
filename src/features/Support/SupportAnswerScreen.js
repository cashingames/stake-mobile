import React from 'react';
import {Text, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from './../../utils/normalize';

export default function SupportAnswerScreen({ route }) {

    const question = JSON.parse(route.params.question);
    const answer = JSON.parse(route.params.answer);

    return (
        <ScrollView style={styles.container}>
                <Text style={styles.question}>{question}</Text>
                <Text style={styles.answer}>{answer}</Text>
        </ScrollView>
    );
}

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