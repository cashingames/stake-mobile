import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { isTrue } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';

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