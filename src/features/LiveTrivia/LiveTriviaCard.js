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
import { getLiveTriviaStatus } from './LiveTriviaSlice';
import FailedBottomSheet from './FailedBottomSheet';



const LiveTriviaCard = ({trivia}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const notEnoughPointNotice = useRef();
    const user = useSelector(state => state.auth.user)


    const initialLoading = useSelector(state => state.common.initialLoading);
    // const trivia = useSelector(state => state.liveTrivia.data);

    const triviaActionButtonClicked = () => {
        if (trivia.playerStatus === "INSUFFICIENTPOINTS") {
            notEnoughPointNotice.current.open();
        } else if (trivia.playerStatus === "PLAYED") {
            navigation.navigate('LiveTriviaLeaderboard', { triviaId: trivia.id });
        } else if (trivia.playerStatus === "CANPLAY") {
            navigation.navigate('TriviaInstructions', { ...trivia })
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (initialLoading)
                return;
            dispatch(getLiveTriviaStatus())
        }, [initialLoading])
    );

    if (!trivia) {
        return null;
    }

    return (
        <Animated.View entering={BounceInRight.duration(2000)}>
            <ImageBackground
                source={require('../../../assets/images/live-trivia-card-background-blue.png')}
                style={styles.triviaBackground}
                resizeMode='contain'>
                <FailedBottomSheet
                    refBottomSheet={notEnoughPointNotice}
                    onClose={() => notEnoughPointNotice.current.close()}
                    pointsRequired={trivia.pointsRequired}
                    userPoints={user.todaysPoints}
                />
                <View style={styles.triviaContainer}>
                    <View style={styles.triviaTop}>
                        <Text style={styles.triviaTopText}>{trivia.title}</Text>
                        {/* <Ionicons name="help-circle-outline" size={24} color="#FFFF" /> */}
                    </View>
                    <Text style={styles.triviaTitle}>{trivia.prizeDisplayText}</Text>
                    {/* <Text style={styles.triviaAdText}>up for grabs !</Text> */}
                    <Text style={styles.triviaAdText}>{trivia.startDateDisplayText}</Text>

                    <View style={styles.triviaBoardBottom}>
                        <View>
                            <View style={styles.triviaTimeCountdown}>
                                <TriviaStatus trivia={trivia} />
                            </View>
                            <Image
                                source={require('../../../assets/images/yellow-line-bottom.png')}
                            />
                        </View>
                        <TriviaAction trivia={trivia} action={triviaActionButtonClicked} />
                    </View>
                </View>
            </ImageBackground>
        </Animated.View>
    )
}


function TriviaStatus({ trivia }) {

    const { status, statusDisplayText } = trivia;

    if (status === "WAITING") {
        return <TriviaCountDown trivia={trivia} />
    }

    return <Text style={styles.statusText}>STATUS: {statusDisplayText}</Text>
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
            dispatch(getLiveTriviaStatus());
        }

        const countDown = setInterval(() => {
            const timeString = calculateTimeRemaining(trivia.startAtUtc, onComplete);
            setTriviaTimer(timeString);
        }, 1000);

        return () => clearInterval(countDown);

    }, [trivia])

    return (
        <>
            <Ionicons name="timer-outline" size={15} color="#FFFF" style={styles.timeIcon} />
            <Text style={styles.statusText}>Starts in {triviaTimer}</Text>
        </>
    )
}

function TriviaAction({ trivia, action }) {

    let { actionDisplayText } = trivia;

    if (actionDisplayText === "") {
        return null;
    }

    return (
        <Pressable style={styles.triviaButton} onPress={action}>
            <Text style={styles.triviaButtonText}>{actionDisplayText}</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#4F4949" />
        </Pressable>
    )
}

const styles = EStyleSheet.create({
    triviaBackground: {
        borderRadius: 20,
    },
    triviaContainer: {
        padding: '1rem'
    },
    triviaTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    triviaTopText: {
        fontSize: '.85rem',
        lineHeight: '.85rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-medium',
    },
    triviaTitle: {
        fontSize: '1.8rem',
        color: '#FFFF',
        lineHeight: '2.1rem',
        fontFamily: 'graphik-medium',
    },
    triviaAdText: {
        fontSize: '.85rem',
        color: '#FFFF',
        opacity: 0.8,
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
        marginVertical: "0.5rem",
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
        lineHeight: '.65rem',
        color: '#4F4949',
        fontFamily: 'graphik-medium',
    },
});

export default LiveTriviaCard
