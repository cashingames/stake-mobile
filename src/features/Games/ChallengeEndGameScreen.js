import React, { useRef, useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, Alert, BackHandler } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { resetGameStats } from './GameSlice';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from "../../shared/LottieAnimations";
import AppButton from '../../shared/AppButton';

export default function ChallengeEndGameScreen({ navigation }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const pointsGained = useSelector(state => state.game.pointsGained);
    const isGameEnded = useSelector(state => state.game.isEnded);
    const [loading, setLoading] = useState(false);



    const onHomeButtonClick = () => {
        dispatch(resetGameStats());
        navigation.navigate('AppRouter')
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

    useEffect(() => {
        dispatch(getUser());
    }, []);



    return (

        <ScrollView style={styles.container}>
            <UserResultEmoji />
            <Username userName={user.firstName} />
            <UserResultInfo pointsGained={pointsGained} />
            <SeeRank />
            <FinalScore pointsGained={pointsGained} />
            <AppButton text='Return to Home'
            style={styles.gameButton}
                onPress={onHomeButtonClick} />

        </ScrollView>

    );
}


const UserResultEmoji = () => {
    return (
        <View style={styles.emojiContainer}>
            <LottieAnimations
                animationView={require('../../../assets/game-over.json')}
                width={normalize(120)}
                height={normalize(120)}
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
            <Text style={styles.info}>you scored {pointsGained}, go to the challenge leaderboard
                to view the status and result of this challenge
            </Text>
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
                <Text style={styles.seeRankText}>Click to see status and result of this challenge</Text>
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
    },
    emoji: {
        width: normalize(66),
        height: normalize(70)
    },
    nameContainer: {
        alignItems: 'center',
        marginBottom: normalize(10)
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
        marginBottom: responsiveScreenWidth(10)
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
        borderRadius: 16,
        marginBottom: responsiveScreenWidth(23),
        padding: Platform.OS === 'ios' ? normalize(15) : normalize(10),
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
      marginVertical:normalize(1)
    },


});
