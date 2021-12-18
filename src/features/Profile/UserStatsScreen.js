import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useSelector } from 'react-redux';
import { isTrue, formatCurrency } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

export default function UserStatsScreen({ navigation }) {
    const user = useSelector(state => state.auth.user)

    return (
            <ScrollView>
                <View style={styles.content}>
                    <UserRank userPoint={user.points} />
                    <Detail
                    username={user.username}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    gamesPlayed={user.gamesCount}
                    globalRanking={user.globalRank}
                    winRate={user.winRate}
                    position={user.badge}
                    challengesPlayed={user.totalChallenges}
                     />
                    <RecentlyPlayedCards games={user.recentGames} />
                </View>
            </ScrollView>
    );
}

const UserRank = ({userPoint }) => {
    return (
        <View style={styles.rank}>
            <View>
                <Text style={styles.rankText}>Rank by Points</Text>
                <Text style={styles.pointText}>{userPoint}points</Text>
            </View>
            <Image
                // style={styles.avatar}
                source={require('../../../assets/images/trophy-cup.png')}
            />
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
    position,
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
                    <Text style={styles.detailText}>Position</Text>
                    <Text style={styles.responseText}>{position}</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Challenges Played</Text>
                    <Text style={styles.responseText}>{challengesPlayed}</Text>
                </View>
            </View>
        </>
    )
}

function RecentlyPlayedCard({ game }) {
    return (
        <View style={[styles.card, { backgroundColor: game.bgColor }]} >
            <Image
                style={styles.cardIcon}
                source={{ uri: `${backendUrl}/${game.icon}` }}
            />
            <Text style={styles.playedTitle}>{game.name}</Text>
            <Text style={styles.replay}>Replay</Text>
        </View>
    );
}

function RecentlyPlayedCards({ games }) {
    if (!isTrue(games) || games.length === 0)
        return <></>;
    return (
        <View style={styles.games}>
            <Text style={styles.title}>Recently Played Games</Text>
            <View style={styles.cards}>
                <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop>
                    {games.map((game, i) => <RecentlyPlayedCard key={i} game={game} />)}
                </SwiperFlatList>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(25),
        marginBottom: normalize(20)
    },
    rank: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#151C2F',
        paddingVertical: normalize(25),
        paddingHorizontal: normalize(15),
        borderRadius: 16
    },
    rankText: {
        fontSize: normalize(20),
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
    pointText: {
        fontSize: normalize(12),
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
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#757575',
        marginBottom: normalize(10),
    },
    responseText: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#151C2F',
    },
    gameInfo: {
        backgroundColor: '#EA5038',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(15),
        borderRadius: 9,
        marginBottom: normalize(10),
      
    },
    gamesPlayed: {
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-between'
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
        fontSize: normalize(15),
        color: '#151C2F',
        fontFamily: 'graphik-bold',
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
        width: 50,
        height: 50,
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
    replay: {
        fontSize: normalize(10),
        color: '#EF2F55',
        fontFamily: 'graphik-regular',
    },
    playedTitle: {
        fontSize: 15,
        color: '#4F4F4F',
        fontFamily: 'graphik-bold',
        lineHeight: 17,
        marginTop: normalize(8),
    },
});
