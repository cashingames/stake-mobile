import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, Pressable, ImageBackground, Animated } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
// import Animated, { BounceInRight } from 'react-native-reanimated';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import { calculateTimeRemaining } from '../../utils/utils';
import { formatCurrency } from '../../utils/stringUtl';
import { getLiveTriviaStatus, liveTriviaPayment } from './LiveTriviaSlice';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import LiveTriviaEntryFailedText from './LiveTriviaEntryFailedText';
import analytics from '@react-native-firebase/analytics';
import LowWalletBalance from '../../shared/LowWalletBalance';
import { getUser } from '../Auth/AuthSlice';
import { Alert } from 'react-native';
import { unwrapResult } from '@reduxjs/toolkit';
import { ActivityIndicator } from 'react-native';



const LiveTriviaCard = ({ trivia }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const notEnoughPointNotice = useRef();
    const user = useSelector(state => state.auth.user)
    const [showText, setShowText] = useState(true);
    const [loading, setLoading] = useState(false);


    const initialLoading = useSelector(state => state.common.initialLoading);

    const openBottomSheet = async () => {
        notEnoughPointNotice.current.open()
    }

    const closeBottomSheet = () => {
        dispatch(getUser());
        notEnoughPointNotice.current.close()
    }

    const payForLiveTrivia = () => {
        dispatch(liveTriviaPayment({
            liveTriviaId: trivia.id
        }))
            .then(unwrapResult)
            .then(async () => {
                await analytics().logEvent('live_trivia_payment_made', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                });
            })
            .then(result => {
                dispatch(getLiveTriviaStatus())
                dispatch(getUser());
                if (trivia.status === "WAITING") {
                    Alert.alert('You have successfully paid for this live triva')
                    return;
                }
                if (trivia.playerStatus === "CANPLAY" && trivia.status !== "EXPIRED") {
                    navigation.navigate('TriviaInstructions', { ...trivia })
                    return;
                }
                setLoading(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                Alert.alert(rejectedValueOrSerializedError.message)
                setLoading(false);
            });
    }

    const payForOngoingLiveTrivia = () => {
        setLoading(true)
        dispatch(liveTriviaPayment({
            liveTriviaId: trivia.id
        }))
            .then(unwrapResult)
            .then(async () => {
                await analytics().logEvent('live_trivia_payment_made', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                });
            })
            .then(result => {
                console.log('paid')
                navigation.navigate('TriviaInstructions', { ...trivia })
                setLoading(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                Alert.alert(rejectedValueOrSerializedError.message)
                setLoading(false);
            });
    }

    const TriviaEntryFeePaymentConfirmation = () => {
        setLoading(true)
        if (trivia.entryFee > user.walletBalance) {
            setLoading(false);
            openBottomSheet()
            return
        }

        if (trivia.entryFee < user.walletBalance) {
            setLoading(false);
            Alert.alert(
                "Payment Notification",
                `An amount of ${trivia.entryFee} naira would be deducted from your wallet balance as entry fee for this live trivia  `,
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Proceed", onPress: () => payForLiveTrivia() }
                ]
            );

            return
        }


    }

    const triviaActionButtonClicked = async () => {
        if (trivia.playerStatus === "INSUFFICIENTPOINTS" && trivia.status === "ONGOING") {
            await analytics().logEvent('insufficient_live_trivia_point', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            })
            notEnoughPointNotice.current.open()

        }
        else if (trivia.entryFee > user.walletBalance && trivia.status === "ONGOING" && trivia.entryFreePaid === false) {
            await analytics().logEvent('insufficient_wallet_balance', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            })
            openBottomSheet()
        }
        else if (trivia.playerStatus === "PLAYED" || trivia.status === "EXPIRED" || trivia.status === "CLOSED") {
            await analytics().logEvent('clicked_live_trivia_leaderboard', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            })
            navigation.navigate('LiveTriviaLeaderboard', { triviaId: trivia.id, prizePool: trivia.prizePool, prizeType: trivia.prizeType })

        }
        else if (trivia.playerStatus === "CANPLAY" && trivia.status !== "EXPIRED") {
            await analytics().logEvent('clicked_play_live_trivia', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            });
            {
                trivia.isFreeLiveTrivia === false && trivia.entryFreePaid === false &&

                    Alert.alert(
                        "Payment Notification",
                        `An amount of ${trivia.entryFee} naira would be deducted from your wallet balance as entry fee for this live trivia  `,
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "Proceed", onPress: () => payForOngoingLiveTrivia() }
                        ]
                    );
            }
            {
                trivia.isFreeLiveTrivia === false && trivia.entryFreePaid === true &&
                    navigation.navigate('TriviaInstructions', { ...trivia })
            }
            {
                trivia.isFreeLiveTrivia === true && 
                    navigation.navigate('TriviaInstructions', { ...trivia })
            }
        }
    }

    useEffect(() => {
        // Change the state every second or the time given by User.
        const interval = setInterval(() => {
            setShowText((showText) => !showText);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (initialLoading)
                return;
            
            // logic to confirm if status isn't part of constraint
            const _statusDisplayText = trivia.statusDisplayText;
            const _constraint = ["EXPIRED", "CLOSED"];
            if(!(_constraint.includes(_statusDisplayText)))
                dispatch(getLiveTriviaStatus())
            

        }, [initialLoading])
    );

    if (!trivia) {
        return null;
    }

    return (
        <Animated.View>
            <ImageBackground
                source={require('../../../assets/images/live-trivia-card-background-blue.png')}
                imageStyle={{ borderRadius: 20 }}
                style={styles.triviaBackground}
                resizeMode='cover'>
                {trivia.playerStatus === "INSUFFICIENTPOINTS" &&
                    <UniversalBottomSheet
                        refBottomSheet={notEnoughPointNotice}
                        height={350}
                        subComponent={<LiveTriviaEntryFailedText
                            onClose={() => notEnoughPointNotice.current.close()}
                            pointsRequired={trivia.pointsRequired}
                            userPoints={user.todaysPoints}
                        />}
                    />
                }
                {trivia.entryFee > user.walletBalance &&
                    <UniversalBottomSheet
                        refBottomSheet={notEnoughPointNotice}
                        height={620}
                        subComponent={
                            <LowWalletBalance
                                onClose={closeBottomSheet}
                                errorDescription="You do not have enough balance to play this live trivia"
                            />}
                    />
                }
                <View style={styles.triviaContainer}>
                    <View style={styles.triviaTop}>
                        <View style={styles.triviaLeft}>
                            <Text style={styles.triviaTopText}>{trivia.title}</Text>
                            <Text style={styles.triviaTitle}>{ trivia?.description || trivia.prizeDisplayText}</Text>
                            {trivia.status === "EXPIRED" ?
                                <Text style={styles.triviaAdText}>{trivia.startAt}</Text>
                                :
                                <Text style={styles.triviaAdText}>{trivia.startDateDisplayText}</Text>
                            }

                        </View>
                        <View style={styles.triviaRight}>
                            <View style={styles.triviaRequiredContainer}>
                                {trivia.isFreeLiveTrivia === false && trivia.entryFee !== 0 &&
                                    <>
                                        <Text style={styles.triviaRequiredText}>Entry Fee</Text>
                                        <Text style={styles.triviaRequiredText}>&#8358;{formatCurrency(trivia.entryFee)}</Text>
                                    </>
                                }
                                {trivia.pointsRequired !== 0 &&
                                    <>
                                        <Text style={styles.triviaRequiredText}>{trivia.pointsRequired} pts</Text>
                                        <Text style={styles.triviaRequiredText}>Required</Text>
                                    </>
                                }
                                {trivia.pointsRequired === 0 && trivia.entryFee === 0 &&
                                    <>
                                        <Text style={styles.triviaRequiredText}>FREE</Text>
                                    </>
                                }


                            </View>
                        </View>
                    </View>
                    <View style={styles.triviaBottom}>
                        <View>
                            <View style={styles.triviaTimeCountdown}>
                                <TriviaStatus trivia={trivia} />
                            </View>
                            <Image
                                source={require('../../../assets/images/yellow-line-bottom.png')}
                            />
                        </View>
                        <TriviaAction trivia={trivia} action={triviaActionButtonClicked} />
                        {trivia.isFreeLiveTrivia === false && trivia.status === 'WAITING' &&
                            <>
                                {trivia.entryFreePaid === true &&
                                    <View style={styles.eligibleButton}>
                                        <Text style={styles.eligibleText}>Paid</Text>
                                        <Ionicons name="checkmark-circle-outline" size={20} color="#FFD064" />
                                    </View>
                                }
                                {trivia.status === "WAITING" && trivia.entryFreePaid === false &&
                                    <Pressable style={styles.ineligibleButton} onPress={TriviaEntryFeePaymentConfirmation}>
                                        {loading ?
                                            <ActivityIndicator size="small" color="#4F4949" /> :
                                            <Text Text style={styles.triviaButtonText}>Pay Now</Text>
                                        }
                                    </Pressable>
                                }
                            </>
                        }
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
        <Pressable style={styles.triviaButton} onPress={action} >
            <Text style={styles.triviaButtonText}>{actionDisplayText}</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#4F4949" />
        </Pressable>
    )
}

