import React, { useEffect, useRef, useCallback, useState } from "react";
import { View, Image, Pressable, Animated, Alert } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Constants from 'expo-constants';
import { formatNumber } from "../../../utils/stringUtl";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import { reduceBoostCount } from "../../Auth/AuthSlice";
import { boostReleased, consumeBoost, pauseGame, skipQuestion } from "./TriviaChallengeGameSlice";
import logToAnalytics from "../../../utils/analytics";
import * as Progress from 'react-native-progress';


const ChallengeGameBoardWidgets = () => {
    const dispatch = useDispatch();
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const boosts = useSelector(state => state.auth.user.boosts);
    const gameMode = useSelector(state => state.game.gameMode);
    const documentId = useSelector(state => state.triviaChallenge.documentId);
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);
    const [updatepracticeFreezeCount, setUpdatePracticeFreezeCount] = useState(20);
    const [updatepracticeSkipCount, setUpdatePracticeSkipCount] = useState(20);




    const practiceBoosts = [
        {
            "id": 1,
            "icon": require('../../../../assets/images/timefreeze-boost.png'),
            "count": updatepracticeFreezeCount,
            "boostName": 'TIME FREEZE'
        },
        {
            "id": 2,
            "icon": require('../../../../assets/images/skip-boost.png'),
            "count": updatepracticeSkipCount,
            "boostName": 'SKIP'
        }
    ]


    const boostApplied = (data) => {
        dispatch(consumeBoost(data))
        dispatch(reduceBoostCount(data.id))
        const name = data.name.toUpperCase();
        if (name === 'TIME FREEZE') {
            dispatch(pauseGame(true));
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
            }, 10000);
            logToAnalytics("trivia_challenge_freeze_boost_used", {
                'documentId': documentId,
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
        }
        if (name === 'SKIP') {
            dispatch(skipQuestion());
            dispatch(boostReleased());
            logToAnalytics("trivia_challenge_skip_boost_used", {
                'documentId': documentId,
                'opponentName': challengeDetails.opponent.username,
                'username': challengeDetails.username,
            })
        }
        // if (name === "BOMB") {
        //     dispatch(bombOptions());
        //     dispatch(boostReleased());
        //     analytics().logEvent("trivia_challenge_bomb_boost_used", {
        //         'documentId': documentId,
        //         'opponentName': challengeDetails.opponent.username,
        //         'username': challengeDetails.username,
        //     })
        // }
    }


    const practiceBoostApplied = (data) => {
        const boostName = data.boostName.toUpperCase();
        if (boostName === 'TIME FREEZE') {
            // setClicked(true)
            setUpdatePracticeFreezeCount(data.count - 1)
            dispatch(pauseGame(true));
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
                // setClicked(false)

            }, 10000);
        }
        if (boostName === 'SKIP') {
            setUpdatePracticeSkipCount(data.count - 1)
            dispatch(skipQuestion());
            dispatch(boostReleased());
        }
    }

    const boostsToDisplay = () => {
        //  bomb is only applicable to multiple choices
        if (gameMode.name === "CHALLENGE") {
            return boosts.filter(x => x.name.toUpperCase() !== "BOMB");
        }
        return boosts;
    }

    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress />
            <View>
                {practiceMode &&
                    <ChallengePracticeBoosts practiceBoosts={practiceBoosts} boostApplied={practiceBoostApplied} />
                }
                {cashMode &&
                    <ChallengeStakingBoosts boosts={boosts} boostsToDisplay={boostsToDisplay} boostApplied={boostApplied} />
                }
            </View>
        </View>
    )
}

const GameTopicProgress = () => {

    return (
        <View style={styles.topicProgress}>
            <GameTopicContainer />
        </View>
    )
}

