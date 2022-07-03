import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from 'react-redux';
import normalize from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import UserItems from '../../shared/UserItems';
import LottieAnimations from '../../shared/LottieAnimations';



export default function UserStatsScreen({ navigation }) {

    useApplyHeaderWorkaround(navigation.setOptions);

    const user = useSelector(state => state.auth.user)


    return (
        <ScrollView style={styles.container}>

            <UserRank userPoint={user.points} />
            <Detail
                username={user.username}
                firstName={user.firstName}
                lastName={user.lastName}
                gamesPlayed={user.gamesCount}
                globalRanking={user.globalRank}
                winRate={user.winRate}
                challengesPlayed={user.totalChallenges}
            />
            <UserItems showBuy={true} />
        </ScrollView>
    );
}

const UserRank = ({ userPoint }) => {
    return (
        <View style={styles.rank}>
            <View style={styles.rankPoints}>
                <Text style={styles.rankText}>All Time Best</Text>
                <Text style={styles.pointText}>{userPoint}points</Text>

            </View>
            <LottieAnimations
                animationView={require('../../../assets/userStats.json')}
                width={normalize(150)}
                height={normalize(150)}
            />
            {/* <Image
                source={require('../../../assets/images/trophy-cup.png')}
            /> */}
        </View>
    )
}

const Detail = ({
    username,
    firstName,
    lastName,
    gamesPlayed,
    globalRanking,
    winRate,
    challengesPlayed
}) => {
    return (
        <>
            <View style={styles.groupDetail}>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Nickname</Text>
                    <Text style={styles.responseText}>{username}</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Real Name</Text>
                    <Text style={styles.responseText}>{firstName} {lastName}</Text>
                </View>
            </View>
            <View style={styles.groupDetail}>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Games Played</Text>
                    <Text style={styles.responseText}>{gamesPlayed}</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Global Ranking</Text>
                    <Text style={styles.responseText}>{globalRanking}</Text>
                </View>
            </View>
            <View style={styles.groupDetail}>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Win Rate</Text>
                    <Text style={styles.responseText}>{winRate}</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Challenges Played</Text>
                    <Text style={styles.responseText}>{challengesPlayed}</Text>
                </View>
            </View>
        </>
    )
}





const styles = EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(25),
        // marginBottom: normalize(20)
    },
    rank: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#151C2F',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        borderRadius: 16
    },
    rankPoints: {
        flexDirection: 'column'
    },
    rankText: {
        fontSize: '1.25rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
    pointText: {
        fontSize: '0.66rem',
        fontFamily: 'graphik-medium',
        color: '#828282',
        marginVertical: normalize(10)
    },
    detail: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    groupDetail: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: normalize(15)
    },
    detailText: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        color: '#757575',
        marginBottom: normalize(10),
        opacity: 0.8
    },
    responseText: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        color: '#151C2F',
    },
    gameInfo: {
        backgroundColor: '#EA5038',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(15),
        borderRadius: 9,
        marginBottom: normalize(10),

    },
    gamesPlayed: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    gamesTitle: {
        fontSize: normalize(15),
        fontFamily: 'graphik-regular',
        color: '#000000',
        marginVertical: normalize(12),
    },
    gameName: {
        fontSize: normalize(13),
        fontFamily: 'graphik-bold',
        color: '#FFFF',
        width: normalize(60),
        marginLeft: normalize(10),
    },
    games: {
        paddingTop: normalize(10),
    },
    title: {
        fontSize: '0.89rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        lineHeight: normalize(15),
        marginTop: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: normalize(18),
    },
    card: {
        backgroundColor: '#9C3DB8',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(10),
        width: normalize(135),
        borderRadius: normalize(7),
        marginRight: normalize(15),
    },
    cardIcon: {
        width: normalize(40),
        height: normalize(40),
        borderRadius: normalize(10)
    },
    cardInstruction: {
        fontSize: normalize(10),
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    cardTitle: {
        fontSize: normalize(12),
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginTop: normalize(8),
    },

    playedTitle: {
        fontSize: '0.75rem',
        color: '#4F4F4F',
        fontFamily: 'graphik-bold',
        lineHeight: 17,
        marginTop: normalize(8),
    },
    replay: {
        fontSize: '0.6rem',
        color: '#EF2F55',
        fontFamily: 'graphik-regular',
    },
});
