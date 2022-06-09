import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, Pressable, ImageBackground } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { formatCurrency } from '../../utils/stringUtl';
import normalize from '../../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import { calculateTimeRemaining, randomEnteringAnimation } from '../../utils/utils';
import { liveTriviaStatus } from './LiveTriviaSlice';
import FailedBottomSheet from '../../shared/FailedBottomSheet';



const LiveTriviaCard = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const refRBSheet = useRef();

    const initialLoading = useSelector(state => state.common.initialLoading);
    const trivia = useSelector(state => state.liveTrivia.data);

    const user = useSelector(state => state.auth.user)


    const notEnoughPoints = () => {
        refRBSheet.current.open()
    }

    const onClose = () => {
        refRBSheet.current.close()
    }


    const canPlayAction = () => {
        if (trivia.player_status === "CANPLAY" || trivia.player_status !== "INSUFFICIENTPOINTS") {
            navigation.navigate('TriviaInstructions', {
                type: trivia.game_type_id,
                mode: trivia.game_mode_id,
                category: trivia.category_id,
                trivia: trivia.id,
                questionCount: trivia.question_count,
                gameDuration: trivia.game_duration
            })
        } else {
            notEnoughPoints();
        }
    }

    const playedAction = () => {
        navigation.navigate('LiveTriviaLeaderboard', { triviaId: trivia.id });
    }

    // console.log("live trivia", trivia);
    useFocusEffect(
        React.useCallback(() => {
            if (initialLoading)
                return;
            dispatch(liveTriviaStatus())
        }, [initialLoading])
    );

    if (!trivia) {
        return null;
    }

    return (
        <Animated.View entering={randomEnteringAnimation().duration(2000)}>
            <ImageBackground
                source={require('../../../assets/images/live-trivia-card-background-blue.png')}
                style={styles.triviaBackground}
                imageStyle={{ borderRadius: 20 }}
                resizeMode='cover'>
                {/* onPress={() => navigation.navigate('Trivia')} */}
                <FailedBottomSheet refBottomSheet={refRBSheet} pointsRequired={trivia.point_eligibility}
                    onClose={onClose}
                />
                <View style={styles.triviaContainer}>
                    <View style={styles.triviaTop}>
                        <Text style={styles.triviaTopText}>Play live tournament</Text>
                        <Ionicons name="information-circle-outline" size={20} color="#FFFF" />
                    </View>
                    <Text style={styles.triviaTitle}>&#8358;{formatCurrency(trivia.grand_price)}</Text>
                    <Text style={styles.triviaAdText}>up for grabs !</Text>
                    <View style={styles.triviaBoardBottom}>
                        <View>
                            <View style={styles.triviaTimeCountdown}>
                                <TriviaStatus trivia={trivia} />
                            </View>
                            <Image
                                source={require('../../../assets/images/yellow-line-bottom.png')}
                            />
                        </View>
                        <TriviaAction trivia={trivia} canPlayAction={canPlayAction} playedAction={playedAction} />
                    </View>
                </View>
            </ImageBackground>
        </Animated.View>
    )
}


function TriviaStatus({ trivia }) {

    console.log(trivia);

    const { status } = trivia;

    if (status === "WAITING") {
        return <TriviaCountDown trivia={trivia} />
    }

    return <Text style={styles.statusText}>STATUS: {status}</Text>
}

function TriviaCountDown({ trivia }) {
    const dispatch = useDispatch();
    const [triviaTimer, setTriviaTimer] = useState('');


    useEffect(() => {
        if (!trivia || trivia.status !== "WAITING") {
            return;
        }

        const onComplete = () => {
            clearInterval(countDown);
            dispatch(liveTriviaStatus());
        }

        const countDown = setInterval(() => {
            const timeString = calculateTimeRemaining(trivia.start_time_utc, onComplete);
            setTriviaTimer(timeString);
        }, 1000);

        return () => clearInterval(countDown);

    }, [trivia])

    // useEffect(() => {
    //     console.log(triviaTimer)
    //     if(triviaTimer === "RUNNING"){
    //     }
    // }, [triviaTimer])

    return (
        <>
            <Ionicons name="timer-outline" size={15} color="#FFFF" style={styles.timeIcon} />
            <Text style={styles.statusText}>Starts in {triviaTimer}</Text>
        </>
    )
}

function TriviaAction({ trivia, canPlayAction, playedAction }) {

    let { status, player_status } = trivia;

    const text = () => {
        if (player_status === "PLAYED") {
            return "LEADERBOARD";
        }

        let t = "";

        switch (status) {
            case "ONGOING":
                t = "JOIN NOW"
                break;
            case "CLOSED":
                t = "LEADERBOARD"
                break;
            default:
                break;
        }

        return t;
    }



    if (status === "WAITING") {
        return null;
    }

    return (
        <Pressable style={styles.triviaButton} onPress={player_status === "PLAYED" ? playedAction : canPlayAction}>
            <Text style={styles.triviaButtonText}>{text()}</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#4F4949" />
        </Pressable>
    )
}

const styles = EStyleSheet.create({
    triviaBackground: {
        borderRadius: 20,
    },
    triviaContainer: {
        margin: '1rem',
        // paddingVertical: '1rem'
    },
    triviaTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    triviaTopText: {
        fontSize: '.85rem',
        // lineHeight: '.7rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
        // textTransform: 'uppercase',
    },
    triviaTitle: {
        fontSize: '1.8rem',
        color: '#FFFF',
        lineHeight: '2.1rem',
        fontFamily: 'graphik-bold',
    },
    triviaAdText: {
        fontSize: '.85rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    triviaBoardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "flex-end",
        marginTop: normalize(45)
    },
    triviaTimeCountdown: {
        flexDirection: 'row',
        alignItems: "center",
        marginVertical: "0.2rem",
    },
    timeIcon: {
        marginRight: 7
    },
    statusText: {
        fontSize: '0.75rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        lineHeight: '0.7rem'
    },
    triviaButton: {
        flexDirection: 'row',
        backgroundColor: '#FFD064',
        borderRadius: 12,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        paddingHorizontal: normalize(5),
        paddingVertical: normalize(5.5),
        borderColor: '#C39938',
        alignItems: 'center',
    },
    triviaButtonText: {
        fontSize: '.65rem',
        color: '#4F4949',
        fontFamily: 'graphik-medium',
    },
});

export default LiveTriviaCard
