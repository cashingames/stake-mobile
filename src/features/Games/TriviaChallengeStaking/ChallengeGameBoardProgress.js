import React, { useEffect, useState } from "react";
import { View, Animated, Pressable, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import LottieAnimations from "../../../shared/LottieAnimations";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { formatNumber, isTrue } from "../../../utils/stringUtl";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { bombOptions, boostReleased, consumeBoost, pauseGame, skipQuestion } from "../GameSlice";
import { reduceBoostCount } from "../../Auth/AuthSlice";
import Constants from 'expo-constants';




const ChallengeGameBoardProgress = ({onComplete}) => {
    const user = useSelector(state => state.auth.user);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const opponentDetails = challengeDetails.opponent

    return (
        <View style={styles.gameProgressAndBoost}>
            <RenderGameProgress onComplete={onComplete} />
            {/* <AvailableGameSessionBoosts /> */}
            <PlayersInfo user={user} opponentDetails={opponentDetails} />
        </View>
    )
}

const RenderGameProgress = ({onComplete}) => {
    const countdownKey = useSelector(state => state.triviaChallenge.countdownKey);
    const isGamePaused = useSelector(state => state.triviaChallenge.countdownFrozen);
    const gameDuration = useSelector(state => state.triviaChallenge.gameDuration);

    return (
        <View style={styles.topicProgress}>
            <LottieAnimations
                animationView={require('../../../../assets/game-board.json')}
                height={normalize(90)}
            />
            <View style={styles.topicProgressRight}>
                <RenderQuestionsCount />
                <View style={styles.questionsAnsweredContainer}>

                    <CountdownCircleTimer
                        isPlaying={!isGamePaused}
                        duration={gameDuration}
                        colors={['#fff', '#F7B801', '#A30000']}
                        colorsTime={[gameDuration/2, gameDuration/4, 0]}
                        trailColor="#2D9CDB"
                        size={60}
                        strokeWidth={5}
                        key={countdownKey}
                        onComplete={onComplete}

                    >
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

const RenderQuestionsCount = () => {

    const totalQuestions = useSelector(state => state.triviaChallenge.totalQuestions);
    const currentQuestionIndex = useSelector(state => state.triviaChallenge.currentQuestionIndex);
    return (
        <View style={styles.questionsAnsweredContainer}>
            <AnimatedCircularProgress
                size={60}
                width={5}
                fill={((currentQuestionIndex + 1) / totalQuestions * 100)}
                tintColor="#2D9CDB"
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#fff">
                {
                    (fill) => (
                        <Text style={styles.questionsAnswered}>
                            {`${currentQuestionIndex + 1}/${totalQuestions}`}
                        </Text>
                    )
                }
            </AnimatedCircularProgress>
        </View>
    );
}


const AvailableGameSessionBoosts = () => {
    const dispatch = useDispatch();
    const boosts = useSelector(state => state.auth.user.boosts);
    const user = useSelector(state => state.auth.user)
    const displayedOptions = useSelector(state => state.game.displayedOptions);
    const gameMode = useSelector(state => state.game.gameMode);
    const [showText, setShowText] = useState(true);


    const boostsToDisplay = () => {
        //  bomb is only applicable to multiple choices
        if (displayedOptions.length === 2) {
            return boosts.filter(x => x.name.toUpperCase() !== "BOMB");
        }
        if (gameMode.name === "CHALLENGE") {
            return boosts.filter(x => x.name.toUpperCase() !== "SKIP");
        }
        return boosts;
    }

    useEffect(() => {
        // Change the state every second or the time given by User.
        const interval = setInterval(() => {
            setShowText((showText) => !showText);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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
                            <AvailableBoost boost={boost} key={index} onConsume={boostApplied} showText={showText} />
                        )
                    }

                </View>
                :
                <></>
            }
        </>
    )
}

const AvailableBoost = ({ boost, onConsume, showText }) => {
    const activeBoost = useSelector(state => state.game.activeBoost);
    const isActive = activeBoost.id === boost.id;

    return (
        <Pressable onPress={() => isActive ? {} : onConsume(boost)}>
            <View style={styles.boostContainer}>
                <View style={[styles.availableBoost, isActive ? styles.boostActive : {}]}>
                    <Image
                        source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                        style={[styles.boostIcon, { opacity: showText ? 0 : 1 }]}
                    />
                    <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
                </View>
                <Text style={styles.name}>{boost.name}</Text>
            </View>
        </Pressable>
    )
}

const PlayersInfo = ({ user, opponentDetails }) => {
    return (
        <View style={styles.playersContainer}>
            <UserPlayerInfo playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />
            <Text style={styles.versus}>vs</Text>
            <OpponentPlayerInfo playerName={opponentDetails.username} playerAvatar={require("../../../../assets/images/user-icon.png")} />
        </View>
    )
}

const UserPlayerInfo = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.playerDetails}>
            <Text style={styles.username}>{playerName}</Text>
            <Image
                source={playerAvatar}
                style={styles.avatar}
            />
        </View>
    )
}
const OpponentPlayerInfo = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.playerDetails}>
            <Image
                source={playerAvatar}
                style={styles.avatar}
            />
            <Text style={styles.opponentName}>{playerName}</Text>
        </View>
    )
}

export default ChallengeGameBoardProgress;

const styles = EStyleSheet.create({
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
    questionsAnsweredContainer: {
        marginRight: normalize(20)
    },
    timeText: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem'
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: normalize(18),
        paddingVertical: normalize(18),
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
    availableBoost: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: normalize(20)
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
        alignItems: 'flex-end'
    },
    boostIcon: {
        width: normalize(33),
        height: normalize(33)
    },
    amount: {
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        fontSize: '0.6rem',
    },
    name: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
    },
    avatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    playersContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalize(20),

    },
    playerDetails: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    username: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginRight:'1rem'
    },
    opponentName: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginLeft:'1rem'
    },
    versus: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
})