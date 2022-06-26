import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, Pressable, ImageBackground } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { formatCurrency } from '../utils/stringUtl';
import normalize from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import FailedBottomSheet from '../features/LiveTrivia/FailedBottomSheet';
// import { calculateTimeRemaining, randomEnteringAnimation } from '../../utils/utils';
// import { getLiveTriviaStatus } from './LiveTriviaSlice';
// import FailedBottomSheet from './FailedBottomSheet';


const LiveTriviaCardComponent = ({ trivia }) => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user)
    const canPlay = (user.todaysPoints) >= (trivia.point_eligibility);
    const notEnoughPointNotice = useRef();

    const actionButtonClicked = () => {
        if ( trivia.playerStatus === "INSUFFICIENTPOINTS") {
            notEnoughPointNotice.current.open();
        } else if (trivia.status === "ONGOING" && trivia.playerStatus === "CANPLAY") {
            navigation.navigate('TriviaInstructions', { ...trivia })
        }
    }

    return (
        <ImageBackground
            source={require('../../assets/images/live-trivia-card-background-blue.png')}
            style={styles.triviaBackground}
            resizeMode='contain'>
            <FailedBottomSheet
                refBottomSheet={notEnoughPointNotice}
                onClose={() => notEnoughPointNotice.current.close()}
                userPoints={user.todaysPoints}
                pointsRequired={trivia.pointsRequired}
            />
            <View style={styles.triviaContainer}>
                <View style={styles.triviaTop}>
                    <Text style={styles.triviaTopText}>{trivia.title}</Text>
                    {/* <Ionicons name="help-circle-outline" size={24} color="#FFFF" /> */}
                </View>
                <Text style={styles.triviaTitle}>{trivia.prizeDisplayText}</Text>
                {/* <Text style={styles.triviaAdText}>up for grabs !</Text> */}
                <Text style={styles.triviaAdText}>{trivia.startAt}</Text>
                <View style={styles.triviaBoardBottom}>
                    <View>
                        <View style={styles.triviaTimeCountdown}>
                            <TriviaStatus trivia={trivia} action={actionButtonClicked} />
                        </View>
                        <Image
                            source={require('../../assets/images/yellow-line-bottom.png')}
                        />
                    </View>
                    <TriviaLeaderBoard trivia={trivia} />
                </View>

            </View>
        </ImageBackground>
    )
}

const TriviaStatus = ({ trivia, action}) => {
    // const navigation = useNavigation();
    // const user = useSelector(state => state.auth.user)
    // const canPlay = (user.todaysPoints) >= (trivia.point_eligibility);

    return (
        <>
            {trivia.playerStatus === "CANPLAY" ?
                <Pressable style={[trivia.status === "ONGOING" ? styles.triviaStageContainer : styles.disabled,
                trivia.playerStatus === "INSUFFICIENTPOINTS" ? styles.disabled : {},
                trivia.playerStatus === "PLAYED" ? styles.disabled : {}]}
                    onPress={action}
                    disabled={trivia.playerStatus === "INSUFFICIENTPOINTS" ||
                        trivia.playerStatus === "PLAYED" ||
                        trivia.playerStatus === "WAITING"}
                >
                    {trivia.status === "ONGOING" && trivia.playerStatus !== "PLAYED" ?
                        <Text style={styles.statusText}>Click to join Now</Text>
                        :
                        <Text style={styles.triviaClosed}>Closed</Text>
                    }
                </Pressable>
                :
                <>
                    {trivia.status === "ONGOING" && trivia.playerStatus !== "PLAYED"  ?
                        <Pressable style={styles.triviaStageContainer} onPress={action}>
                            <Text style={styles.statusText}>Click to join Now</Text>
                        </Pressable>
                        :
                        <View style={styles.disabled}>
                            <Text style={styles.triviaClosed}>Closed</Text>
                        </View>
                    }
                </>
            }

        </>
    )
}

const TriviaLeaderBoard = ({ trivia }) => {
    const navigation = useNavigation();
    return (
        <>
            <Pressable style={styles.triviaButton} onPress={() => navigation.navigate('LiveTriviaLeaderboard', { triviaId: trivia.id })}>
                <Text style={styles.triviaButtonText}>Leaderboard</Text>
                <Ionicons name="chevron-forward-outline" size={24} color="#4F4949" />
            </Pressable>
        </>
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
    triviaStageContainer: {
        backgroundColor: '#EF2F55',
        paddingVertical: normalize(5),
        paddingHorizontal: normalize(15),
        // borderRadius: 15,
        alignItems: 'center'
    },
    disabled: {
        backgroundColor: '#cccccc',
        paddingVertical: normalize(5),
        // borderRadius: 15,
        alignItems: 'center',
        paddingHorizontal: normalize(15),
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
    triviaClosed: {
        fontSize: '0.7rem',
        color: '#666666',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    statusText: {
        fontSize: '0.75rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
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
export default LiveTriviaCardComponent