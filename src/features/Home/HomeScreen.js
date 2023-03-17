import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { Text, View, ScrollView, Image, StatusBar, Platform, RefreshControl, Pressable, Alert } from 'react-native';
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
import { fetchFeatureFlags, getCommonData, initialLoadingComplete, loadSoundPrefernce, setSound } from '../CommonSlice';
import UserItems from '../../shared/UserItems';
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../../utils/utils';
import crashlytics from '@react-native-firebase/crashlytics';
import LottieAnimations from '../../shared/LottieAnimations';
import SelectGameMode from '../Games/SelectGameMode';
import ChallengeWeeklyTopLeaders from '../Leaderboard/ChallengeWeeklyTopLeaders';
import { getLiveTriviaStatus } from '../LiveTrivia/LiveTriviaSlice';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Stakingpopup from '../../shared/Stakingpopup';
import WeeklyTopLeadersHero from '../../shared/WeeklyTopLeadersHero';
// import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import AchievementPopup from '../../shared/AchievementPopup';
import { getAchievements } from '../Profile/AchievementSlice';
import useSound from '../../utils/useSound';
import { Button } from 'react-native-elements';
import * as InAppPurchases from 'expo-in-app-purchases';
import { setItems } from '../InAppPurchaseSlice';
import axios from 'axios';


const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
const PRODUCTS = [
    {"priceAmountMicros":160000000,"title":"Time Freeze (GameArk)","productId":"boost_plan_time_freeze","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Skip (GameArk)","productId":"boost_plan_skip","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Ultimate (GameArk)","productId":"game_plan_ultimate","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"DiceyMultiples (GameArk)","productId":"game_plan_dicey_multiples","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Double O (GameArk)","productId":"game_plan_double_o","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Least Plan (GameArk)","productId":"game_plan_least","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"},
    {"priceAmountMicros":160000000,"title":"Mini Plan (GameArk)","productId":"game_plan_mini","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"}
]

const HomeScreen = (props) => {
    // const CopilotProps = props;
    const route = props.route;
    const navigation = useNavigation();

    const dispatch = useDispatch();


    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);
    const loading = useSelector(state => state.common.initialLoading);
    const challengeLeaders = useSelector(state => state.game.challengeLeaders);
    const showStakingAdvert = route.params?.showStakingAdvert ?? false;
    const [modalVisible, setModalVisible] = useState(false);
    const [achievementPopup, setAchievementPopup] = useState(false)
    const gameModes = useSelector(state => state.common.gameModes);
    const items = useSelector(state => state.inAppPurchase.items);
    const [refreshing, setRefreshing] = useState(false);
    const isSoundLoaded = useSelector(state => state.common.isSoundLoaded);
    // const isTourActive = useSelector(state => state.tourSlice.isTourActive);
    const [forceRender, setForceRender] = useState(true);

    const isFocused = useIsFocused();
    const { playSound } = useSound(require('../../../assets/sounds/dashboard.mp3'));

    const convertArrayToString = (arr) => {
        arr = arr.map(_temp => JSON.stringify(_temp));
        return arr.toString();
    }

    const getStoreItems = async () => {

        const items = Platform.select({
            android: ['boost_plan_time_freeze', 'boost_plan_skip', 'game_plan_ultimate', 'game_plan_dicey_multiples', 'game_plan_doubleo', 'game_plan_least', 'game_plan_mini'],
        });
        const { responseCode, results } = await InAppPurchases.getProductsAsync(items);
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            dispatch(setItems(results.length !== 0 ? results : PRODUCTS))


            // Alert.alert(convertArrayToString(results))
            // const fd = new FormData();
            // fd.append('data', convertArrayToString(results));
           
        //     try{
        //    const fetchItems = await axios({
        //         method: "post", 
        //         url:"/",
        //         baseURL: "http://192.168.222.221:8089",
               
        //         data: {data: convertArrayToString(results)}
        //     })
        // }catch (error) {
        //     console.log(error)
        // }
        } else {
            // Alert.alert('Code not reached')
        }
    }

    // {"priceAmountMicros":160000000,"title":"Time Freeze (GameArk)","productId":"boost_plan_time_freeze","type":0,"priceCurrencyCode":"NGN","description":"Freezes game time For 15 Seconds","price":"₦160.00","subscriptionPeriod":"P0D"}
    useEffect(() => {
        if (isFocused && isSoundLoaded) {
            playSound()
        }
    }, [isFocused, isSoundLoaded]);

    const onRefresh = React.useCallback(() => {
        // console.info('refreshing')
        setRefreshing(true);
        dispatch(getUser())
        dispatch(getCommonData())
        dispatch(getLiveTriviaStatus())
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())

        Promise.all([_2, _3]).then(() => {
            dispatch(initialLoadingComplete());
        });
        loadSoundPrefernce(dispatch, setSound)
        getStoreItems()
    }, []);

    useEffect(() => {
        if (Constants.manifest.extra.isDevelopment) {
            return;
        }
        //whether we are forcing or not, show the first time
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }, [minVersionCode]);

    useEffect(() => {
        setModalVisible(showStakingAdvert);
    }, [showStakingAdvert])

    useFocusEffect(
        React.useCallback(() => {

            if (loading) {
                return;
            }

            // console.info('home screen focus effect')

            if (Constants.manifest.extra.isDevelopment) {
                return;
            }

            notifyOfPublishedUpdates();

            if (minVersionForce) {
                notifyOfStoreUpdates(minVersionCode, minVersionForce);
            }

        }, [loading])
    );

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('dark-content');
            return () => {
                StatusBar.setTranslucent(true)
            }
        }, [])
    );
    // useEffect(()=>{
    //     setTimeout(()=>{
    //         if((isTourActive?.payload || isTourActive) && !loading && (props?.route?.params?.reload) ){

    //             console.log('reach11')
    //             CopilotProps.start()
    //             CopilotProps.copilotEvents.on('stop', handleTourStop)

    //             return () => {
    //                 CopilotProps.copilotEvents.off('stop', handleTourStop)
    //             }
    //         }else{

    //         }
    //     }, 1000)
    // }, [isTourActive, loading, props?.route?.params?.reload])

    // const handleTourStop = ()=>{
    //     console.log("tour stopped, going to next screen to continue....")
    //     navigation.navigate("LiveTriviaLeaderboard", {
    //         triviaId: 0
    //     })
    // }

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
                <UserDetails />
                <View style={styles.container}>

                    <SelectGameMode />
                    {/* <SelectGameMode Walkthroughable={Walkthroughable} CopilotStep={CopilotStep} /> */}
                    <SwiperFlatList contentContainerStyle={styles.leaderboardContainer}>
                        <WeeklyTopLeadersHero gameModes={gameModes} />
                        {/* <GlobalTopLeadersHero /> */}
                        {/* <ChallengeWeeklyTopLeaders challengeLeaders={challengeLeaders} /> */}
                    </SwiperFlatList>
                </View>
                <Stakingpopup setModalVisible={setModalVisible} modalVisible={modalVisible} gameModes={gameModes} />
                <AchievementPopup setAchievementPopup={setAchievementPopup} achievementPopup={achievementPopup} />
            </ScrollView>
        </View>
    );
}

