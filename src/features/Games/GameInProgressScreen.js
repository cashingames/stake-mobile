import React, { useRef } from "react";
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
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { endGame, nextQuestion, questionAnswered } from "./GameSlice";
import AppButton from "../../shared/AppButton";


var base64 = require('base-64');


export default function GameInProgressScreen({ navigation }) {
    const refRBSheet = useRef();
    return (
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="cover">
            <ScrollView>
                <PlayGameHeader />
                <BoostsInfo onPress={() => refRBSheet.current.open()} />
                <GameProgressAndBoosts />
                <GameQuestions />
                <NextButton />
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
}

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

const BoostsInfo = ({ onPress }) => {
    return (
        <View style={styles.boostDialog}>
            <Text onPress={onPress} style={styles.infoText}>
                See available boosts description
            </Text>
            <Ionicons name="md-arrow-forward-sharp" size={20} color="#FF9900" />
        </View>
    )
}


const GameProgressAndBoosts = () => {
    const gameCategory = useSelector(state => state.game.gameCategory)
    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress gameTopic="" gameCategory={gameCategory.name} />
            <AvailableBoosts />
        </View>
    )
}

const GameTopicProgress = ({ gameTopic, gameCategory }) => {

    const dispatch = useDispatch();
    // 'GameEndResult'
    return (
        <View style={styles.topicProgress}>
            <Text style={styles.title}>{gameCategory} {gameTopic}</Text>

            <AnsweredGameProgress />

            <CountdownCircleTimer
                isPlaying
                duration={60}
                colors={[["#fff", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                trailColor="#2D9CDB"
                size={60}
                strokeWidth={5}
                onComplete={() => { console.log("timer, end game"); dispatch(endGame()); }} >
                {({ remainingTime, animatedColor }) => (
                    <Animated.Text style={styles.timeText}>
                        {remainingTime}
                    </Animated.Text>
                )}
            </CountdownCircleTimer>
        </View>
    )
}

const AnsweredGameProgress = () => {

    const index = useSelector(state => state.game.currentQuestionPosition);
    const total = useSelector(state => state.game.totalQuestionCount);

    return (
        <AnimatedCircularProgress
            size={60}
            width={5}
            fill={((index + 1) / total * 100)}
            tintColor="#2D9CDB"
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#fff">
            {
                (fill) => (
                    <Text style={styles.questionsAnswered}>
                        {`${index + 1}/${total}`}
                    </Text>
                )
            }
        </AnimatedCircularProgress>
    );
}

const AvailableBoosts = () => {
    const boosts = useSelector(state => state.auth.user.boosts);
    return (
        <View style={styles.availableBoosts}>
            <View style={styles.boostinfo}>
                <Text style={styles.title}>Boost</Text>
            </View>
            {boosts.map((boost, i) => <AvailableBoost boost={boost} key={i} />)}
        </View>
    )
}

const AvailableBoost = ({ boost }) => {
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


const GameBoosts = () => {

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


const GameQuestions = () => {
    const dispatch = useDispatch();
    const displayedQuestion = useSelector(state => state.game.displayedQuestion);
    const displayedOptions = useSelector(state => state.game.displayedOptions);

    const optionSelected = (option) => {
        dispatch(questionAnswered(option));
    }

    return (
        <>
            <View style={styles.gameQuestions}>
                <Text style={styles.questions}>{base64.decode(displayedQuestion.label)}</Text>
            </View>
            <View style={styles.options}>
                {displayedOptions.map((option, i) => <Option option={option} key={i} onSelected={() => optionSelected(option)} />)}
            </View>
        </>
    )
}

const Option = ({ option: { title, isSelected }, onSelected }) => {
    return (
        <TouchableOpacity style={[styles.answer, isSelected ? styles.selectedOption : {}]} onPress={onSelected}>
            <Text style={styles.answerText}>{base64.decode(title)}</Text>
        </TouchableOpacity>
    )
}

const NextButton = () => {
    const dispatch = useDispatch()
    const isLastQuestion = useSelector(state => state.game.isLastQuestion);

    return (
        <AppButton
            text={isLastQuestion ? 'Finish' : 'Next'}
            onPress={() => dispatch(isLastQuestion ? endGame() : nextQuestion())}
        />
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
    options: {
        // paddingBottom: normalize(80),
    },
    answer: {
        backgroundColor: '#FFFF',
        marginBottom: normalize(8),
        padding: normalize(12),
        borderRadius: 16,
        borderBottomColor: '#C97AE0',
        borderBottomWidth: 7,
    },
    answerText: {
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        textAlign: 'center',
    },
    selectedOption: {
        backgroundColor: '#F5D2FF'
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
        alignItems: 'center'
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
