import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import normalize, { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { getCommonData, getGlobalLeaders } from '../CommonSlice';
import GlobalTopLeadersHero from '../../shared/GlobalTopLeadersHero';
import UserItems from '../../shared/UserPurchasedItems';
import { useNavigation } from '@react-navigation/core';

const HomeScreen = () => {

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

export default HomeScreen;

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
    const navigation = useNavigation();
    return (
        <View style={[styles.card, { backgroundColor: game.bgColor }]} >
            <Image
                style={[styles.cardIconBigger]}
                source={{ uri: `${backendUrl}/${game.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{game.name}</Text>
                <Pressable onPress={() => navigation.navigate('Game')}><Text style={styles.replay}>Replay</Text></Pressable>
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
        paddingHorizontal: '1.2rem',
    },
    userDetails: {
        backgroundColor: '#151C2F',
        paddingVertical: normalize(30),
        paddingHorizontal: normalize(20),
    },
    wallet: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletText: {
        fontSize: '1.2rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(8),
    },
    points: {
        backgroundColor: '#01A7DB',
        borderRadius: normalize(10),
        marginTop: responsiveScreenHeight(6),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingRight: normalize(30),
        paddingLeft: normalize(20),
    },
    trophy: {
        position: 'relative',
        zIndex: 2,
        marginTop: normalize(-25)
    },
    pointsNumber: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    userPoint: {
        fontSize: '1.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    pointDetail: {
        color: '#e3e3e3',
        fontSize: '0.8rem',
        fontFamily: 'graphik-medium',
    },
    userRanking: {
        backgroundColor: '#FFFF',
        borderRadius: normalize(10),
        marginTop: normalize(15),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(30),
    },
    gamesPlayed: {

    },
    globalRanking: {
        alignItems: 'flex-end'
    },
    rankNumber: {
        fontSize: '1.5rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    rankDetail: {
        color: '#151c2f73',
        fontFamily: 'graphik-bold',
        fontSize: '0.7rem',
    },
    games: {
        paddingTop: normalize(10, "height"),
    },
    title: {
        fontSize: '1.3rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginTop: responsiveHeight(3),
    },
    planInstruction: {
        color: '#151C2F',
        fontSize: '0.8rem',
        fontFamily: 'graphik-regular',
        lineHeight: responsiveHeight(3),
        opacity: 0.7,
        marginVertical: responsiveHeight(2),
    },
    lightTitle: {
        fontSize: '1rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        marginTop: normalize(10),
    },
    cards: {
        display: 'flex',
        marginTop: normalize(18),
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        borderRadius: normalize(10),
        marginRight: responsiveWidth(3),
        flexDirection: "row",
        borderColor: '#0F000000',
        width: responsiveScreenWidth(70),
        '@media (min-height: 781) and (max-height: 1200)': {
            height: responsiveHeight(10),
        },
        '@media (min-height: 300) and (max-height: 780)': {
            height: responsiveHeight(8),
        },
    },
    cardIcon: {
        flex: 1,
        height: '2rem',
        width: '2rem',
        alignSelf: 'center',
    },
    cardIconBigger: {
        flex: 2,
        width: normalize(48),
        height: normalize(48),
        alignSelf: 'center',
    },
    cardContent: {
        flex: 4,
        paddingHorizontal: responsiveScreenWidth(1),
        justifyContent: "space-evenly",
    },
    cardTitle: {
        fontSize: responsiveFontSize(2),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    cardInstruction: {
        fontSize: '0.7rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        lineHeight: '1.1rem',
        opacity: .7,
        flex: 1,
        flexWrap: 'wrap',
        flexShrink: 1
    },
    replay: {
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase'
    },
});
