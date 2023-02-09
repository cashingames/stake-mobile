import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector, useDispatch } from 'react-redux';
import PageLoading from '../../shared/PageLoading';
import { getLiveTriviaLeaders } from '../Games/GameSlice';
import { formatNumber, isTrue } from '../../utils/stringUtl';
import { Ionicons } from '@expo/vector-icons';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
// import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { Walkthroughable } from '../Tour/Walkthrouable';

const LiveTriviaLeaderBoard = (props) => {
    // const CopilotProps = props;
    const { navigation, route } = props
    useApplyHeaderWorkaround(navigation.setOptions);
    const params = route.params;
    const dispatch = useDispatch();

    const triviaLeaders = useSelector(state => state.game.triviaLeaders)
    // console.log(triviaLeaders);
    const [loading, setLoading] = useState(true)

    const [refreshing, setRefreshing] = useState(false);
    const isTourActive = useSelector(state => state.tourSlice.isTourActive);


    useEffect(() => {
        StatusBar.setTranslucent(true)
        StatusBar.setBackgroundColor("transparent")
    }, []);


    useEffect(() => {
        dispatch(getLiveTriviaLeaders(
            params.triviaId
        )).then(() => setLoading(false));
    }, [])

    // tour
    // useEffect(()=>{
    //     setTimeout(()=>{
    //         if((isTourActive?.payload || isTourActive) && (!loading) ){
    //             // tourStart(7)
    //             // setForceRender(!forceRender);
    //             // console.log(canStart, 7)
                
    //             console.log('reach11')
    //             CopilotProps.start()
    //             CopilotProps.copilotEvents.on('stop', handleTourStop)

    //             // eventEmitter.on('stop', handleTourStop)
    
    //             return () => {
    //                 // eventEmitter.off('stop', handleTourStop)
    //                 CopilotProps.copilotEvents.off('stop', handleTourStop)
    //             }
    //         }else{
    //             // console.log(AppTourStep)
    //             // AppTour.start();
    //             // AppTour.stop();
    //         }
    //     }, 1000)
    // }, [isTourActive, loading])

    // const handleTourStop = ()=>{
    //     console.log("tour stopped, going to next screen to continue....")
    //     navigation.navigate("Invite")
    // }



    if (loading) {
        return <PageLoading backgroundColor='#072169' spinnerColor="#FFFF" />
    }

    return (
        <ScrollView style={styles.container}>
            {/* <CopilotStep text={
                <View>
                    <Text style={styles.tourTitle} >Prize Pool</Text>
                    <Text>Win cash prizes when you appear as the top three on the weekly leaderboard</Text>
                </View>
            } order={1} name={`LeaderBoard1`}>
                <Walkthroughable> */}
                    <ResultContainer />
                    <LiveTriviaPrizes prizePool={props.route.params.prizePool} />
                {/* </Walkthroughable>
            </CopilotStep> */}
            {/* <TriviaTopLeaders /> */}
            <TriviaParticipants triviaLeaders={triviaLeaders} />
        </ScrollView>
    )
}

const ResultContainer = () => {
    return (
        <View style={styles.resultContainer}>
            <LottieAnimations
                animationView={require('../../../assets/leaderboard.json')}
                width={normalize(170)}
                height={normalize(170)}
            />
        </View>
    )
}

