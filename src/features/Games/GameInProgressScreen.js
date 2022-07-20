import React, { useEffect, useRef, useState } from "react";
import { Text, View, Image, ScrollView, ImageBackground, Animated, Pressable, Alert, StatusBar } from 'react-native';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { unwrapResult } from '@reduxjs/toolkit';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';
import { formatNumber } from '../../utils/stringUtl';
import { reduceBoostCount } from "../Auth/AuthSlice";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Constants from 'expo-constants';

import {
    endGame, nextQuestion, questionAnswered, consumeBoost,
    pauseGame, skipQuestion, boostReleased, bombOptions, setHasPlayedTrivia
} from "./GameSlice";

import AppButton from "../../shared/AppButton";
import EStyleSheet from "react-native-extended-stylesheet";
import { Base64 } from 'js-base64';
import LottieAnimations from "../../shared/LottieAnimations";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";


export default function GameInProgressScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const params = route.params;

    const gameSessionToken = useSelector(state => state.game.gameSessionToken);
    const chosenOptions = useSelector(state => state.game.chosenOptions);
    const consumedBoosts = useSelector(state => state.game.consumedBoosts);
    const gameEnded = useSelector(state => state.game.isEnded);
    const isPlayingTrivia = useSelector(state => state.game.isPlayingTrivia);

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
                if (isPlayingTrivia) {
                    dispatch(setHasPlayedTrivia(true));
                    navigation.navigate('TriviaEndResult', {
                        triviaId: params.triviaId,
                    })
                } else {
                    navigation.navigate('GameEndResult');
                }

            })
            .catch((rejectedValueOrSerializedError) => {
                setEnding(false);
                console.log(rejectedValueOrSerializedError);
                Alert.alert('failed to end game')
            });
    }

    const onGoBackTrigger = () => {
        dispatch(endGame({
            token: gameSessionToken,
            chosenOptions,
            consumedBoosts
        }))
            .then(unwrapResult)
            .then(() => {
                console.log('game terminated on go back');
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError);
            });
    }

    useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                if (gameEnded) {
                    return;
                }
                e.preventDefault();
                Alert.alert(
                    'Discard Game?',
                    'You have an ongoing game. Do you want to discard game and leave the screen?',
                    [
                        { text: "Continue playing", style: 'cancel', onPress: () => { } },
                        {
                            text: 'Exit',
                            style: 'destructive',
                            onPress: () => {
                                onGoBackTrigger();
                                navigation.navigate('Game')
                            },
                        },
                    ]
                );
            }),
        [navigation, gameEnded]
    );

    useEffect(() => {
        StatusBar.setBackgroundColor('#9C3DB8');
        StatusBar.setBarStyle('light-content');
        return () => {
            StatusBar.setBackgroundColor('#FFFF');
            StatusBar.setBarStyle('dark-content');
        }
    }, []);

    return (
        <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="contain">
            <ScrollView style = {styles.container}>
                <PlayGameHeader onPress={() => onEndGame()} onPressBoost={() => refRBSheet.current.open()} />
                <GameProgressAndBoosts onComplete={() => onEndGame()} />
                <GameQuestions />
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
            <NextButton onPress={() => onEndGame()} ending={ending} />
        </ImageBackground>
    );
}

const PlayGameHeader = ({ onPress, onPressBoost }) => {

    return (
        <View style={styles.header}>
            <BoostsInfo onPress={onPressBoost} />
            <Pressable onPress={onPress}>
                <Text style={styles.headerTitle}>Exit</Text>
            </Pressable>
        </View>
    )
};

const BoostsInfo = ({ onPress }) => {
    const boosts = useSelector(state => state.auth.user.boosts);
    return (
        <>
            {boosts?.length > 0 ?
                <Pressable style={styles.boostDialog} onPress={onPress}>
                    <Text style={styles.infoText}>
                        Power Ups
                    </Text>
                    <LottieAnimations
                        animationView={require('../../../assets/boost.json')}
                        width={normalize(40)}
                        height={normalize(40)}
                    />
                    {/* <Ionicons name="speedometer" size={20} color="#FFFF" /> */}
                </Pressable>
                :
                <View></View>
            }
        </>
    )
}


const GameProgressAndBoosts = ({ onComplete }) => {
    const gameCategory = useSelector(state => state.game.gameCategory)
    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress onComplete={onComplete} />
            <AvailableBoosts />
        </View>
    )
}

