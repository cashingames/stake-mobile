import React, { useEffect } from 'react'
import { Text, View, Image, ScrollView, Pressable, Alert, BackHandler } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { formatNumber } from '../../utils/stringUtl';
import { getTriviaData } from '../Games/GameSlice';
import { getCommonData } from '../CommonSlice';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';



const TriviaLeaderBoard = ({ navigation, route }) => {
    const params = route.params;
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const triviaLeaders = useSelector(state => state.game.triviaLeaders)
    const triviaPosition = useSelector(state => state.game.triviaPosition)


    useEffect(() => {
        dispatch(getCommonData())
        dispatch(getTriviaData(
            params.triviaId
        ))
            .then(unwrapResult)
            .then((originalPromiseResult) => {
                console.log('fetched')
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError)
            })
    }, []);





    return (
        <ScrollView style={styles.container}>
            <ResultContainer triviaPosition={triviaPosition} />
            <TriviaParticipants triviaLeaders={triviaLeaders} />
        </ScrollView>
    )
}

const ResultContainer = ({ triviaPosition }) => {
    // const hasLiveTrivia = useSelector(state => state.common.hasLiveTrivia)
    // console.log(hasLiveTrivia);
    return (
        <View style={styles.resultContainer}>
            <Image
                style={styles.icon}
                source={require('../../../assets/images/trivia-cup.png')}
            />
            {/* <Text style={styles.positionText}>Your current position is {triviaPosition}</Text> */}
        </View>
    )
}

const TriviaParticipant = ({ player, position }) => {
    return (
        <View style={styles.participant}>
            <View style={styles.positionName}>
                <Text style={styles.position}>{position}</Text>
                <Text style={styles.username}>{player.first_name} {player.last_name}</Text>
            </View>
            <Text style={styles.username}>{player.points}pts</Text>
        </View>
    )
}

const TriviaParticipants = ({ triviaLeaders }) => {
    return (
        <>
            {triviaLeaders.length > 0 ?
                <View style={styles.participants}>{triviaLeaders.map((player, i) => <TriviaParticipant key={i} player={player} position={formatNumber(i + 1)} />)}</View>
                :
                <>
                    <Text style={styles.noData}>No Data</Text>
                </>
            }

        </>
    )
}





export default TriviaLeaderBoard;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        // paddingTop: responsiveScreenWidth(20),
    },
    resultContainer: {
        alignItems: 'center',
        paddingTop: responsiveScreenWidth(15),
    },
    icon: {
        width: normalize(125),
        height: normalize(115)
    },
    positionText: {
        fontSize: '1.1rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginVertical: responsiveScreenWidth(10)
    },
    resultMessage: {
        fontSize: '0.95rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        textAlign: 'center',
        opacity: 0.7,
        lineHeight: '1.5rem',
        paddingHorizontal: normalize(18),
    },
    userResult: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(20),
        marginTop: responsiveScreenWidth(10)
    },
    answerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(8),
        alignItems: 'center'
    },
    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    resultText: {
        fontSize: '0.8rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        opacity: 0.7,
    },
    resultResponse: {
        fontSize: '0.8rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    participants: {
        paddingHorizontal: normalize(20)
    },
    participant: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(25)
    },
    positionName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeSpent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: normalize(15)
    },
    questionAnswered: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    texts: {
        fontSize: '0.75rem',
        color: '#000000',
        fontFamily: 'graphik-regular',
        opacity: 0.7,
        marginLeft: normalize(5)
    },
    position: {
        fontSize: '0.75rem',
        color: '#7C7D7F',
        fontFamily: 'graphik-medium',
    },
    username: {
        fontSize: '0.75rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(10)
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: normalize(18),
        justifyContent: 'space-between',
        marginVertical: normalize(30)
    },
    triviaButton: {
        marginHorizontal: normalize(20)
    },
    homeText: {
        fontSize: '0.8rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
    },
    gameButton: {
        borderWidth: 1,
        borderColor: '#EF2F55',
        borderRadius: normalize(5),
        padding: normalize(15),
        backgroundColor: '#EF2F55',
    },
    gameText: {
        fontSize: '0.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    noData: {
        textAlign: 'center',
        marginTop: responsiveScreenWidth(30),
        fontSize: '1rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    }
});