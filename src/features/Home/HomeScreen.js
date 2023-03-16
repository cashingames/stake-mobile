import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, ScrollView, StatusBar, Platform, RefreshControl, Alert } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import Animated, { BounceInRight } from 'react-native-reanimated';
import normalize, {
    responsiveHeight
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

const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const HomeScreen = () => {
    const dispatch = useDispatch();

    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);
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

    useEffect(() => {
        if (Constants.expoConfig.extra.isDevelopment) {
            return;
        }
        //whether we are forcing or not, show the first time
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }, [minVersionCode]);


    useFocusEffect(
        React.useCallback(() => {

            if (loading || Constants.expoConfig.extra.isDevelopment) {
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
            if(Platform.OS === "ios")
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
                <SwiperFlatList contentContainerStyle={styles.leaderboardContainer}></SwiperFlatList>
            </View>
        </ScrollView>
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




const styles = EStyleSheet.create({
    container: {
        // flex: 1,
        paddingBottom: normalize(30),
        backgroundColor: '#FFFF',
    },
    mainContainer: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    gamesContainer: {
        paddingHorizontal: '1.2rem',
        backgroundColor: '#FFFF',
        paddingBottom:'2.5rem'
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
});