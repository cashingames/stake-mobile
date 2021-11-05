import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, Animated, Pressable } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useNavigation } from '@react-navigation/native';
// import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";

export default function DuelGameInProgress({ navigation }) {
    const refRBSheet = useRef();

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../assets/images/game_mode.png')} style={styles.image} resizeMode="cover">
                <ScrollView style={styles.contentContainer}>
                    <PlayGameHeader />
                    <BoostsInfo onPress={() => refRBSheet.current.open()} />
                    <GameProgressAndBoosts />
                    <GameQuestions />
                    <AnswerOptions />
                    <RBSheet
                        ref={refRBSheet}
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        height={400}
                        customStyles={{
                            wrapper: {
                                backgroundColor: "rgba(0, 0, 0, 0.5)"
                            },
                            draggableIcon: {
                                backgroundColor: "#000",
                            },
                            container: {
                                borderTopStartRadius: 25,
                                borderTopEndRadius: 25,
                            }
                        }}
                    >
                        <GameBoosts />
                    </RBSheet>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const PlayGameHeader = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Game Mode</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DuelGameEndResult')}>
                <Text style={styles.headerTitle}>Exit</Text>
            </TouchableOpacity>
        </View>
    )
};

const GameTopicProgress = ({ gameTopic, gameCategory }) => {
    return (
        <View style={styles.topicProgress}>
            <Text style={styles.title}>{gameCategory} {gameTopic}</Text>
            <QuestionsProgress />
            <TimeCountdown />
        </View>
    )
}

const QuestionsProgress = () => {
    return (
        <View style={styles.questionsProgress}>
            <Text style={styles.questionsAnswered}>1/10</Text>
        </View>
    )
}

const TimeCountdown = () => {
    const navigation = useNavigation();
    return (
        <View>
            <CountdownCircleTimer
                isPlaying
                duration={30}
                colors={[
                    ['#2D9CDB', 0.4],
                ]}
                size={60}
                strokeWidth={5}
                onComplete={() => navigation.navigate('DuelGameEndResult')}
            >
                {({ remainingTime, animatedColor }) => (
                    <Animated.Text style={styles.timeText}>
                        {remainingTime}
                    </Animated.Text>
                )}
            </CountdownCircleTimer>
        </View >
    )
}

const AvailableBoost = ({ boostIcon, amount }) => {
    return (
        <TouchableOpacity>
            <View style={styles.availableBoost}>
                <Image
                    // style={styles.trophy}
                    source={boostIcon}
                />
                <Text style={styles.amount}>{amount}</Text>
            </View>
        </TouchableOpacity>
    )
}

const AvailableBoosts = () => {
    return (
        <View style={styles.availableBoosts}>
            <View style={styles.boostinfo}>
                <Text style={styles.title}>Boost</Text>
            </View>
            <AvailableBoost boostIcon={require('../../assets/images/time_freeze.png')} amount="x5" />
            <AvailableBoost boostIcon={require('../../assets/images/skip.png')} amount="x3" />
            <AvailableBoost boostIcon={require('../../assets/images/bomb.png')} amount="x3" />
        </View>
    )
}

const InfoIcon = () => {
    return (
        <Pressable style={styles.information}>
            <Ionicons name="md-information-circle-sharp" size={26} color="#FFFF" />
        </Pressable>
    )
}
const DuelPlayer = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.duelPlayer}>
            <Text>@{playerName}</Text>
            <Image
                source={playerAvatar}
                style={styles.avatar1}
            />
        </View>
    )
}

const DuelPlayers = () => {
    return (
        <View style={styles.collapsible}>
            <View style={styles.duelPlayer}>
                <Text style={styles.playerName}>@Holygrail</Text>
                <Image
                    source={require('../../assets/images/user-icon.png')}
                    style={styles.avatar}
                />
            </View>
            <Text style={styles.versus}>vs</Text>
            <View style={styles.duelPlayer}>
                <Image
                    source={require('../../assets/images/user-icon.png')}
                    style={styles.avatar1}
                />
                <Text style={styles.playerName}>@Adamantine</Text>
            </View>
        </View>
    )
}

const GameProgressAndBoosts = () => {

    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress gameTopic="(Hip hop)" gameCategory="Music" />
            <AvailableBoosts />
            {/* <Collapsible
                collapsed={true}
                enablePointerEvents={true}
                collapsedHeight={40}
                style={styles.collapsible}
            > */}
            <DuelPlayers />
            {/* </Collapsible> */}
        </View>

    )
}

const GameQuestions = () => {
    return (
        <View style={styles.gameQuestions}>
            <Text style={styles.questions}>Who directed the dance choreogrpahy of Michael Jackason’s hit single Thriller?</Text>
        </View>
    )
}