const GameTopicProgress = ({ gameTopic, gameCategory, onComplete }) => {
    const countdownKey = useSelector(state => state.game.countdownKey);
    const isGamePaused = useSelector(state => state.game.countdownFrozen);
    const gameDuration = useSelector(state => state.game.gameDuration);

    return (
        <View style={styles.topicProgress}>
            {/* <Text style={styles.title}>{gameCategory} {gameTopic}</Text> */}
            <LottieAnimations
                animationView={require('../../../assets/game-board.json')}
                width={normalize(110)}
                height={normalize(110)}
            />
            <View style={styles.topicProgressRight}>
                <AnsweredGameProgress />
                <View style={styles.questionsAnsweredContainer}>
                    <CountdownCircleTimer
                        isPlaying={!isGamePaused}
                        duration={gameDuration}
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
            </View>
        </View>
    )
}

const AnsweredGameProgress = () => {

    const index = useSelector(state => state.game.currentQuestionPosition);
    const total = useSelector(state => state.game.totalQuestionCount);

    return (
        <View style={styles.questionsAnsweredContainer}>
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
        </View>
    );
}

const AvailableBoosts = () => {
    const dispatch = useDispatch();
    const boosts = useSelector(state => state.auth.user.boosts);
    const displayedOptions = useSelector(state => state.game.displayedOptions);

    const boostsToDisplay = () => {
        //  bomb is only applicable to multiple choices
        if (displayedOptions.length === 2) {
            return boosts.filter(x => x.name.toUpperCase() !== "BOMB");
        }
        return boosts;
    }

    const boostApplied = (data) => {
        dispatch(consumeBoost(data));
        dispatch(reduceBoostCount(data.id))
        const name = data.name.toUpperCase();
        if (name === 'TIME FREEZE') {
            dispatch(pauseGame(true));
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
            }, 10000);
        }
        if (name === 'SKIP') {
            dispatch(skipQuestion());
            dispatch(boostReleased());
        }
        if (name === "BOMB") {
            dispatch(bombOptions());
            dispatch(boostReleased());
        }
    }

    return (
        <>
            {boosts?.length > 0 ?
                <View style={styles.availableBoosts}>
                    <View style={styles.boostinfo}>
                        <Text style={styles.title}>BOOST</Text>
                    </View>
                    {
                        boostsToDisplay().map((boost, index) =>
                            boost.count >= 1 &&
                            <AvailableBoost boost={boost} key={index} onConsume={boostApplied} />
                        )
                    }

                </View>
                :
                <></>
            }
        </>
    )
}

const AvailableBoost = ({ boost, onConsume }) => {
    const activeBoost = useSelector(state => state.game.activeBoost);
    const isActive = activeBoost.id === boost.id;

    return (
        <Pressable onPress={() => isActive ? {} : onConsume(boost)}>
            <View style={[styles.availableBoost, isActive ? styles.boostActive : {}]}>
                <Image
                    source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
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
                    source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
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
                <Text style={styles.questions}>{Base64.decode(displayedQuestion.label)}</Text>
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
            <Text style={styles.answerText}>{Base64.decode(title)}</Text>
        </Pressable>
    )
}

const NextButton = ({ onPress, ending }) => {
    const dispatch = useDispatch()
    const isLastQuestion = useSelector(state => state.game.isLastQuestion);

    return (
        // <View >
        <AppButton
            disabled={ending}
            text={isLastQuestion ? 'Finish' : 'Next'}
            onPress={() => dispatch(isLastQuestion ? onPress : nextQuestion())}
            style={styles.nextButton}
        />
        // {/* </View> */}
    )
}

const styles = EStyleSheet.create({

    container: { 
        flex: 1,
        backgroundColor: '#9C3DB8',
        paddingTop: normalize(40),
    },
    image: {
        paddingHorizontal: normalize(18),
        backgroundColor: '#9C3DB8',
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: '0.82rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
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
    },
    topicProgressRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    availableBoost: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: normalize(20)
    },
    availableBoosts: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: normalize(30),
        paddingVertical: normalize(18),
    },
    boostActive: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: normalize(5),
        padding: normalize(7)
    },
    timeText: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem'
    },
    title: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '.9rem'
    },
    boostinfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    amount: {
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        fontSize: '0.6rem',
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
        fontSize: '0.9rem',
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
        fontSize: '0.75rem',
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
    questionsAnsweredContainer: {
        marginRight: normalize(20)
    },
    questionsAnswered: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
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
        fontSize: '0.69rem',
        fontFamily: 'graphik-bold',
        color: '#151C2F',
        lineHeight: '1.2rem',
    },
    boostDescription: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#828282',
        lineHeight: '1.2rem',
        width: responsiveScreenWidth(60),
    },
    boostDialog: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF2F55',
        paddingHorizontal: '.4rem',
        borderRadius: 5
    },
    title1: {
        fontSize: '0.82rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: '1rem',
        marginBottom: normalize(15)
    },
    infoText: {
        fontSize: '0.63rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF',
    },
    boostIcon: {
        width: normalize(35),
        height: normalize(35)
    },
    nextButton: {
        marginVertical: 10,
    }
});
