import React, { useEffect } from 'react';
import { Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import normalize from './../../utils/normalize';
import { fetchFaqAndAnswers } from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function SupportQuestionsScreen({ navigation }) {
    const dispatch = useDispatch();
    const faqs = useSelector(state => state.common.faqAndAnswers);
    
    useEffect(() => {
        dispatch(fetchFaqAndAnswers());
    }, [])


    return (
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Need some help ?</Text>
                <Text style={styles.title}>Go through our FAQs</Text>
            </View>
            <View style={styles.profileTabs}>

                {faqs.map((faq, index) => <QuestionTab
                    key={index}
                    question={faq.question}
                    answer={faq.answer} />
                )}
            </View>

        </ScrollView>
    );
}

const QuestionTab = ({ question, answer }) => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.navigate('Answer', {
                question: JSON.stringify(question),
                answer: JSON.stringify(answer)
            })}
            style={styles.tab}>
            <Text style={styles.tabText}>{question}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#524D4D" />
        </Pressable >
    )
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        padding: normalize(20),
    },
    titleContainer: {
        // marginTop: normalize(20),
    },
    title: {
        fontSize: '0.95rem',
        fontFamily: 'graphik-medium',
        marginTop: normalize(9),
    },
    profileTabs: {
        paddingVertical: normalize(20)
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(20),
    },
    tabText: {
        fontSize: '0.87rem',
        fontFamily: 'graphik-regular',
        color: '#151C2F',
        lineHeight: '1.5rem',
        width: normalize(250)
    },

});
