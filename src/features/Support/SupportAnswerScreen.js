import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(25),
    },
    question: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(14),
        marginVertical: normalize(20),
        color: '#000000'
    },
    answer: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(14),
        color: '#151C2F',
        lineHeight: normalize(28)
    }
});