const Answer = ({ answer }) => {
    return (
        <View>
            <TouchableOpacity style={styles.answer}>
                <Text style={styles.answerText}>{answer}</Text>
            </TouchableOpacity>
        </View>
    )
}
const AnswerOptions = () => {
    return (
        <View style={styles.options}>
            <Answer answer="Jay Z" />
            <Answer answer="Micheal Jackson" />
            <Answer answer="Chris Brown" />
            <Answer answer="Usher" />
        </View>
    )
}

const GameBoost = ({ boost }) => {
    return (
        <View style={styles.boostContent}>
            <View style={styles.boostAmount}>
                <Image
                    // source={require('../../assets/images/bomb.png')}
                    source={boost.boostIcon}
                />
                <Text style={styles.amount1}>{boost.amount}</Text>
            </View>
            <View style={styles.boostDetails}>
                <Text style={styles.boostName}>{boost.boostName}</Text>
                <Text style={styles.boostDescription}>{boost.boostDescription}</Text>
            </View>
        </View>
    )
}

const GameBoosts = () => {
    const navigation = useNavigation();

    const boosts = [
        {
            id: 1,
            boostIcon: require('../../assets/images/time_freeze.png'),
            amount: "x5",
            boostName: 'Time Freeze',
            boostDescription: 'Time freeze for 15 seconds'
        },
        {
            id: 2,
            boostIcon: require('../../assets/images/skip.png'),
            amount: "x3",
            boostName: 'Skip',
            boostDescription: 'Answer a different question'
        },
        {
            id: 3,
            boostIcon: require('../../assets/images/bomb.png'),
            amount: "x3",
            boostName: 'Bomb',
            boostDescription: 'Removes two wrong answers'
        }
    ]

    return (
        <View style={styles.availableBoosts1}>
            <Text style={styles.title1}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost) => <GameBoost boost={boost} />)}
            </View>
        </View>
    )
}

const BoostsInfo = ({ text, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={styles.boostDialog}>
                <Text style={styles.infoText}>
                    See available boosts description
                </Text>
                <Ionicons name="md-arrow-forward-sharp" size={20} color="#FF9900" />
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
    },
    contentContainer: {
        marginHorizontal: normalize(18),
        paddingTop: normalize(35),
    },
    content: {
        marginHorizontal: normalize(18),
        alignItems: 'center'
    },
    image: {
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    gameProgressAndBoost: {
        display: 'flex',
        backgroundColor: 'rgba(57, 15, 15, 0.4)',
        shadowColor: 'inset 0px 4px 0px rgba(0, 0, 0, 0.05)',
        borderRadius: 16,
        marginVertical: normalize(18)
    },
    topicProgress: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(10),
    },
    availableBoost: {
        display: 'flex',
        flexDirection: 'row',
    },
    availableBoosts: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: normalize(20),
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    timeText: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(9)
    },
    title: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11)
    },
    boostinfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    information: {
        marginLeft: normalize(10)
    },
    amount: {
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        fontSize: normalize(9),
    },
    gameQuestions: {
        // width: normalize(270),
        marginHorizontal: normalize(15),
        marginBottom: normalize(20)

    },
    questions: {
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(14),
        lineHeight: normalize(26)
    },
    answer: {
        backgroundColor: '#FFFF',
        marginBottom: normalize(8),
        padding: normalize(12),
        borderRadius: 16,
        borderBottomColor: '#C97AE0',
        borderBottomWidth: 10,
    },
    options: {
        paddingBottom: normalize(80),
    },
    answerText: {
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
    },
    selectedOption: {
        backgroundColor: 'black'
    },
    questionsProgress: {
        borderRadius: 50,
        width: normalize(45),
        height: normalize(45),
        borderColor: '#FFFF',
        borderWidth: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    questionsAnswered: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(9),
    },
    boostContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        marginBottom: normalize(17)
    },
    amount1: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(12),
        color: '#FF932F'
    },
    boostAmount: {
        display: 'flex',
        flexDirection: 'row',
    },
    availableBoosts1: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    boosts: {
        // alignItems: ''

    },
    boostDetails: {
        alignItems: 'flex-start',
        marginBottom: normalize(15)
    },
    boostName: {
        fontSize: normalize(10),
        fontFamily: 'graphik-bold',
        color: '#151C2F',
        lineHeight: 21,
    },
    boostDescription: {
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#828282',
        lineHeight: 21,
        width: normalize(170),
    },
    boostDialog: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: normalize(10)
    },
    title1: {
        fontSize: normalize(13),
        fontFamily: 'graphik-bold',
        color: '#000',
        lineHeight: 23,
        marginBottom: normalize(15)
    },
    infoText: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
    collapsible: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(10),
    },
    avatar1: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        marginRight: normalize(10)
    },
    avatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        marginLeft: normalize(10)
    },
    duelPlayer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    playerName: {
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#FFFF',
    },
    versus: {
        fontSize: normalize(10),
        fontFamily: 'graphik-bold',
        color: '#FFFF',
    },
});
