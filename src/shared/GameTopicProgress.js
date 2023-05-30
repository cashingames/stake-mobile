import React from "react";
import { View, Animated, Text } from "react-native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";
import AnsweredGameProgress from "./AnsweredGameProgress";

const GameTopicProgress = ({ onComplete, ending }) => {
    const countdownKey = useSelector(state => state.game.countdownKey);
    const isGamePaused = useSelector(state => state.game.countdownFrozen);
    const gameDuration = useSelector(state => state.game.gameDuration);
    const isEnded = useSelector(state => state.game.isEnded);
    const gameCategoryName = useSelector(state => state.game.gameCategory.name);
    const gameSubCategoryName = useSelector(state => state.game.subGameCategory.name);
    console.log(gameDuration)

    return (
        <View style={styles.topicProgress}>
            <Text style={styles.gameInfo}>{`${gameCategoryName}(${gameSubCategoryName})`}</Text>
            <View style={styles.topicProgressRight}>
                <AnsweredGameProgress />
                <View style={styles.questionsAnsweredContainer}>

                    {!isEnded &&
                        <CountdownCircleTimer
                            isPlaying={!isGamePaused && !ending}
                            duration={gameDuration}
                            colors={['#fff', '#F7B801', '#A30000']}
                            colorsTime={[gameDuration / 2, gameDuration / 4, 0]}
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
                    }
                </View>

                <View style={styles.questionsAnsweredContainer}>
                    {/* {!isEnded &&
                        <CountdownCircleTimer
                            isPlaying={!isGamePaused && !ending}
                            duration={gameDuration}
                            // colors={[["#fff", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                            // trailColor="#2D9CDB"

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
                    } */}
                </View>
            </View>
        </View>
    )
}
export default GameTopicProgress;

const styles = EStyleSheet.create({
    topicProgress: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        padding: '1rem',
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
    gameInfo: {
        marginRight: '0.3rem',
        color: '#fff',
        fontSize: '0.6rem',
        fontFamily: 'blues-smile',
        textAlign: 'center',
        width: normalize(150)
    }
})