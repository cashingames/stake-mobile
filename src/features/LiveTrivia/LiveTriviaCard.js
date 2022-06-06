import React, { useEffect, useState } from 'react';
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


const LiveTriviaCard = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const initialLoading = useSelector(state => state.common.initialLoading);
    const trivia = useSelector(state => state.liveTrivia.data);

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
                <View style={styles.triviaContainer}>
                    <View style={styles.triviaTop}>
                        <Text style={styles.triviaTopText}>Play live tournament</Text>
                        <Ionicons name="information-circle-outline" size={24} color="#FFFF" />
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
                        <TriviaAction trivia={trivia} />
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

    return <Text style={styles.statusText}>{status}</Text>
}

function TriviaCountDown({ trivia }) {
    const [triviaTimer, setTriviaTimer] = useState('');


    useEffect(() => {
        if (!trivia || trivia.status !== "WAITING") {
            return;
        }

        const countDown = setInterval(() => {
            setTriviaTimer(calculateTimeRemaining(trivia.start_time_utc));
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

function TriviaAction({ trivia }) {

    let { status, played } = trivia;

    const text = () => {
        if (played) {
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

    const action = () => {
        console.log("action")
    }

    if (status === "WAITING") {
        return null;
    }

    return (
        <Pressable style={styles.triviaButton} onPress={action}>
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
    },
    triviaTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    triviaTopText: {
        fontSize: '1rem',
        lineHeight: '1rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
        textTransform: 'uppercase',
    },
    triviaTitle: {
        fontSize: '2rem',
        color: '#FFFF',
        lineHeight: '2.4rem',
        fontFamily: 'graphik-bold',
    },
    triviaAdText: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    triviaBoardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "flex-end",
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
        fontSize: '0.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        lineHeight: '0.9rem'
    },
    triviaButton: {
        flexDirection: 'row',
        backgroundColor: '#FFD064',
        borderRadius: 12,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(5.5),
        borderColor: '#C39938',
        alignItems: 'center',
    },
    triviaButtonText: {
        fontSize: '.7rem',
        color: '#4F4949',
        fontFamily: 'graphik-medium',
    },
});

export default LiveTriviaCard