const styles = EStyleSheet.create({
    triviaBackground: {
    },
    triviaContainer: {
        paddingVertical: '1.1rem',
        paddingHorizontal: '1rem',
        flexDirection: 'column',
    },
    triviaTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    triviaBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    triviaLeft: {

    },
    triviaRequiredContainer: {

    },
    triviaTopText: {
        fontSize: '.85rem',
        lineHeight: '1rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-medium',
        width: responsiveScreenWidth(45)
    },
    triviaRequiredText: {
        fontSize: '.8rem',
        lineHeight: '.95rem',
        color: '#FFD064',
        opacity: 0.8,
        fontFamily: 'graphik-bold',
    },
    triviaTitle: {
        fontSize: '1.7rem',
        color: '#FFFF',
        lineHeight: '2.1rem',
        fontFamily: 'graphik-medium',
        marginVertical: responsiveScreenWidth(1)
    },
    triviaAdText: {
        fontSize: '.85rem',
        color: '#FFFF',
        opacity: 0.8,
        fontFamily: 'graphik-medium',
        marginBottom: normalize(35)
    },
    triviaRight: {
        flexDirection: 'column',
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
        fontSize: '0.75rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        lineHeight: '0.7rem'
    },
    eligibleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.2rem',
    },
    ineligibleButton: {
        flexDirection: 'row',
        backgroundColor: '#FFD064',
        borderRadius: 12,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(7),
        borderColor: '#C39938',
        alignItems: 'center',
        marginTop: '.5rem',
        justifyContent: 'center'
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
        marginRight: '.2rem'
    },
    eligibleText: {
        fontSize: '.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginRight: '.2rem'
    },
    notEligibleText: {
        fontSize: '.7rem',
        lineHeight: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        marginTop: '.5rem',
        width: '14rem'

    }
});

export default LiveTriviaCard;