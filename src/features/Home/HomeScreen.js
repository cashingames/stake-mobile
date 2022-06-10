import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import Animated, {
    BounceIn, BounceInLeft, BounceInRight, BounceInUp, FadeInUp,
    useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming
} from 'react-native-reanimated';

import normalize, {
    responsiveHeight, responsiveScreenWidth, responsiveWidth
} from '../../utils/normalize';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
import LiveTriviaCard from '../LiveTrivia/LiveTriviaCard';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { getCommonData, getGlobalLeaders, initialLoadingComplete } from '../CommonSlice';
import { resetGameStats } from '../Games/GameSlice';
import GlobalTopLeadersHero from '../../shared/GlobalTopLeadersHero';
import UserItems from '../../shared/UserPurchasedItems';
import { networkIssueNotify, notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../../utils/utils';
import crashlytics from '@react-native-firebase/crashlytics';


const HomeScreen = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const gameTypes = useSelector(state => state.common.gameTypes);
    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);
    const loading = useSelector(state => state.common.initialLoading);


    useEffect(() => {
        dispatch(resetGameStats());

        var _1 = dispatch(getUser());
        var _2 = dispatch(getCommonData());

        Promise.all([_1, _2]).then(() => {
            dispatch(initialLoadingComplete());
        });

    }, []);

    useEffect(() => {
        //we intentionally allow in preview to enable testing of this functionality
        if (!Constants.manifest.extra.isDevelopment) {
            return;
        }
        //whether we are forcing or not, show the first time
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }, [minVersionCode]);

    useEffect(() => {
        if (!loading && !isTrue(user.walletBalance)) {
            networkIssueNotify()
        }
    }, [user, loading])

    useFocusEffect(
        React.useCallback(() => {

            if (loading) {
                return;
            }

            dispatch(getUser());
            dispatch(getGlobalLeaders())
            if (Constants.manifest.extra.isDevelopment) {
                return;
            }
            notifyOfPublishedUpdates();
            if (minVersionForce) {
                //if we are forcing, anytime they come to home, show
                notifyOfStoreUpdates(minVersionCode, minVersionForce);
            }
        }, [loading])
    );

    useEffect(() => {
        if (!user || !isTrue(user.walletBalance)) {
            return;
        }

        Promise.all([
            crashlytics().setAttribute('username', user.username),
        ]);

    }, [user]);

    if (loading) {
        return <PageLoading />
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <UserDetails user={user} />
            <View style={styles.container}>
                <Animated.View entering={FadeInUp.delay(1000).duration(1000)}>
                    <Text style={styles.title}>Games</Text>
                    <Text style={styles.planInstruction}>You can only play 5 free games daily,
                        Buy Games to enjoy playing without interruptons.
                    </Text>
                </Animated.View>
                <UserItems showBuy={true} />
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
            <LiveTriviaCard />
            <UserPoints points={user.points} />
            <UserRanking gamesCount={user.gamesCount} ranking={user.globalRank} />
        </View>
    );
}

const UserWallet = ({ balance }) => {
    return (
        <Animated.View entering={BounceInRight.duration(2000)} style={styles.wallet}>
            <Image
                source={require('../../../assets/images/wallet.png')}
            />
            <Text style={styles.walletText}>&#8358;{formatCurrency(balance)}</Text>
        </Animated.View>
    );
}

const UserPoints = ({ points }) => {
    const rotation = useSharedValue(0);
    rotation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withRepeat(withTiming(15, { duration: 100 }), 6, true),
        withTiming(0, { duration: 50 })
    );
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });

    return (
        <Animated.View entering={BounceInUp.delay(800)} style={styles.points}>
            <Animated.Image
                style={[styles.trophy, animatedStyle]}
                source={require('../../../assets/images/point-trophy.png')}
            />
            <View style={styles.pointsNumber}>
                <Text style={styles.userPoint}>{formatNumber(points)}</Text>
                <Text style={styles.pointDetail} >POINTS EARNED</Text>
            </View>
        </Animated.View>
    );
}

const UserRanking = ({ gamesCount, ranking }) => {
    return (
        <Animated.View entering={BounceInLeft.delay(400)} style={styles.userRanking} >
            <View style={styles.gamesPlayed}>
                <Text style={styles.rankNumber}>{formatNumber(gamesCount)}</Text>
                <Text style={styles.rankDetail}>GAMES PLAYED</Text>
            </View>
            <View style={styles.globalRanking}>
                <Text style={styles.rankNumber}>{formatNumber(ranking)}</Text>
                <Text style={styles.rankDetail}>GLOBAL RANKING</Text>
            </View>
        </Animated.View>
    );
}

function GameCards({ games }) {

    if (!isTrue(games) || games.length === 0)
        return <></>;

    return (
        <Animated.View entering={BounceIn.delay(1000)} style={styles.games}>
            <Text style={styles.lightTitle}>Play New Game</Text>
            <View style={styles.cards}>
                <SwiperFlatList >
                    {games.map((game, i) => <GameCard key={i} game={game} />)}
                </SwiperFlatList>
            </View>
        </Animated.View>

    )
}

function GameCard({ game }) {
    const navigation = useNavigation();
    return (
        <Pressable style={[styles.card]} onPress={() => navigation.navigate('Game')}>
            <Image
                style={styles.cardIcon}
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${game.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{game.displayName}</Text>
                <Text style={styles.cardInstruction}>{game.description}</Text>
            </View>

        </Pressable>
    );
}

function RecentlyPlayedCards({ games }) {
    if (!games || !isTrue(games) || games.length === 0)
        return <></>;
    return (
        <View style={styles.games}>
            <Text style={styles.lightTitle}>Recently Played</Text>
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
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${game.icon}` }}
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
        backgroundColor: '#072169',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(20),
    },
    wallet: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletText: {
        fontSize: '1.2rem',
        color: '#FFFF',
        lineHeight: '1.2rem',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(8),
    },
    points: {
        backgroundColor: '#518EF8',
        borderRadius: normalize(10),
        marginTop: normalize(10),
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
        // color: 'red',
        fontSize: '0.8rem',
        fontFamily: 'graphik-medium',
    },
    userRanking: {
        backgroundColor: '#FFFF',
        borderRadius: normalize(10),
        marginTop: normalize(10),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(30),
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
        fontSize: Platform.OS === 'ios' ? '1.4rem' : '1.3rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginTop: responsiveHeight(3),
    },
    planInstruction: {
        color: '#151C2F',
        fontSize: Platform.OS === 'ios' ? '0.9rem' : '0.8rem',
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
        borderRadius: normalize(10),
        alignItems: 'center',
        marginRight: responsiveWidth(3),
        flexDirection: "row",
        borderColor: '#0F000000',
        width: responsiveScreenWidth(70),
        '@media (min-height: 781) and (max-height: 1200)': {
            height: responsiveHeight(10),
        },
        '@media (min-height: 300) and (max-height: 780)': {
            height: responsiveHeight(11),
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
        fontSize: '0.93rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    cardInstruction: {
        fontSize: '0.75rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        lineHeight: '1rem',
        opacity: .7,
        flexWrap: 'wrap',
        flexShrink: 1,
        marginTop: Platform.OS === 'ios' ? normalize(2) : normalize(1),

    },
    replay: {
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase',
        marginTop: Platform.OS === 'ios' ? normalize(5) : normalize(1),
    },
});