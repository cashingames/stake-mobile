import React from 'react'
import { Text, View, Image, ScrollView, Pressable, Alert } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/core';


const TriviaEndResultScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <ResultContainer />
            <UserResultAnalytics />
            <TriviaParticipants />
            <TriviaButtons />
        </ScrollView>
    )
}

const ResultContainer = () => {
    var game =
    {
        position: 10
    }
    return (
        <View style={styles.resultContainer}>
            <Image
                style={styles.icon}
                source={require('../../../assets/images/trivia-cup.png')}
            />
            <Text style={styles.positionText}>You finished at {game.position}th position</Text>
            <Text style={styles.resultMessage}>Thanks for completing the live trivia session today.
                Stay tuned for upcoming live trivia sessions</Text>
        </View>
    )
}

const UserResultAnalytics = () => {
    var userResult =
    {
        correctAnswer: 5,
        totalQuestions: 10,
        votingTime: '2:48'
    }
    return (
        <View style={styles.userResult}>
            <View style={styles.answerContainer}>
                <Text style={styles.resultText}>Correct answers</Text>
                <Text style={styles.resultResponse}>{userResult.correctAnswer}/{userResult.totalQuestions}</Text>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.resultText}>Voting time</Text>
                <Text style={styles.resultResponse}>{userResult.votingTime}</Text>
            </View>
        </View>
    )
}

const TriviaParticipant = ({ player }) => {
    var totalQuestions = 10
    return (
        <View style={styles.participant}>
            <View style={styles.positionName}>
                <Text style={styles.position}>{player.position}</Text>
                <Text style={styles.username}>{player.username}</Text>
            </View>
            <View style={styles.positionName}>
                <View style={styles.questionAnswered}>
                    <Ionicons name="md-checkmark-circle-outline" size={18} color="#000000" />
                    <Text style={styles.texts}>{player.answered_questions}/{totalQuestions}</Text>
                </View>
                <View style={styles.timeSpent}>
                    <Ionicons name="md-time-outline" size={18} color="#000000" />
                    <Text style={styles.texts}>{player.voting_time}</Text>
                </View>
            </View>
        </View>
    )
}

const TriviaParticipants = () => {
    var participants = [
        {
            position: 1,
            username: 'Obiwizzy222',
            answered_questions: 9,
            voting_time: '2:22'
        },
        {
            position: 2,
            username: 'Friday',
            answered_questions: 8,
            voting_time: '2:24'
        },
        {
            position: 3,
            username: 'Sholabababy',
            answered_questions: 7,
            voting_time: '2:50'
        },
    ]
    return (
        <View style={styles.participants}>{participants.map((player, i) => <TriviaParticipant key={i} player={player} />)}</View>
    )
}

const TriviaButton = ({ text, buttonContainer, buttonText, onPress }) => {
    return (
        <View style={buttonContainer}>
            <Pressable onPress={onPress}>
                <Text style={buttonText}>{text}</Text>
            </Pressable>
        </View>
    )
}

const TriviaButtons = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.buttonsContainer}>
            <TriviaButton
                text='Return to Dashboard'
                buttonContainer={styles.homeButton}
                buttonText={styles.homeText}
                onPress={() => navigation.navigate('Home')}
            />
            <TriviaButton
                text='Return to Games'
                buttonContainer={styles.gameButton}
                buttonText={styles.gameText}
                onPress={() => navigation.navigate('Game')}
            />
        </View>
    )
}


export default TriviaEndResultScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        // paddingTop: responsiveScreenWidth(20),
    },
    resultContainer: {
        alignItems: 'center',
        paddingTop: responsiveScreenWidth(15),
    },
    icon: {
        width: normalize(110),
        height: normalize(110)
    },
    positionText: {
        fontSize: '1.1rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginVertical: responsiveScreenWidth(10)
    },
    resultMessage: {
        fontSize: '0.95rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        textAlign: 'center',
        opacity: 0.7,
        lineHeight: '1.5rem',
        paddingHorizontal: normalize(18),
    },
    userResult: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(20),
        marginTop: responsiveScreenWidth(10)
    },
    answerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(8),
        alignItems: 'center'
    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    resultText: {
        fontSize: '0.8rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        opacity: 0.7,
    },
    resultResponse: {
        fontSize: '0.8rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    participants: {
        paddingHorizontal: normalize(18)
    },
    participant: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(25)
    },
    positionName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeSpent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: normalize(15)
    },
    questionAnswered: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    texts: {
        fontSize: '0.75rem',
        color: '#000000',
        fontFamily: 'graphik-regular',
        opacity: 0.7,
        marginLeft: normalize(5)
    },
    position: {
        fontSize: '0.75rem',
        color: '#7C7D7F',
        fontFamily: 'graphik-medium',
    },
    username: {
        fontSize: '0.75rem',
        color: '#000000',
        fontFamily: 'graphik-regular',
        marginLeft: normalize(10)
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: normalize(18),
        justifyContent: 'space-between',
        marginVertical: normalize(30)
    },
    homeButton: {
        borderWidth: 1,
        borderColor: '#EF2F55',
        borderRadius: normalize(5),
        padding: normalize(15)
    },
    homeText: {
        fontSize: '0.8rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
    },
    gameButton: {
        borderWidth: 1,
        borderColor: '#EF2F55',
        borderRadius: normalize(5),
        padding: normalize(15),
        backgroundColor: '#EF2F55',
    },
    gameText: {
        fontSize: '0.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
});