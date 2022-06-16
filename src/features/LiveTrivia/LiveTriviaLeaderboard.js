import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, StatusBar } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector, useDispatch } from 'react-redux';
import PageLoading from '../../shared/PageLoading';
// import { formatNumber } from '../../utils/stringUtl';
import { getTriviaData } from '../Games/GameSlice';
import LiveTriviaWinner from './LiveTriviaWinner';
import { isTrue } from '../../utils/stringUtl';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';



const LiveTriviaLeaderBoard = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const params = route.params;
    const dispatch = useDispatch();

    const triviaLeaders = useSelector(state => state.game.triviaLeaders)
    console.log(triviaLeaders[0])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        dispatch(getTriviaData(
            params.triviaId
        )).then(() => setLoading(false));
    }, [])

    if (loading) {
        return <PageLoading />
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#072169" />
            <ScrollView style={styles.container}>
                <ResultContainer />
                {/* <TriviaTopLeaders /> */}
                <TriviaParticipants triviaLeaders={triviaLeaders} />
            </ScrollView>
        </>
    )
}

const ResultContainer = () => {
    return (
        <View style={styles.resultContainer}>
            <LiveTriviaWinner
                animationView={require('../../../assets/leaderboard.json')}
                width={normalize(170)}
                height={normalize(170)}
            />
        </View>
    )
}

const TriviaParticipants = ({ triviaLeaders }) => {
    return (
        <>
            {triviaLeaders.length > 0 ?
                <View style={styles.participants}>
                    {triviaLeaders.map((player, i) => {
                        if (i < 3)
                            return <TriviaTopLeader key={i} player={player} position={i + 1} />
                        else
                            return <TriviaParticipant key={i} player={player} position={i + 1} />
                    }
                    )}
                </View>
                :
                <>
                    <Text style={styles.noData}>No Data</Text>
                </>
            }

        </>
    )
}

const TriviaParticipant = ({ player, position }) => {
    return (
        <View style={styles.participant}>
            <View style={styles.participantLeft}>
                {/* <Text style={styles.position}>{position}</Text> */}
                <Image
                    style={styles.playerIcon}
                    source={isTrue(player.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${player.avatar}` } : require("../../../assets/images/user-icon.png")}

                />
                <View style={styles.positionName}>
                    <Text style={styles.username}>{player.username}</Text>
                    <View style={styles.playerDuration}>
                        <Text style={styles.username}>2:13</Text>
                        <Ionicons name="alarm" size={18} color="#000000" style={styles.bottomSheetIcon} />
                    </View>
                    <View style={styles.pointsContainer}>
                        <Text style={styles.username}>{player.points}pts</Text>
                        <Image
                            style={styles.pointsIcon}
                            source={require('../../../assets/images/points-coin.png')}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.topRank}>
                {/* <Ionicons name="thumbs-up-outline" size={20} color="#FFEE03" style={styles.bottomSheetIcon} /> */}
                <Image
                    style={styles.participantRibbon}
                    source={require('../../../assets/images/gold-ribbon.png')}
                />
                <Text style={styles.participantPosition}>{position}</Text>
            </View>
        </View>
    )
}

const TriviaTopLeader = ({ player, position }) => {

    let backgroundColor = "";
    let trophyImageUrl = {};
    let fontColor = "";

    if (position === 1) {
        backgroundColor = "#FFD700";
        trophyImageUrl = require('../../../assets/images/first-crown.png');
        fontColor = "#000000";
    }
    else if (position === 2) {
        backgroundColor = "#2D9CDB";
        trophyImageUrl = require('../../../assets/images/second-crown.png');
        fontColor = "#FFFF";
    }
    else if (position === 3) {
        backgroundColor = "#9C3DB8";
        trophyImageUrl = require('../../../assets/images/third-crown.png');
        fontColor = "#FFFF";
    }

    return (
        <View style={[styles.topParticipant, { backgroundColor: backgroundColor }]}>
            <View style={styles.participantLeft}>
                <Image
                    style={styles.playerIcon}
                    source={isTrue(player.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${player.avatar}` } : require("../../../assets/images/user-icon.png")}
                />
                <View style={styles.positionName}>
                    <Text style={[styles.topParticipantusername, { color: fontColor }]}>{player.username}</Text>
                    <View style={styles.playerDuration}>
                        <Text style={[styles.topParticipantusername, { color: fontColor }]}>2:13</Text>
                        <Ionicons name="alarm" size={18} color={fontColor} />
                    </View>
                    <View style={styles.pointsContainer}>
                        <Text style={[styles.topParticipantusername, { color: fontColor }]}>{player.points}pts</Text>
                        <Image
                            style={styles.pointsIcon}
                            source={require('../../../assets/images/points-coin.png')}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.topRank}>
                {/* {position === 1 &&
                    <LiveTriviaWinner 
                    animationView={require('../../../assets/winner.json')}
                    width= {normalize(60)}
                    height= {normalize(60)}
                     />
                } */}
                <Image
                    style={styles.championsTrophy}
                    source={trophyImageUrl}
                />
                <Text style={styles.position}>{position}</Text>
            </View>

        </View>
    )
}

export default LiveTriviaLeaderBoard;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072169',
        // paddingTop: responsiveScreenWidth(20),
    },
    resultContainer: {
        alignItems: 'center',
        marginTop: responsiveScreenWidth(3),
    },
    icon: {
        width: normalize(125),
        height: normalize(115)
    },
    playerIcon: {
        width: normalize(50),
        height: normalize(50),
        backgroundColor: '#FFFF',
        borderRadius: 15,
    },
    championsTrophy: {
        width: normalize(40),
        height: normalize(40),
    },
    participantRibbon: {
        width: normalize(25),
        height: normalize(35),
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
        paddingHorizontal: normalize(20),
        marginVertical: normalize(20)
    },
    topParticipant: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        paddingVertical: normalize(10),
        borderRadius: 10,
        paddingHorizontal: normalize(10),
        marginBottom: normalize(15)
    },
    participant: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        paddingVertical: normalize(10),
        borderRadius: 10,
        paddingHorizontal: normalize(10),
        marginBottom: normalize(15)
    },
    participantLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    positionName: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: normalize(10)
        // alignItems: 'center',
    },
    playerDuration: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: '#072169',
        paddingVertical: '0.1rem',
        paddingHorizontal: '0.3rem',
        borderRadius: 5,
        textAlign: 'center',
        marginLeft: '0.2rem',
        // marginTop: '.3rem'
    },
    participantPosition: {
        fontSize: '0.75rem',
        color: '#7C7D7F',
        fontFamily: 'graphik-medium',
        backgroundColor: '#072169',
        paddingVertical: '0.1rem',
        paddingHorizontal: '0.3rem',
        borderRadius: 5,
        textAlign: 'center',
        marginLeft: '0.6rem',
        // marginTop: '.3rem'
    },
    topRank: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: '0.75rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
        marginRight: '.2rem'
    },
    points: {
        fontSize: '0.75rem',
        color: '#2D9CDB',
        fontFamily: 'graphik-regular',
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pointsIcon: {
        width: '.5rem',
        height: '.5rem',
        marginTop: '.25rem',
    },
    topParticipantusername: {
        fontSize: '0.75rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginRight: '.2rem'
    },
    topParticipantpoints: {
        fontSize: '0.75rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
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