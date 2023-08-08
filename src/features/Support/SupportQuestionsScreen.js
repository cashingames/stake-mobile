import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import normalize, { responsiveScreenHeight } from './../../utils/normalize';
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
        return <PageLoading spinnerColor="#0000ff" />
    }

    return (
        <ScrollView style={styles.container}>
            <Animated.View style={styles.titleContainer} entering={SlideInRight}>
                {/* <Text style={styles.title}>Need some help ?</Text>
                <Text style={styles.title}>Go through our FAQs</Text> */}

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
            <Ionicons name="chevron-forward-outline" size={20} color="#1C453B" />
        </Pressable >
    )
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
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
        paddingTop: normalize(5),
        marginBottom:'2rem'
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingVertical: normalize(15),
        paddingHorizontal:'1rem',
        marginBottom: '.3rem',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.2,
        backgroundColor:'#FFF'
    },
    tabText: {
        fontSize: '0.8rem',
        fontFamily: 'gotham-medium',
        color: '#1C453B',
        lineHeight: '1.1rem',
        width: normalize(250)
    },
    logoutText: {
        color: '#EF2F5F',
        textAlign: 'center',
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        paddingVertical: responsiveScreenHeight(1),

    },
    logoutContainer: {
        backgroundColor: '#FFFF',
        // flex: 1,
        // justifyContent: 'flex-end'
    },
    appVersion: {
        color: '#000000',
        fontSize: '0.8rem',
        lineHeight: '0.7rem',
        fontFamily: 'graphik-regular',
        opacity: 0.7,
        marginVertical: 10,
        textAlign: 'center',
    },

});
