import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import normalize from './../../utils/normalize';
import { fetchFaqAndAnswers } from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import Animated, { FlipInXUp, SlideInRight } from 'react-native-reanimated';
import PageLoading from '../../shared/PageLoading';

export default function SupportQuestionsScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();
    const faqs = useSelector(state => state.common.faqAndAnswers);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dispatch(fetchFaqAndAnswers()).then(() => setLoading(false));
    }, [])

    if (loading) {
        return <PageLoading />
    }


    return (
        <ScrollView style={styles.container}>
            <Animated.View style={styles.titleContainer} entering={SlideInRight}>
                <Text style={styles.title}>Need some help ?</Text>
                <Text style={styles.title}>Go through our FAQs</Text>
            </Animated.View>
            <View style={styles.profileTabs}>

                {faqs.map((faq, index) =>
                    <Animated.View
                        key={index}
                        entering={FlipInXUp.delay(100 * index)}>
                        <QuestionTab
                            question={faq.question}
                            answer={faq.answer} />
                    </Animated.View>
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
