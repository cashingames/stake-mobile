import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, ScrollView, StatusBar, Platform, RefreshControl } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import Animated, { BounceInRight } from 'react-native-reanimated';
import normalize from '../../utils/normalize';
import { isTrue, formatCurrency } from '../../utils/stringUtl';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { fetchFeatureFlags, getCommonData, initialLoadingComplete } from '../CommonSlice';
import UserItems from '../../shared/UserItems';
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../../utils/utils';
import crashlytics from '@react-native-firebase/crashlytics';
import LottieAnimations from '../../shared/LottieAnimations';
import SelectGameMode from '../Games/SelectGameMode';
import { getLiveTriviaStatus } from '../LiveTrivia/LiveTriviaSlice';
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
        dispatch(getLiveTriviaStatus())
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
        if (Constants.manifest.extra.isDevelopment) {
            return;
        }
        //whether we are forcing or not, show the first time
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }, [minVersionCode]);


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
                    <WinnersScroller />
                    <SwiperFlatList contentContainerStyle={styles.leaderboardContainer}>
                    </SwiperFlatList>
                </View>
            </ScrollView>
        </View>
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
            // console.info('UserDetails focus effect')
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
    headContainer: {
        backgroundColor: '#FAC502',
        // flex:1
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
});