const LiveTriviaPrizes = ({prizePool = []})=>{
    
    let prizeData = [];

    // check if all prize type is null
    const _isNUll = prizePool.every(_val => (_val.prizeType == null));
    if(_isNUll){
        return null;
    }

    // TODO
    // * optimize sort algorithm
    // sort pool
    for(let i = 1 ; i < prizePool.length ; i++){
        for(let j = i ; j > 0 ; j--){
            let l1 = prizePool[j];
            let l2 = prizePool[j - 1];
            if(l2.rankFrom < l1.rankFrom){
                prizePool[j] = l2;
                prizePool[j - 1] = l1;
            }
        }
    }

    // extract text into new pool
    for(let i = 0 ; i < prizePool.length ; i++){
        let element = prizePool[i];
        let text = (element.rankFrom == element.rankTo) ? element.rankFrom: `${element.rankFrom} - ${element.rankTo}` ;
        let prize = "N";
        switch (element.prizeType) {
            case "MONEY_TO_BANK":
                prize = "N"
                prize = `${prize} ${formatNumber(element.eachPrize)}`;
                break;

            case "MONEY_TO_WALLET":
                prize = "N"
                prize = `${prize} ${formatNumber(element.eachPrize)}`;
                break;

            case "PHYSICAL_ITEM":
                prize = "its"
                prize = `${(element.eachPrize)}`;
                break;

            case "POINTS":
                prize = "pts"
                prize = `${(element.eachPrize)}`;
                break;
        
            default:
                break;
        }

        prizeData.push({
            prize,
            text
        })
    }
        

    if(prizePool == undefined){
        return null;
    }
    if((prizeData || []).length == 0){
        return null;
    }
    
    return (
        <View style={styles.triviaTopLeadersContainer}>
            
            <View style={[styles.triviaTopLeadersRow, { marginVertical: 8 }]}>
                <Text style={styles.triviaTopLeadersH1}>Grand Prize</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.triviaTopLeadersH1}>{prizeData[0].prize}</Text>
                    <Image source={require("../../../assets/images/icons/trophy.png")} style={styles.triviaTopLeadersTrophy} />
                </View>
            </View>

            {
                ((prizeData || []).map((item, index)=>{

                    if(index == 0) return <></>;

                    return (
                        <View style={styles.triviaTopLeadersRow}>
                            <Text style={styles.triviaTopLeadersH2}>{
                                (item.text == 2) ? "2nd" : ( (item.text == 3) ? "3rd" : `${item.text}th` )
                            } Place</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.triviaTopLeadersH2}>{item?.prize || ""}</Text>
                                <Image source={require("../../../assets/images/icons/conqueror.png")} style={styles.triviaTopLeadersCon} />
                            </View>
                        </View>
                    )
                }))
            }
            
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
                <Image
                    style={styles.otherPlayerIcon}
                    source={isTrue(player.avatar) ? { uri: player.avatar } : require("../../../assets/images/user-icon.png")}
                />
                <View style={styles.positionName}>
                    <Text style={styles.username}>{player.username}</Text>
                    <View style={styles.playerDuration}>
                        <Ionicons name="alarm" size={18} color="#000000" />
                        <Text style={styles.username}>{player.duration}secs</Text>
                    </View>
                </View>
            </View>
            <View style={styles.pointsContainer}>
                <Text style={styles.points}>{player.points}pts</Text>
                <Image
                    style={styles.pointsIcon}
                    source={require('../../../assets/images/points-coin.png')}
                />
            </View>
            <View style={styles.topRank}>
                <View style={styles.topRankBottom}>
                    <Image
                        style={styles.participantRibbon}
                        source={require('../../../assets/images/gold-ribbon.png')}
                    />
                    <Text style={styles.participantPosition}>{position}</Text>
                </View>
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
                    // source={isTrue(player.avatar) ? player.avatar : require("../../../assets/images/user-icon.png")}
                    source={isTrue(player.avatar) ? { uri: player.avatar } : require("../../../assets/images/user-icon.png")}

                />
                <View style={styles.positionName}>
                    <Text style={[styles.topParticipantusername, { color: fontColor }]}>{player.username}</Text>
                    <View style={styles.playerDuration}>
                        <Ionicons name="alarm" size={18} color={fontColor} />
                        <Text style={[styles.topParticipantusername, { color: fontColor }]}>{player.duration}secs</Text>
                    </View>
                </View>
            </View>
            <View style={styles.pointsContainer}>
                <Text style={[styles.topParticipantpoints, { color: fontColor }]}>{player.points}pts</Text>
                <Image
                    style={styles.pointsIcon}
                    source={require('../../../assets/images/points-coin.png')}
                />
            </View>

            <View style={styles.topRank}>
                {/* {position === 1 &&
                    <LottieAnimations
                    animationView={require('../../../assets/winner.json')}
                    width= {normalize(60)}
                    height= {normalize(60)}
                     />
                } */}

                <View style={styles.topRankBottom}>
                    <Image
                        style={styles.championsTrophy}
                        source={trophyImageUrl}
                    />
                    <Text style={styles.position}>{position}</Text>
                </View>
            </View>

        </View>
    )
}

// export default copilot({
//     animated: true,
//     overlay: 'svg',
//     labels: {
//         finish: 'Next'
//     }
// })(LiveTriviaLeaderBoard);
export default LiveTriviaLeaderBoard;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072169',
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
    otherPlayerIcon: {
        width: normalize(50),
        height: normalize(50),
        backgroundColor: '#072169',
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
    },
    topRank: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    topRankBottom: {
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
        color: '#2D9CDB',
        fontSize: '0.9rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
        marginRight: '.2rem'
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pointsIcon: {
        width: '.7rem',
        height: '.7rem',
        marginTop: '.25rem',
    },
    topParticipantusername: {
        fontSize: '0.75rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginRight: '.2rem'
    },
    topParticipantpoints: {
        fontSize: '0.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginRight: '.2rem'
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
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    triviaTopLeadersContainer: {
        backgroundColor: 'rgba(69, 30, 182, 1)',
        marginHorizontal: '5%',
        padding: 20,
        borderRadius: 15,
        marginVertical: '3%'
    },
    triviaTopLeadersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3
    },
    triviaTopLeadersH1: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700'
    },
    triviaTopLeadersH2: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500'
    },
    triviaTopLeadersTrophy: {
        width: 35,
        height: 35,
    },
    triviaTopLeadersCon: {
        width: 20,
        height: 20,
        marginLeft: 16
    },
    tourTitle: {
        color: '#EF2F55',
        fontWeight: '600',
        fontSize: 22,
        marginBottom: 10
    }
});