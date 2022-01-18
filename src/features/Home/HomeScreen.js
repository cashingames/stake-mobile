import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useFocusEffect } from '@react-navigation/native';
import { copilot } from "react-native-copilot";
import EStyleSheet from 'react-native-extended-stylesheet';

import normalize from '../../utils/normalize';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { getCommonData, getGlobalLeaders } from '../CommonSlice';
import GlobalTopLeadersHero from '../../shared/GlobalTopLeadersHero';
import UserItems from '../../shared/UserPurchasedItems';

const HomeScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const gameTypes = useSelector(state => state.common.gameTypes)
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        var _1 = dispatch(getUser());
        var _2 = dispatch(getCommonData());

        Promise.all([_1, _2]).then(values => {
            setLoading(false);
        });
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getGlobalLeaders())
        }, [])
    );

    if (loading) {
        return <PageLoading />
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <UserDetails user={user} />
            <View style={styles.container}>
                <>
                    <Text style={styles.title}>Games</Text>
                    <Text style={styles.planInstruction}>You can only play 10 free games daily,
                        Buy Games to enjoy playing without interruptons.
                    </Text>
                    <UserItems showBuy={true} />
                </>
                <GameCards games={gameTypes} />
                <RecentlyPlayedCards games={user.recentGames} />
                <GlobalTopLeadersHero />
            </View>
        </ScrollView>
    );

}
export default copilot()(HomeScreen);


const UserDetails = ({ user }) => {
    return (
        <View style={styles.userDetails}>
            <UserWallet balance={user.walletBalance} />
            <UserPoints points={user.points} />
            <UserRanking gamesCount={user.gamesCount} ranking={user.globalRank} />
        </View>
    );
}

const UserWallet = ({ balance }) => {
    return (
        <View style={styles.wallet}>
            <Image
                style={styles.icon}
                source={require('../../../assets/images/wallet.png')}
            />
            <Text style={styles.walletText}>&#8358;{formatCurrency(balance)}</Text>
        </View>
    );
}

const UserPoints = ({ points }) => {
    return (
        <View style={styles.points}>
            <Image
                style={styles.trophy}
                source={require('../../../assets/images/point-trophy.png')}
            />
            <View style={styles.pointsNumber}>
                <Text style={styles.userPoint}>{formatNumber(points)}</Text>
                <Text style={styles.pointDetail} >YOUR POINTS EARNED</Text>
            </View>
        </View>
    );
}

const UserRanking = ({ gamesCount, ranking }) => {
    return (
        <View style={styles.userRanking}>
            <View style={styles.gamesPlayed}>
                <Text style={styles.rankNumber}>{formatNumber(gamesCount)}</Text>
                <Text style={styles.rankDetail}>GAMES PLAYED</Text>
            </View>
            <View style={styles.globalRanking}>
                <Text style={styles.rankNumber}>{formatNumber(ranking)}</Text>
                <Text style={styles.rankDetail}>GLOBAL RANKING</Text>
            </View>
        </View>
    );
}


function GameCards({ games }) {

    if (!isTrue(games) || games.length === 0)
        return <></>;

    return (
        <View style={styles.games}>
            <Text style={styles.lightTitle}>Play game</Text>
            <View style={styles.cards}>
                <SwiperFlatList >
                    {games.map((game, i) => <GameCard key={i} game={game} />)}
                </SwiperFlatList>
            </View>
        </View>

    )
}

function GameCard({ game }) {
    return (
        <View style={[styles.card]} >
            <Image
                style={styles.cardIcon}
                source={{ uri: `${backendUrl}/${game.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{game.displayName}</Text>
                <Text style={styles.cardInstruction}>{game.description}</Text>
            </View>
        </View>
    );
}


function RecentlyPlayedCards({ games }) {
    if (!isTrue(games) || games.length === 0)
        return <></>;
    return (
        <View style={styles.games}>
            <Text style={styles.lightTitle}>Recently played games</Text>
            <View style={styles.cards}>
                <SwiperFlatList >
                    {games.map((game, i) => <RecentlyPlayedCard key={i} game={game} />)}
                </SwiperFlatList>
            </View>
        </View>

    )
}

function RecentlyPlayedCard({ game }) {
    return (
        <View style={[styles.card, { backgroundColor: game.bgColor }]} >
            <Image
                style={[styles.cardIcon, styles.cardIconBigger]}
                source={{ uri: `${backendUrl}/${game.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{game.name}</Text>
                <Text style={styles.replay}>Replay</Text>
            </View>
        </View>
    );
}


const styles = EStyleSheet.create({
    scrollView: {
        paddingBottom: normalize(30),
        backgroundColor: '#F8F9FD',
    },
    container: {
        flex: 1,
        paddingHorizontal: '1rem',
    },
    userDetails: {
        backgroundColor: '#151C2F',
        paddingTop: normalize(30),
        paddingRight: normalize(20),
        paddingLeft: normalize(20),
        paddingBottom: normalize(15),
    },
    wallet: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletText: {
        fontSize: normalize(18),
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(8),
    },
    points: {
        backgroundColor: '#01A7DB',
        borderRadius: normalize(10),
        marginTop: normalize(30),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: normalize(8),
        paddingRight: normalize(15),
        paddingLeft: normalize(6),
    },
    trophy: {
        // width: 100
    },
    pointsNumber: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    userPoint: {
        fontSize: normalize(26),
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    pointDetail: {
        color: '#e3e3e3',
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
    },
    userRanking: {
        backgroundColor: '#FFFF',
        borderRadius: normalize(10),
        marginTop: normalize(15),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: normalize(15),
    },
    gamesPlayed: {

    },
    globalRanking: {
        alignItems: 'flex-end'
    },
    rankNumber: {
        fontSize: normalize(26),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    rankDetail: {
        color: '#151c2f73',
        fontFamily: 'graphik-bold',
        fontSize: normalize(11),
    },
    games: {
        paddingTop: normalize(10),
    },
    title: {
        fontSize: normalize(24),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginTop: normalize(10),
    },
    lightTitle: {
        fontSize: normalize(18),
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        marginTop: normalize(10),
    },
    cards: {
        display: 'flex',
        marginTop: normalize(18),
    },
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(10),
        borderRadius: normalize(10),
        marginRight: normalize(15),
        flexDirection: "row",
        borderColor: '#0F000000',
    },
    cardIcon: {
        width: normalize(30),
        height: normalize(30),
        alignSelf: 'center',
    },
    cardIconBigger: {
        width: normalize(48),
        height: normalize(48),
    },
    cardContent: {
        marginLeft: normalize(10),
        width: Dimensions.get('window').width * 0.4,
        height: normalize(55),
        justifyContent: "space-evenly"
    },
    cardTitle: {
        fontSize: normalize(14),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    cardInstruction: {
        fontSize: normalize(12),
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        lineHeight: normalize(18),
        opacity: .7,
    },
    replay: {
        fontSize: normalize(11),
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase'
    },

    playedTitle: {
        fontSize: 15,
        color: '#4F4F4F',
        fontFamily: 'graphik-bold',
        lineHeight: 17,
        marginTop: normalize(8),
    },
    planInstruction: {
        color: '#151C2F',
        fontSize: normalize(14),
        fontFamily: 'graphik-regular',
        lineHeight: normalize(24),
        opacity: 0.7,
        marginVertical: normalize(10),
    },
});
