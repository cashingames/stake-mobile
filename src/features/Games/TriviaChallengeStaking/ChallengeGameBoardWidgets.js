import React, { useEffect, useRef, useCallback } from "react";
import { View, Image, Pressable, Animated } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Constants from 'expo-constants';
import { formatNumber } from "../../../utils/stringUtl";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import { reduceBoostCount } from "../../Auth/AuthSlice";
import { boostReleased, consumeBoost, pauseGame, skipQuestion } from "./TriviaChallengeGameSlice";
import logToAnalytics from "../../../utils/analytics";

const ChallengeGameBoardWidgets = () => {
    const dispatch = useDispatch();
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const boosts = useSelector(state => state.auth.user.boosts);
    const gameMode = useSelector(state => state.game.gameMode);
    const documentId = useSelector(state => state.triviaChallenge.documentId);



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

    const boostsToDisplay = () => {
        //  bomb is only applicable to multiple choices
        if (gameMode.name === "CHALLENGE") {
            return boosts.filter(x => x.name.toUpperCase() !== "BOMB");
        }
        return boosts;
    }

    return (
        <View style={styles.gameProgressAndBoost}>
            <ChallengeStakingBoosts boosts={boosts} boostsToDisplay={boostsToDisplay} boostApplied={boostApplied} />
        </View>
    )
}


const ChallengeStakingBoosts = ({ boosts, boostsToDisplay, boostApplied }) => {
    const user = useSelector(state => state.auth.user);

    return (
        <>
            {boosts?.length > 0 ?
                <View style={styles.availableBoosts}>
                    <View style={styles.boostinfo}>
                        <Text style={styles.title}>{user.username}, score higher with boost</Text>
                    </View>
                    <View style={styles.availableBoostsIcons}>
                        {
                            boostsToDisplay().map((boost, index) =>
                                boost.count >= 1 &&
                                <ChallengeStakingBoost boost={boost} key={index} onConsume={boostApplied} />
                            )
                        }
                    </View>

                </View>
                :
                <></>
            }
        </>
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
        <Pressable style={styles.boostContainer}  onPress={() => isActive ? {} : onConsume(boost)}>
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

export default ChallengeGameBoardWidgets;

const styles = EStyleSheet.create({
    gameProgressAndBoost: {
        display: 'flex',
        shadowColor: 'inset 0px 4px 0px rgba(0, 0, 0, 0.05)',
        borderRadius: 16,
        marginVertical: normalize(18),
        backgroundColor: '#AAD880',
        paddingVertical: '1rem'
    },
    topicProgress: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    questionsAnsweredContainer: {
        marginRight: normalize(20)
    },

    questionsAnsweredContainer: {
        marginRight: normalize(20)
    },
    questionsAnswered: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
    },
    availableBoosts: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    availableBoost: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    availableBoostsIcons: {
        flexDirection: 'row',
        marginTop:'1rem'

    },
    boostinfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    title: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '.85rem'
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
        alignItems: 'center',
        marginHorizontal: '1rem'
    },
    name: {
        color: '#FFFF',
        fontFamily: 'gotham-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
    },
    opponentName: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginLeft: '1rem'
    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: '.5rem'
    },
    boostIcon: {
        width: '2rem',
        height: '2rem',
    },
    storeItemName: {
        fontFamily: 'graphik-bold',
        fontSize: '0.8rem',
        color: '#FFF',
    },


})