// export default copilot({
//     animated: true,
//     overlay: 'svg',
//     labels: {
//         finish: 'Next'
//     }
// })(HomeScreen);
export default HomeScreen;

const UserDetails = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        if (!user || !isTrue(user.walletBalance)) {
            return;
        }

        Promise.all([
            crashlytics().setAttribute('username', user.username),
        ]);

    }, [user]);

    useFocusEffect(
        React.useCallback(() => {
            // console.info('UserDetails focus effect')
            dispatch(getUser());

            // get achievements badges
            dispatch(getAchievements());
        }, [])
    );

    return (
        <View style={styles.userDetails}>
            <UserWallet balance={user.walletBalance ?? 0} />
            {/* <View style={{ marginVertical: 20 }} /> */}
            <LiveTriviaBanner />
            <UserPoints points={user.points ?? 0} todaysPoints={user.todaysPoints ?? 0} />
            <UserItems showBuy={Platform.OS === 'ios' ? false : true} />
        </View>
    );
}

const UserWallet = ({ balance }) => {
    return (
        <Animated.View entering={BounceInRight.duration(2000)} style={styles.wallet}>

            <LottieAnimations
                animationView={require('../../../assets/coin.json')}
                width={normalize(30)}
                height={normalize(35)}
            />
            <Text style={{ padding: 7, marginVertical: 12, marginBottom: 15 }} />
            {/* <Image source={require('../../../assets/images/coin.png')} style={{ width: normalize(30), height: normalize(35), padding: 7, marginVertical: 8, marginRight: 5 }} /> */}
            <Text style={styles.walletText}>{formatCurrency(balance)}</Text>
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

const LiveTriviaBanner = () => {
    const [show, setShow] = useState(false);
    const trivia = useSelector(state => state.liveTrivia.data);
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            // console.info('LiveTriviaBanner focus effect')
            dispatch(getLiveTriviaStatus());

        }, [])
    );

    useEffect(() => {
        setShow(isTrue(trivia));
    }, [trivia]);

    return show ? <LiveTriviaCard trivia={trivia} /> : null;
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
    leaderboardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
    leaderHeader: {
        textAlign: 'center',
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-bold',
        textTransform: 'uppercase',
        marginBottom: normalize(5),

    }
});