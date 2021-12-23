import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { isTrue } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';
import document from './support-content.json'




export default function SupportQuestionsScreen({ navigation }) {

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <QuestionTabs />
            </View>
        </ScrollView>
    );
}

const QuestionTab = ({ question, answer }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Answer', { 
                question: JSON.stringify(question), 
                answer: JSON.stringify(answer) 
            })}
            style={styles.profileTab}>
            <Text style={styles.tabText}>{question}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#524D4D" />
        </TouchableOpacity >
    )
}

const QuestionTabs = () => {    
    return (
        <View style={styles.profileTabs}>
            {document.map((faq, index) => <QuestionTab
                key={index}
                question={faq.question}
                answer={faq.answer} />
            )}
        </View>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        // marginVertical: normalize(20)
    },
    content: {
        marginHorizontal: normalize(18),
        // paddingVertical: normalize(25),
        marginBottom: normalize(20)

    },
    profileTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(30)
    },
    tabText: {
        fontSize: normalize(14),
        fontFamily: 'graphik-regular',
        color: '#151C2F',
        lineHeight: normalize(20),
        width: normalize(250)
    },
    profileTabs: {
        paddingVertical: normalize(25)
    }

});
