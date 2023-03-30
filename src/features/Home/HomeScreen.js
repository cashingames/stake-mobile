import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, ScrollView, StatusBar, Platform, RefreshControl, Pressable, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import Animated, { BounceInRight } from 'react-native-reanimated';
import normalize, {
    responsiveHeight, responsiveScreenWidth
} from '../../utils/normalize';
import { isTrue, formatCurrency } from '../../utils/stringUtl';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { fetchFeatureFlags, getCommonData, initialLoadingComplete } from '../CommonSlice';
import UserItems from '../../shared/UserItems';
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../../utils/utils';
import crashlytics from '@react-native-firebase/crashlytics';
import LottieAnimations from '../../shared/LottieAnimations';
import SelectGameMode from '../Games/SelectGameMode';
import SwiperFlatList from 'react-native-swiper-flatlist';
import WinnersScroller from '../Leaderboard/WinnersScroller';
import { useNavigation } from '@react-navigation/native';


const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const HomeScreen = () => {
    const dispatch = useDispatch();

    const loading = useSelector(state => state.common.initialLoading);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getUser())
        dispatch(getCommonData())
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())

        Promise.all([_2, _3]).then(() => {
            dispatch(initialLoadingComplete());
        });

    }, []);


    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "ios")
                return;
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('dark-content');
            return () => {
                StatusBar.setTranslucent(true)
            }
        }, [])
    );

    if (loading) {
        return <PageLoading spinnerColor="#0000ff" />
    }

    return (
        <>
            <RenderUpdateChecker />
            <ScrollView contentContainerStyle={styles.container} style={styles.mainContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#000000"
                    />
                }
            >
                <UserDetails />
                <View style={styles.gamesContainer}>
                    <SelectGameMode />
                    <WinnersScroller />
                    <SwiperFlatList content
                        ContainerStyle={styles.leaderboardContainer}></SwiperFlatList>
                </View>
            </ScrollView>
            <Events />
        </>
    );
}
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
            dispatch(getUser());
        }, [])
    );

    return (
        <View style={styles.userDetails}>
            <UserWallet balance={user.walletBalance ?? 0} />
            <UserItems showBuy={Platform.OS === 'ios' ? false : true} />
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


function RenderUpdateChecker() {

    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);

    if (minVersionCode && Constants.expoConfig.extra.isDevelopment !== "true") {
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }

    notifyOfPublishedUpdates();

    return null;
}

const Events = () => {
    const navigation = useNavigation();

    return (
        <Pressable style={styles.gameButton}  onPress={() => navigation.navigate('ListofGames')}>
            {/* <LottieAnimations
                animationView={require('../../../assets/joystick.json')}
                width={normalize(60)}
                height={normalize(60)}
            /> */}
            <Image
                source={require('../../../assets/images/black-gamepad.png')}
                style={styles.gamepad}
            />
            {/* <Text style={styles.gameText}>Games</Text> */}
        </Pressable>
    )
}



const styles = EStyleSheet.create({
    container: {
        // flex: 1,
        paddingBottom: normalize(10),
        backgroundColor: '#FFFF',
    },
    mainContainer: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    gamesContainer: {
        paddingHorizontal: '1.2rem',
        backgroundColor: '#FFFF',
        paddingBottom: '2.5rem'
    },
    leaderboardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    userDetails: {
        backgroundColor: '#072169',
        paddingBottom: normalize(15),
        paddingHorizontal: normalize(20),
    },
    wallet: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletText: {
        fontSize: '1.2rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(2),
        marginTop: normalize(5)
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
    gameButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        width: responsiveScreenWidth(20),
        height: responsiveScreenWidth(20),
        elevation: 5,
        backgroundColor: '#072169',
        position: 'absolute',
        right: 0,
        bottom: 50,
        marginVertical: normalize(30),
        marginHorizontal: normalize(12)
    },
    gameText: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',

    },
    gamepad: {
        width: responsiveScreenWidth(18),
        height: responsiveScreenWidth(18),
        marginTop:'.5rem'

    }
});