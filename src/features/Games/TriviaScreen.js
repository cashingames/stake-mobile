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
            <View>
                <TriviaHeaderTitle />
                <TriviaBoards trivia={trivia} />
            </View>
        </ScrollView>
    )
}

const TriviaHeaderTitle = () => {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.title}>
                Available Trivia
            </Text>
        </View>
    )
}

// const TriviaParticipant = ({ participant }) => {
//     return (
//         <>
//             <Text>{participant.image}</Text>
//         </>
//     )
// }

// const TriviaParticipants = () => {
//     return (
//         <>
//             <Text></Text>
//         </>
//     )
// }
const TriviaBoards = ({ trivia }) => {
    return (
        <>
            {trivia.map((trivia, i) => <TriviaBoard key={i} trivia={trivia} />)}
        </>
    )
}

const TriviaBoard = ({ trivia }) => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user)
    const canPlay = (user.points) >= (trivia.point_eligibility);

    return (
        <>{!canPlay &&
            <Text style={styles.notEnoughPoints}>Sorry, your point balance of {user.points} is not enough to play this trivia,
                increase your point and try again
            </Text>
        }
            <View style={styles.boardContainer}>
                <View style={styles.boardheader}>
                    <Text style={styles.competitionName}>{trivia.name}</Text>
                    <Pressable style={[styles.triviaStageContainer, !canPlay ? styles.disabled : {}]}
                        onPress={() => navigation.navigate('TriviaInstructions', {
                            type: trivia.game_type_id,
                            mode: trivia.game_mode_id,
                            category:trivia.category_id,
                            trivia:trivia.id,
                            questionCount: trivia.question_count,
                            gameDuration: trivia.game_duration
                          })} disabled={!canPlay}>
                        <Text style={styles.triviaStage}>Join Live Trivia</Text>
                    </Pressable>
                </View>
                <View style={styles.prizeContainer}>
                    <Text style={styles.prizeHeader}>Grand Prize</Text>
                    <Text style={styles.prize}>&#8358;{formatCurrency(trivia.grand_price)}</Text>
                </View>
                <View style={styles.pointContainer}>
                    <Image
                        style={styles.icon}
                        source={require('../../../assets/images/points-coin.png')}
                    />
                    <Text style={styles.points}>{trivia.point_eligibility}pts required</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.dateSubContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/calendar.png')}
                        />
                        <Text style={styles.dates}>End: {trivia.start_time}</Text>
                    </View>
                    <View style={styles.dateSubContainer}>
                        <Image
                            style={styles.icon}
                            source={require('../../../assets/images/calendar.png')}
                        />
                        <Text style={styles.dates}>Start: {trivia.end_time}</Text>
                    </View>
                </View>
                {/* <TriviaParticipants /> */}
            </View>
        </>
    )
}

export default TriviaScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
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
        borderRadius: normalize(10),
        borderColor: '#E5E5E5',
        borderWidth: 1,
        marginVertical: normalize(10),
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(18)
    },
    boardheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(5),
    },
    disabled: {
        backgroundColor: '#000000',
        opacity: 0.45
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
        fontSize: '0.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center'
    },
    triviaStageContainer: {
        backgroundColor: '#2D9CDB',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(10),
        borderRadius: 15,
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
        width: normalize(11),
        height: normalize(11)
    },
    dateSubContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    dates: {
        fontSize: '0.7rem',
        color: '#271212',
        fontFamily: 'graphik-regular',
        marginLeft: normalize(5),
        opacity: 0.6
    },
    notEnoughPoints: {
        color: '#151C2F',
        fontSize: Platform.OS === 'ios' ? '0.9rem' : '0.8rem',
        fontFamily: 'graphik-regular',
        lineHeight: responsiveScreenHeight(3),
        opacity: 0.7,
    }
});