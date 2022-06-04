import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, Pressable, ImageBackground } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';
import Animated from 'react-native-reanimated';
import { isTrue, formatCurrency, formatNumber } from '../utils/stringUtl';
import normalize, {
    responsiveScreenWidth
} from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import { calculateTimeRemaining, randomEnteringAnimation } from '../utils/utils';

const UpComingTriviaCard = ({ upcomingTrivia }) => {
    const navigation = useNavigation();
    const [triviaTimer, setTriviaTimer] = useState('');

    useEffect(() => {
        if (upcomingTrivia === null) {
            return;
        }

        const startTime = upcomingTrivia.start_timespan + new Date().getTime();
        const countDown = setInterval(() => {
            setTriviaTimer(calculateTimeRemaining(startTime));
        }, 1000);

        return () => clearInterval(countDown);

    }, [upcomingTrivia])

    if (!isTrue(triviaTimer) || upcomingTrivia === null) {
        return null;
    }

    const status = upcomingTrivia.status;
    console.log("status", status)

    return (
        <Animated.View entering={randomEnteringAnimation().duration(2000)} style={styles.triviaContainer}>
            <ImageBackground
                source={require('../../assets/images/live-trivia-card-background-blue.png')}
                style={styles.triviaBackground}
                imageStyle={{ borderRadius: 20 }}
                resizeMode='cover'>

                <Pressable onPress={() => navigation.navigate('Trivia')}>
                    <View style={styles.triviaCardTop}>
                        <Text style={styles.triviaName}>{upcomingTrivia.name}</Text>
                        <View style={styles.triviaTopLeft}>
                            <Image
                                source={require('../../assets/images/yellow-line-top.png')}
                                style={styles.triviaYellowLine}
                            />
                            <Ionicons name="information-circle-outline" size={24} color="#FFFF" />
                        </View>

                    </View>
                    <Text style={styles.triviaAmount}>&#8358;{formatCurrency(upcomingTrivia.grand_price)}</Text>
                    <Text style={styles.triviaAdText}>up for grab!</Text>
                    {/* <Text style={styles.triviaTimeText}>Grand price: &#8358;{formatCurrency(upcomingTrivia.grand_price)}</Text> */}
                    {/* <Text style={styles.triviaDate}>{upcomingTrivia.start_time}</Text> */}
                    {/* <Text style={styles.triviaDate}>Points eligibility: {upcomingTrivia.point_eligibility}</Text> */}
                    <View style={styles.triviaBoardBottom}>
                        <View style={styles.triviaTimeCountdown}>
                            <Ionicons name="timer-outline" size={15} color="#FFFF" style={styles.timeIcon} />
                            <Text style={styles.triviaTimeCountdownText}>Starts in {triviaTimer}</Text>
                        </View>
                        <Image
                            source={require('../../assets/images/yellow-line-bottom.png')}
                        />
                    </View>
                </Pressable>
            </ImageBackground>
        </Animated.View>
    )
}


const styles = EStyleSheet.create({
    triviaContainer: {
        marginTop: responsiveScreenWidth(5),
    },
    triviaBackground: {
        flex: 1,
        justifyContent: "center",
        padding: '1rem',
        borderRadius: 20,
    },
    triviaTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    triviaCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    triviaYellowLine: {
        marginRight: normalize(6)
    },
    triviaTopLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    triviaName: {
        fontSize: '0.85rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
    },
    triviaAmount: {
        fontSize: '1.8rem',
        color: '#FFFF',
        lineHeight: '2.1rem',
        fontFamily: 'graphik-medium',
    },
    triviaAdText: {
        fontSize: '.85rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    triviaTimeText: {
        fontSize: '1rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
    },
    triviaBoardBottom: {
        marginTop: responsiveScreenWidth(10),
    },
    triviaTimeCountdown: {
        flexDirection: 'row',
        alignItems: "center",
        marginVertical: "0.1rem",
    },
    timeIcon: {
        marginRight: normalize(5)
    },
    triviaTimeCountdownText: {
        fontSize: '0.75rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
        lineHeight: '0.8rem'
    },
})

export default UpComingTriviaCard
