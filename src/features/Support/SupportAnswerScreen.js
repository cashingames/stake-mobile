import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import normalize from './../../utils/normalize';

export default function SupportAnswerScreen({ route }) {

    const question = JSON.parse(route.params.question);
    const answer = JSON.parse(route.params.answer);

    console.log(answer);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.question}>{question}</Text>
                <Text style={styles.answer}>{answer}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
        // marginVertical: normalize(20)
    },
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(25),
        marginBottom: normalize(20)

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