const GameTopicContainer = () => {
    const gameCategory = useSelector(state => state.game.gameCategory.name);
    const index = useSelector(state => state.triviaChallenge.currentQuestionIndex);
    const total = useSelector(state => state.triviaChallenge.totalQuestions);
    const practiceMode = useSelector(state => state.game.practiceMode);
    const cashMode = useSelector(state => state.game.cashMode);

    return (
        <View style={styles.topicContainer}>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryName} numberOfLines={1}>{gameCategory}</Text>
                <AnsweredGameProgress index={index} total={total} />
                <Text style={styles.questionsAnswered}>
                    {`${index + 1}/${total}`}
                </Text>

            </View>
            {cashMode &&
                <View>
                    <StakeDetails />
                    <SelectedPlayers />
                </View>
            }
            {practiceMode &&
                <View>
                    <View style={styles.demoContainer}>
                        <Image
                            source={require('../../../../assets/images/star.png')}
                            style={styles.starIcon}
                        />
                        <Text style={styles.demoText}>Demo game</Text>
                    </View>
                    <SelectedPlayers />
                </View>
            }
        </View>
    )
}

const AnsweredGameProgress = ({ index, total }) => {

    return (
        <View style={styles.questionsAnsweredContainer}>
            <Progress.Bar progress={(index + 1) / total}
                width={130} color='#E15220' unfilledColor='#F2C8BC' borderWidth={0} height={14} borderRadius={32}
            />
        </View>
    );
}

const StakeDetails = () => {
    const amountStaked = useSelector(state => state.triviaChallenge.amountStaked);

    return (
        <View style={styles.stakeContainer}>
            <Text style={styles.stakeHeader}>STK.</Text>
            <Text style={styles.stakeHeader}>&#8358;{amountStaked}</Text>
        </View>
    )
}

const SelectedPlayers = () => {
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const user = useSelector(state => state.auth.user);
    const username = user.username?.charAt(0) + user.username?.charAt(1);
    const opponentName = challengeDetails.opponent?.username?.charAt(0) + challengeDetails.opponent?.username?.charAt(1)
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerAvatar={username} backgroundColor='#ccded48c' />
            <SelectedPlayer playerAvatar={opponentName} backgroundColor='#FEECE7' />
        </View>
    )
}

const SelectedPlayer = ({ playerAvatar, backgroundColor }) => {
    return (
        <View style={[styles.avatarContent, { backgroundColor: backgroundColor }]}>
            <Text style={styles.avatarText}>{playerAvatar}</Text>
        </View>
    )
}


const ChallengeStakingBoosts = ({ boosts, boostsToDisplay, boostApplied }) => {

    return (
        <>
            {boosts?.length > 0 ?
                <View style={styles.boostItems}>
                    {
                        boostsToDisplay().map((boost, index) =>
                            boost.count >= 1 &&
                            <ChallengeStakingBoost boost={boost} key={index} onConsume={boostApplied} />
                        )
                    }
                </View>
                :
                <></>
            }
        </>
    )
}
const ChallengePracticeBoosts = ({ practiceBoosts, boostApplied }) => {
    return (
        <View style={styles.boostItems}>
            {
                practiceBoosts.map((practiceBoost, index) =>
                    <ChallengePracticeBoost practiceBoost={practiceBoost} key={index} onConsume={boostApplied} />
                )
            }
        </View>
    )
}

const ChallengeStakingBoost = ({ boost, onConsume }) => {

    const scaleValue = useRef(new Animated.Value(1)).current;
    const zoomAnimation = {
        transform: [{ scale: scaleValue }],
    };

    const zoom = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleValue, { toValue: 1.2, duration: 500, useNativeDriver: true }),
            Animated.timing(scaleValue, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start(() => {
            scaleValue.setValue(1);
        });
    }, [scaleValue]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            zoom();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [zoom]);

    useEffect(() => {
        zoom();
    }, []);


    const activeBoost = useSelector(state => state.triviaChallenge.activeBoost);
    const isActive = activeBoost.id === boost.id;
    return (
        <Pressable style={styles.boostContainer} onPress={() => isActive ? {} : onConsume(boost)}>
            <Animated.View style={zoomAnimation}>
                <View style={styles.boostDetailsHead}>
                    <Image
                        source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                        style={styles.boostIcon}
                    />
                    <Text style={styles.storeItemName}>x{formatNumber(boost.count)}</Text>
                </View>
                {/* <Text style={styles.storeItemName}>{boost.name}</Text> */}
            </Animated.View>

        </Pressable>
    )
}

