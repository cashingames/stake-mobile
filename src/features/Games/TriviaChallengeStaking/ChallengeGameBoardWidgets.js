import React from "react";
import { View, Animated, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import Constants from 'expo-constants';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import LottieAnimations from "../../../shared/LottieAnimations";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { isTrue } from "../../../utils/stringUtl";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";

const ChallengeGameBoardWidgets = ({onComplete}) => {
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const opponentDetails = challengeDetails.opponent

    return (
        <View style={styles.gameProgressAndBoost}>
            <RenderGameProgress onComplete={onComplete} />
            <PlayersInfo opponentDetails={opponentDetails} />
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

const PlayersInfo = ({ challengeDetails }) => {
    return (
        <View style={styles.playersContainer}>
            <UserPlayerInfo playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />
            <Text style={styles.versus}>vs</Text>
            <OpponentPlayerInfo playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
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

export default ChallengeGameBoardWidgets;

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