import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, Animated, Pressable } from 'react-native';
import normalize from "../../utils/normalize";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';
import { formatNumber } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';




export default function GameInProgressScreen({ navigation }) {
    const refRBSheet = useRef();
    return (
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="cover">
            <ScrollView>
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
    );
};

const PlayGameHeader = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Game Mode</Text>
            <TouchableOpacity onPress={() => navigation.navigate('GameEndResult')}>
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
                onComplete={() => navigation.navigate('GameEndResult')}
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

const AvailableBoost = ({ boostIcon, boost }) => {
    return (
        <TouchableOpacity>
            <View style={styles.availableBoost}>
            <Image
                    source={{ uri: `${backendUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const AvailableBoosts = () => {
    const boosts = useSelector(state => state.auth.user.boosts);
    return (
        <View style={styles.availableBoosts}>
            <View style={styles.boostinfo}>
                <Text style={styles.title}>Boost</Text>
            </View>
            {boosts.map((boost, i) => <AvailableBoost boost={boost} key={i}
                boostIcon={require('../../../assets/images/time_freeze.png')} />
            )}
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

const GameProgressAndBoosts = () => {
    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress gameTopic="(Hip hop)" gameCategory="Music" />
            <AvailableBoosts />
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
                    source={{ uri: `${backendUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount1}>x{formatNumber(boost.count)}</Text>
            </View>
            <View style={styles.boostDetails}>
                <Text style={styles.boostName}>{boost.name}</Text>
                <Text style={styles.boostDescription}>{boost.description}</Text>
            </View>
        </View>
    )
}

const GameBoosts = () => {
    const navigation = useNavigation();
    const boosts = useSelector(state => state.auth.user.boosts);

    return (
        <View style={styles.availableBoosts1}>
            <Text style={styles.title1}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost, i) => <GameBoost boost={boost} key={i} />
                )}
            </View>
        </View>
    )
}

const BoostsInfo = ({ text, onPress }) => {
    return (
        <View style={styles.boostDialog}>
            <Text onPress={onPress} style={styles.infoText}>
                See available boosts description
            </Text>
            <Ionicons name="md-arrow-forward-sharp" size={20} color="#FF9900" />
        </View>
    )
}


const styles = StyleSheet.create({

    image: {
        flex: 1,
        backgroundColor: '#9C3DB8',
        paddingHorizontal: normalize(18),
        paddingTop: normalize(45),
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
        marginTop: normalize(10),
        alignItems:'center'
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
    boostIcon: {
        width: normalize(30),
        height: normalize(30)
    }
});