const ChallengePracticeBoost = ({ practiceBoost, onConsume }) => {

    const scaleValue = useRef(new Animated.Value(1)).current;
    const zoomAnimation = {
        transform: [{ scale: scaleValue }],
    };

    const zoom = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleValue, { toValue: 1.2, duration: 500, useNativeDriver: true }),
            Animated.timing(scaleValue, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start(() => {
            scaleValue.setValue(1);
        });
    }, [scaleValue]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            zoom();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [zoom]);

    useEffect(() => {
        zoom();
    }, []);



    return (
        <Animated.View style={zoomAnimation}>
            <Pressable style={styles.boostContainer} onPress={() => onConsume(practiceBoost)}>
                <View style={styles.boostDetailsHead}>
                    <Image
                        source={practiceBoost.icon}
                        style={styles.boostIcon}
                    />
                    <Text style={styles.storeItemName}>x{formatNumber(practiceBoost.count)}</Text>
                </View>
            </Pressable>
        </Animated.View>
    )
}

export default ChallengeGameBoardWidgets;

const styles = EStyleSheet.create({
    gameProgressAndBoost: {
        display: 'flex',
        borderRadius: 16,
        marginVertical: normalize(18),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        backgroundColor: '#fff'

    },
    topicProgress: {
        borderBottomWidth: 1,
        borderColor: '#93939336',
        paddingVertical: normalize(18),
        paddingHorizontal: '.3rem'
    },

    topicContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '1rem'
    },
    categoryContainer: {
        flexDirection: 'column',
    },
    stakeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FA5F4A',
        borderRadius: 30,
        paddingHorizontal: '.4rem',
        paddingVertical: '.2rem'
    },
    stakeHeader: {
        fontSize: '0.65rem',
        fontFamily: 'gotham-medium',
        color: '#FFF',
    },
    categoryName: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        width: '8rem',
        marginBottom:'.8rem'
    },
    questionsAnswered: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.85rem',
        marginTop:'.7rem'
    },
    oddContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    oddTitle: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem'
    },
    oddText: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '0.8rem',
        marginLeft: '.3rem'
    },
    demoContainer: {
        backgroundColor: '#E15220',
        borderRadius: 30,
        paddingHorizontal: '.35rem',
        paddingVertical: '.3rem',
        flexDirection: 'row',
        alignItems: 'center'
    },
    demoText: {
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
        fontSize: '0.7rem'
    },
    starIcon: {
        width: '.7rem',
        height: '.7rem'
    },
    playerImage: {
        flexDirection: 'row',
        marginTop: '.7rem'
    },
    avatarContent: {
        borderRadius: 100,
        width: '2.3rem',
        height: '2.3rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: {
        textTransform: 'uppercase',
        fontFamily: 'gotham-medium',
        fontSize: '0.8rem',
        color: '#1C453B'
    },

    availableBoosts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(10),
        paddingHorizontal: '.5rem'
    },

    availableBoost: {
        display: 'flex',
        flexDirection: 'row',
    },
    boostActive: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: normalize(5),
        padding: normalize(7),
        shadowColor: 'rgba(0, 0, 0, 0.75)',
        shadowOffset: { width: -1, height: 1 },
    },
    boostContainer: {

    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: '1rem'
    },
    boostIcon: {
        width: '3.2rem',
        height: '3.2rem',
    },
    storeItemName: {
        fontSize: '.9rem',
        color: '#fff',
        fontFamily: 'gotham-bold',
        textShadowColor: '#121212',
        textShadowRadius: 1,
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        position: 'absolute',
        left: 35,
        top: 10
    },
    name: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
    },
    boostItems: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '1rem',
        paddingVertical: '.7rem'
    },


})
