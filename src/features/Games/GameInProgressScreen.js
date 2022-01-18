import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, Animated, Pressable, Alert } from 'react-native';
import normalize from "../../utils/normalize";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import { Ionicons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';
import { formatNumber } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';
import { getUser } from "../Auth/AuthSlice";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
    endGame, nextQuestion, questionAnswered, consumeBoost,
    pauseGame, skipQuestion, boostReleased, bombOptions
} from "./GameSlice";

import AppButton from "../../shared/AppButton";


var base64 = require('base-64');


export default function GameInProgressScreen({ navigation }) {
    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const gameSessionToken = useSelector(state => state.game.gameSessionToken);
    const chosenOptions = useSelector(state => state.game.chosenOptions);
    const consumedBoosts = useSelector(state => state.game.consumedBoosts);
    const [ending, setEnding] = useState(false);

    const onEndGame = () => {
        setEnding(true);
        dispatch(endGame({
            token: gameSessionToken,
            chosenOptions,
            consumedBoosts
        }))
            .then(unwrapResult)
            .then(() => {
                setEnding(false);
                navigation.navigate('GameEndResult');
            })
            .catch((rejectedValueOrSerializedError) => {
                setEnding(false);
                console.log(rejectedValueOrSerializedError);
                Alert.alert('failed to end game')
            });
    }

    return (
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="cover">
            <ScrollView>
                <PlayGameHeader onPress={() => onEndGame()} />
                <BoostsInfo onPress={() => refRBSheet.current.open()} />
                <GameProgressAndBoosts onComplete={() => onEndGame()} />
                <GameQuestions />
                <NextButton onPress={() => onEndGame()} ending={ending} />
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

const PlayGameHeader = ({ onPress }) => {

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Game Mode</Text>
            <Pressable onPress={onPress}>
                <Text style={styles.headerTitle}>Exit</Text>
            </Pressable>
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


const GameProgressAndBoosts = ({ onComplete }) => {
    const gameCategory = useSelector(state => state.game.gameCategory)
    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress gameTopic="" gameCategory={gameCategory.name} onComplete={onComplete} />
            <AvailableBoosts />
        </View>
    )
}

const GameTopicProgress = ({ gameTopic, gameCategory, onComplete }) => {
    const countdownKey = useSelector(state => state.game.countdownKey);
    const isGamePaused = useSelector(state => state.game.countdownFrozen);

    return (
        <View style={styles.topicProgress}>
            <Text style={styles.title}>{gameCategory} {gameTopic}</Text>

            <AnsweredGameProgress />

            <CountdownCircleTimer
                isPlaying={!isGamePaused}
                duration={60}
                colors={[["#fff", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                trailColor="#2D9CDB"
                size={60}
                strokeWidth={5}
                key={countdownKey}
                onComplete={onComplete} >
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
    const dispatch = useDispatch();
    const boosts = useSelector(state => state.auth.user.boosts);
    const gameType = useSelector(state => state.game.gameType);

    const boostsToDisplay = () => {
        //bomb is only applicable to multiple choices
        if (gameType.name.toUpperCase() !== "MULTIPLE_CHOICE") {
            return boosts.filter(x => x.name.toUpperCase() !== "BOMB");
        }
        return boosts;
    }

    const boostApplied = (data) => {
        dispatch(consumeBoost(data));
        const name = data.name.toUpperCase();
        if (name === 'TIME FREEZE') {
            dispatch(pauseGame(true));
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
            }, 10000);
            dispatch(getUser());
        }
        if (name === 'SKIP') {
            dispatch(skipQuestion());
            dispatch(boostReleased());
            dispatch(getUser());
        }
        if (name === "BOMB") {
            dispatch(bombOptions());
            dispatch(boostReleased());
            dispatch(getUser());
        }
    }

    return (
        <View style={styles.availableBoosts}>
            <View style={styles.boostinfo}>
                <Text style={styles.title}>Boost</Text>
            </View>
            {boostsToDisplay().map((boost, index) =>
                <AvailableBoost boost={boost} key={index} onConsume={boostApplied} />
            )}
        </View>
    )
}

const AvailableBoost = ({ boost, onConsume }) => {
    const activeBoost = useSelector(state => state.game.activeBoost);
    const isActive = activeBoost.id === boost.id;

    return (
        <Pressable onPress={() => isActive ? {} : onConsume(boost)}>
            <View style={styles.availableBoost}>
                <Image
                    source={{ uri: `${backendUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
            </View>
        </Pressable>
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
        <Pressable style={[styles.answer, isSelected ? styles.selectedOption : {}]} onPress={onSelected}>
            <Text style={styles.answerText}>{base64.decode(title)}</Text>
        </Pressable>
    )
}

const NextButton = ({ onPress, ending }) => {
    const dispatch = useDispatch()
    const isLastQuestion = useSelector(state => state.game.isLastQuestion);

    return (
        <AppButton
            disabled={ending}
            text={isLastQuestion ? 'Finish' : 'Next'}
            onPress={() => dispatch(isLastQuestion ? onPress : nextQuestion())}
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