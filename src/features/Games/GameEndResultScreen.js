import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, Alert, BackHandler } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import { NoGames } from './GameScreen';
import { getUser } from '../Auth/AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { incrementCountdownResetIndex, startGame, resetGameStats } from './GameSlice';
import EStyleSheet from 'react-native-extended-stylesheet';


export default function GameEndResultScreen({ navigation }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const pointsGained = useSelector(state => state.game.pointsGained);

    useEffect(() => {
        dispatch(getUser());
    }, []);



    return (

        <ScrollView style={styles.container}>
            <UserResultEmoji userEmoji={require('../../../assets/images/thumbs_up.png')} />
            <Username userName={user.firstName} />
            <UserResultInfo pointsGained={pointsGained} />
            <SeeRank />
            <FinalScore pointsGained={pointsGained} />
            <GameButtons />
        </ScrollView>

    );
}

const UserResultEmoji = ({ userEmoji }) => {
    return (
        <View style={styles.emojiContainer}>
            <Image
                style={styles.emoji}
                source={userEmoji}
            />
        </View>
    )
}

const Username = ({ userName }) => {
    return (
        <View style={styles.nameContainer}>
            <Text style={styles.name}>{userName}</Text>
        </View>
    )
}

const UserResultInfo = ({ pointsGained }) => {
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.info}>you scored {pointsGained} points, Play again to climb up the leaderboard</Text>
        </View>
    )
}

const SeeRank = () => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.navigate('Leaderboard')}
            style={styles.goToLeaderboard}
        >
            <View style={styles.seeRank}>
                <Image
                    source={require('../../../assets/images/leaderboard.png')}
                />
                <Text style={styles.seeRankText}>Check the leaderboard to see your rank</Text>
            </View>
        </Pressable>

    )
}

const FinalScore = ({ pointsGained }) => {
    return (
        <View style={styles.finalScore}>
            <Text style={styles.finalScoreText}>Your final score point is</Text>
            <Text style={styles.point}>{pointsGained}</Text>
        </View>
    )
}

const GameButton = ({ buttonText, onPress, disabled }) => {
    return (
        <Pressable onPress={onPress} style={[styles.gameButton, disabled ? styles.gameButtonDisabled : {}]} >
            <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
    )
}

const GameButtons = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const gameTypeId = useSelector(state => state.game.gameType.id);
    const gameModeId = useSelector(state => state.game.gameMode.id);
    const hasActivePlan = useSelector(state => state.auth.user.hasActivePlan);
    const isGameEnded = useSelector(state => state.game.isEnded);
    const [loading, setLoading] = useState(false);
    const refRBSheet = useRef();

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }

    const onPlayButtonClick = () => {
        setLoading(true);

        if (hasActivePlan) {
            dispatch(startGame({
                category: gameCategoryId,
                type: gameTypeId,
                mode: gameModeId
            }))
                .then(unwrapResult)
                .then(result => {
                    setLoading(false);
                    dispatch(resetGameStats());
                    dispatch(incrementCountdownResetIndex());
                    navigation.navigate("GameInProgress")
                })
                .catch(() => {
                    Alert.alert('failed to restart game')
                    dispatch(resetGameStats());
                    setLoading(false);
                });
        } else {
            setLoading(false);
            dispatch(resetGameStats());
            openBottomSheet();
        }
    }

    const onHomeButtonClick = () => {
        dispatch(resetGameStats());
        navigation.navigate('Home')
    }

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (isGameEnded) {
                    return true;
                } else {
                    return false;
                }
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [isGameEnded])
    );


    return (
        <View style={styles.gameButtons}>
            <GameButton buttonText='Return to Home'
                onPress={onHomeButtonClick}
            />
            <GameButton buttonText={loading ? 'loading...' : 'Play Again'}
                onPress={onPlayButtonClick}
                disabled={loading}
            />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={400}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    draggableIcon: {
                        backgroundColor: "#000",
                    },
                    container: {
                        borderTopStartRadius: 25,
                        borderTopEndRadius: 25,
                    }
                }}
            >
                <NoGames closeSheet={closeBottomSheet} />
            </RBSheet>

        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(18),
        display: 'flex',
    },
    image: {
        flex: 1,
    },
    emojiContainer: {
        alignItems: 'center',
        marginBottom: normalize(18)
    },
    emoji: {
        width: normalize(66),
        height: normalize(70)
    },
    nameContainer: {
        alignItems: 'center',
        marginBottom: normalize(15)
    },
    name: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '2.3rem',
    },
    infoContainer: {
        alignItems: 'center',
        textAlign: 'center',
        marginHorizontal: normalize(25),
        marginBottom: responsiveScreenWidth(15)
    },
    info: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        fontSize: '1rem',
        lineHeight: '1.5rem'
    },
    seeRank: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    seeRankText: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
    },
    goToLeaderboard: {
        backgroundColor: '#701F88',
        borderRadius: 8,
        padding: normalize(15),
        marginBottom: normalize(15)
    },
    finalScore: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9E821',
        padding: normalize(10),
        borderRadius: 16,
        marginBottom: responsiveScreenWidth(27)
    },
    finalScoreText: {
        color: '#9236AD',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
    },
    point: {
        color: '#9236AD',
        fontFamily: 'graphik-bold',
        fontSize: '4rem',
    },
    gameButton: {
        borderColor: '#FFFF',
        borderWidth: 1,
        width: responsiveScreenWidth(35),
        height: responsiveScreenHeight(6.5),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    gameButtonDisabled: {
        backgroundColor: '#DFCBCF'
    },
    gameButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(50)
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.72rem',
    }

});
