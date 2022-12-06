import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, ScrollView, StatusBar, Platform, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import Animated, {
    BounceInRight, BounceInUp,
    useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming
} from 'react-native-reanimated';
import normalize, {
    responsiveHeight, responsiveScreenWidth, responsiveWidth
} from '../../utils/normalize';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
import LiveTriviaCard from '../LiveTrivia/LiveTriviaCard';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { fetchFeatureFlags, getCommonData, getGlobalLeaders, initialLoadingComplete } from '../CommonSlice';
import GlobalTopLeadersHero from '../../shared/GlobalTopLeadersHero';
import UserItems from '../../shared/UserItems';
import { networkIssueNotify, notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../../utils/utils';
import crashlytics from '@react-native-firebase/crashlytics';
import GamePicker from '../Games/GamePicker';
import LottieAnimations from '../../shared/LottieAnimations';
import SelectGameMode from '../Games/SelectGameMode';
import ChallengeWeeklyTopLeaders from '../Leaderboard/ChallengeWeeklyTopLeaders';
import { getLiveTriviaStatus } from '../LiveTrivia/LiveTriviaSlice';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    // console.log(user)
    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);
    const loading = useSelector(state => state.common.initialLoading);
    const trivia = useSelector(state => state.liveTrivia.data);
    const challengeLeaders = useSelector(state => state.game.challengeLeaders)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getUser())
        dispatch(getCommonData())
        dispatch(getLiveTriviaStatus())
        wait(2000).then(() => setRefreshing(false));
    }, []);



    useEffect(() => {


        const _1 = dispatch(getUser());
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())

        Promise.all([_1, _2, _3]).then(() => {
            dispatch(initialLoadingComplete());
        });

        // dispatch(getUser())
        // dispatch(getCommonData())

        //     .then(() => {
        //         dispatch(initialLoadingComplete());
        //     });

    }, []);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('dark-content');
            return () => {
                StatusBar.setTranslucent(true)
                // StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    useEffect(() => {
        //we intentionally allow in preview to enable testing of this functionality
        if (!Constants.manifest.extra.isDevelopment) {
            return;
        }
        //whether we are forcing or not, show the first time
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }, [minVersionCode]);

    // useEffect(() => {
    //     if (!loading && !isTrue(user.walletBalance)) {
    //         networkIssueNotify()
    //     }
    // }, [user, loading])

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

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const onBackPress = () => {
    //             return true;
    //         };
    //         BackHandler.addEventListener('hardwareBackPress', onBackPress);

    //         return () =>
    //             BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    //     }, [])
    // )

    useEffect(() => {
        if (!user || !isTrue(user.walletBalance)) {
            return;
        }

        Promise.all([
            crashlytics().setAttribute('username', user.username),
        ]);

    }, [user]);

    if (loading) {
        return <PageLoading spinnerColor="#0000ff" />
    }

    return (
        <View style={styles.headContainer}>
            <ScrollView contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#000000"
                    />
                }
            >
                <UserDetails user={user} trivia={trivia} />
                <View style={styles.container}>
                    <SelectGameMode />
                    <ChallengeWeeklyTopLeaders challengeLeaders={challengeLeaders} />
                    <GlobalTopLeadersHero />
                </View>
            </ScrollView>
        </View>
    );
}

export default HomeScreen;

const UserDetails = ({ user, trivia }) => {

    return (
        <View style={styles.userDetails}>
            <UserWallet balance={user.walletBalance} />
            <LiveTriviaCard trivia={trivia} />
            <UserPoints points={user.points} todaysPoints={user.todaysPoints} />
            <UserItems showBuy={Platform.OS === 'ios' ? false : true} />
            {/* <UserRanking gamesCount={user.gamesCount} ranking={user.globalRank} /> */}
        </View>
    );
}

const UserWallet = ({ balance }) => {
    return (
        <Animated.View entering={BounceInRight.duration(2000)} style={styles.wallet}>

            <LottieAnimations
                animationView={require('../../../assets/wallet.json')}
                width={normalize(55)}
                height={normalize(60)}
            />
            <Text style={styles.walletText}>&#8358;{formatCurrency(balance)}</Text>
        </Animated.View>
    );
}

const UserPoints = ({ points, todaysPoints }) => {
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
        <Animated.View entering={BounceInUp.duration(2000)} style={styles.points}>
            <Animated.Image
                style={[styles.trophy, animatedStyle]}
                source={require('../../../assets/images/point-trophy.png')}
            />
            <View style={styles.pointsNumber}>
                <Text style={styles.userPoint}>{formatNumber(todaysPoints)}</Text>
                <Text style={styles.userPoint} >pts</Text>
                <Text style={styles.pointDetail} >Today</Text>
            </View>
            <View style={styles.pointsNumber}>
                <Text style={styles.userPoint}>{formatNumber(points)}</Text>
                <Text style={styles.userPoint} >pts</Text>
                <Text style={styles.pointDetail} >Total</Text>
            </View>
        </Animated.View>
    );
}



const styles = EStyleSheet.create({
    headContainer: {
        backgroundColor: '#FAC502',
    },
    scrollView: {
        paddingBottom: normalize(30),
        backgroundColor: '#FFFF',

    },
    container: {
        flex: 1,
        paddingHorizontal: '1.2rem',
        backgroundColor: '#FFFF',
    },
    userDetails: {
        backgroundColor: '#072169',
        paddingBottom: normalize(15),
        paddingHorizontal: normalize(20),
    },
    wallet: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: normalize(10),
    },
    walletText: {
        fontSize: '1.2rem',
        color: '#FFFF',
        // lineHeight: '1.2rem',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(2),
        marginTop: normalize(5)
    },
    points: {
        backgroundColor: '#518EF8',
        borderRadius: normalize(10),
        marginVertical: normalize(10),
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingRight: normalize(10),
        paddingLeft: normalize(20),
    },
    trophy: {
        position: 'relative',
        zIndex: 2,
        marginTop: normalize(-25)
    },
    pointsNumber: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#072169",
        borderRadius: 100,
        paddingVertical: 20,
        paddingHorizontal: 25,
        textAlign: 'center'
    },
    userPoint: {
        fontSize: '0.8rem',
        lineHeight: '0.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        // width: '2.3rem',
        textAlign: 'center'
    },
    pointDetail: {
        color: '#e3e3e3',
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase',
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
        marginTop: responsiveHeight(1),
        marginBottom: responsiveHeight(2),
    },
    lightTitle: {
        fontSize: '1rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        marginTop: normalize(10),
    },
    cards: {
        flexDirection: 'row',
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