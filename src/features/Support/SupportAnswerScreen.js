import React from 'react';
import { Text, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import normalize from './../../utils/normalize';

export default function SupportAnswerScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

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
        backgroundColor: '#F9FBFF',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(25),
    },
    question: {
        fontFamily: 'gotham-bold',
        fontSize: '0.9rem',
        marginVertical: normalize(20),
        color: '#1C453B',
        lineHeight: '1.3rem'
    },
    answer: {
        fontFamily: 'sansation-regular',
        fontSize: '0.9rem',
        color: '#1C453B',
        lineHeight: '1.3rem'
    }
});