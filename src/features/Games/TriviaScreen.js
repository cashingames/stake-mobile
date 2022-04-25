import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, ScrollView, Image, Pressable } from 'react-native';
import normalize, { responsiveScreenHeight } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
import { useNavigation } from '@react-navigation/core';
import { fetchTrivia } from '../CommonSlice';



const TriviaScreen = () => {
    const dispatch = useDispatch();
    const trivia = useSelector(state => state.common.trivia)
    console.log(trivia)
    useEffect(() => {
        dispatch(fetchTrivia());
    }, []);
    return (
        <ScrollView style={styles.container}>
            <TriviaBoards trivia={trivia} />
        </ScrollView>
    )
}


const TriviaBoards = ({ trivia }) => {
    return (
        <View style={styles.boards}>
            {trivia.map((trivia, i) => <TriviaBoard key={i} trivia={trivia} />)}
        </View>
    )
}

const TriviaBoard = ({ trivia }) => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user)
    const canPlay = (user.points) >= (trivia.point_eligibility);


    return (
        <View style={styles.mainContainer}>
            <View style={styles.boardContainer}>
                <View style={styles.boardheader}>
                    <Text style={styles.competitionName}>{trivia.name}</Text>
                    <TriviaLeaderBoard trivia={trivia} />
                </View>
                <View style={styles.prizeContainer}>
                    <Text style={styles.prizeHeader}>Grand Prize</Text>
                    <Text style={styles.prize}>&#8358;{formatCurrency(trivia.grand_price)}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.pointContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/points-coin.png')}
                        />
                        <Text style={styles.dates}>{trivia.point_eligibility}pts required</Text>
                    </View>
                    <View style={styles.dateSubContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/calendar.png')}
                        />
                        <Text style={styles.dates}>{trivia.start_time}</Text>
                    </View>
                </View>
            </View>
            {canPlay ?
                <Pressable style={[trivia.is_active ? styles.triviaStageContainer : styles.disabled,
                     !canPlay ? styles.disabled : {}, trivia.has_played ? styles.disabled : {}]}
                    onPress={() => navigation.navigate('TriviaInstructions', {
                        type: trivia.game_type_id,
                        mode: trivia.game_mode_id,
                        category: trivia.category_id,
                        trivia: trivia.id,
                        questionCount: trivia.question_count,
                        gameDuration: trivia.game_duration
                    })} disabled={!canPlay || trivia.has_played || !trivia.is_active}>
                    {trivia.is_active && !trivia.has_played ?
                        <Text style={styles.triviaStage}>Join Now</Text>
                        :
                        <Text style={styles.triviaClosed}>Closed</Text>
                    }
                </Pressable>
                :
                <View style={styles.disabled}>
                    {trivia.is_active ?
                        <Text style={styles.triviaClosed}>Earn {trivia.point_eligibility - user.points} more points to join this live trivia</Text>
                        :
                        <Text style={styles.triviaClosed}>Closed</Text>
                    }
                </View>
            }

        </View>
    )
}

const TriviaLeaderBoard = ({ trivia }) => {
    const navigation = useNavigation();
    return (
        <>
            <Pressable style={styles.leaderboardContainer} onPress={() => navigation.navigate('TriviaLeaderboard', { triviaId: trivia.id })}>
                <Text style={styles.leaderboardLink}>Leaderboard</Text>
            </Pressable>
        </>
    )
}

export default TriviaScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(18),
    },
    titleContainer: {
        marginVertical: normalize(20),
    },
    title: {
        fontSize: '1.2rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    },
    boardContainer: {
        borderTopRightRadius: normalize(10),
        borderTopLeftRadius: normalize(10),
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(18),
        backgroundColor: '#FFFF',
    },
    mainContainer: {
        marginVertical: normalize(10),
    },
    boardheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(5),
    },
    disabled: {
        backgroundColor: '#2D9CDB',
        paddingVertical: normalize(5),
        // borderRadius: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: normalize(15),
        borderTopWidth: 0,
    },
    competitionName: {
        fontSize: '0.8rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    },
    competitionStage: {
        fontSize: '0.6rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    },
    triviaStage: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    triviaClosed: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    triviaStageContainer: {
        backgroundColor: '#EF2F55',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(10),
        // borderRadius: 15,
        alignItems: 'center'
    },
    stageContainer: {
        backgroundColor: '#3BEB9C',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(10),
        borderRadius: 15,
        alignItems: 'center'
    },
    prizeHeader: {
        fontSize: '0.65rem',
        color: '#685959',
        fontFamily: 'graphik-medium',
        opacity: 0.6,
        marginBottom: normalize(5)
    },
    prize: {
        fontSize: '0.8rem',
        color: '#271212',
        fontFamily: 'graphik-medium',
    },
    prizeContainer: {
        marginBottom: normalize(10)
    },
    pointContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: normalize(8),
        alignItems: 'center'
    },
    points: {
        fontSize: '0.7rem',
        color: '#271212',
        fontFamily: 'graphik-regular',
        marginLeft: normalize(5),
        opacity: 0.6
    },
    icon: {
        width: normalize(9),
        height: normalize(9)
    },
    dateSubContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dates: {
        fontSize: '0.7rem',
        color: '#271212',
        fontFamily: 'graphik-regular',
        marginLeft: normalize(8),
        opacity: 0.6
    },
    notEnoughPoints: {
        color: '#151C2F',
        fontSize: Platform.OS === 'ios' ? '0.9rem' : '0.8rem',
        fontFamily: 'graphik-regular',
        lineHeight: responsiveScreenHeight(3),
        opacity: 0.7,
    },
    expired: {
        color: '#EF2F55',
        fontSize: Platform.OS === 'ios' ? '0.7rem' : '0.6rem',
        fontFamily: 'graphik-regular',
        lineHeight: responsiveScreenHeight(3),
        opacity: 0.7,
    },
    leaderboardLink: {
        color: '#FFFF',
        fontSize: Platform.OS === 'ios' ? '0.65rem' : '0.6rem',
        fontFamily: 'graphik-medium',
        lineHeight: responsiveScreenHeight(3),
        opacity: 0.7,
        textAlign: 'center'
    },
    leaderboardContainer: {
        backgroundColor: '#808080',
        borderRadius: 18,
        paddingHorizontal: Platform.OS === 'ios' ? normalize(9) : normalize(10),
        alignItems: 'center',
        paddingVertical: Platform.OS === 'ios' ? normalize(.1) : normalize(3),
    }
});