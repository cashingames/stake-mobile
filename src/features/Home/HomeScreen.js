import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, ScrollView, StatusBar, Platform, RefreshControl, Pressable, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import Animated, { BounceInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import normalize, {
    responsiveHeight, responsiveScreenWidth
} from '../../utils/normalize';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
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
import { setGameMode, setGameType } from '../Games/GameSlice';
import logToAnalytics from '../../utils/analytics';
import { Ionicons } from '@expo/vector-icons';
import UserWalletAccounts from '../../shared/UserWalletAccounts';


const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const HomeScreen = () => {
    const dispatch = useDispatch();

    const loading = useSelector(state => state.common.initialLoading);
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector(state => state.auth.user);
    console.log(user)

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
            dispatch(getUser());
            dispatch(getCommonData());
        }, [])
    );


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
                <UserProfile user={user} />
                <UserWalletAccounts user={user} />
                {/* <UserDetails /> */}
                {/* <View style={styles.gamesContainer}>
                    <SelectGameMode />
                    <WinnersScroller />
                    <SwiperFlatList content
                        ContainerStyle={styles.leaderboardContainer}></SwiperFlatList>
                </View> */}
            </ScrollView>
            {/* <RenderEvents /> */}
        </>
    );
}
export default HomeScreen;

const UserProfile = ({ user }) => {
    return (
        <View style={styles.userProfileContainer}>
            <View style={styles.userProfileLeft}>
                <Image
                    style={styles.avatar}
                    source={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/home-avatar.png")}

                />
                <View style={styles.nameMainContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.welcomeText}>Hi, </Text>
                        <Text style={styles.usernameText}>{user.username}</Text>
                        <Ionicons name='chevron-forward-sharp' size={20} color='#072169' />
                    </View>
                    <Text style={styles.greetingText}>Good Morning 🙌🏻</Text>
                </View>
            </View>
            <View style={styles.notificationContainer}>
                <Ionicons name='mail-unread' size={40} color='#072169' />
                <View style={styles.numberContainer}>
                    <Text style={styles.number}>{user.unreadNotificationsCount}</Text>
                </View>
            </View>
        </View>
    )
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

const RenderEvents = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const features = useSelector(state => state.common.featureFlags);
    const isChallengeFeatureEnabled = features['enable_challenge'] !== undefined && features['enable_challenge'].enabled == true;
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const gameType = useSelector(state => state.common.gameTypes[0]);
    const user = useSelector(state => state.auth.user);

    const selectTriviaMode = () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        logToAnalytics("game_mode_selected_with_gamepad", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'gamemode': gameMode.displayName,
        })
        navigation.navigate('SelectGameCategory')

    }

    const onSelectGameMode = async () => {
        if (isChallengeFeatureEnabled) {
            logToAnalytics("game_entry_with_gamepad", {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email,
            })
            navigation.navigate('GamesList')
            return;
        }
        selectTriviaMode();
    };

    return (
        <Pressable style={styles.gameButton} onPress={onSelectGameMode}>
            <Image
                source={require('../../../assets/images/black-gamepad.png')}
                style={styles.gamepad}
            />
        </Pressable>
    )
}

const styles = EStyleSheet.create({
    container: {
        // flex: 1,
        paddingTop: responsiveScreenWidth(20),
        paddingHorizontal: normalize(20),
        backgroundColor: '#EFF2F6',
    },
    mainContainer: {
        backgroundColor: '#EFF2F6',
        flex: 1,
    },
    avatar: {
        width: normalize(55),
        height: normalize(55),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
    },
    nameMainContainer: {
        marginLeft: '1rem'
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    welcomeText: {
        fontSize: '1.1rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
    },
    usernameText: {
        fontSize: '1.1rem',
        color: '#072169',
        fontFamily: 'sansation-bold',
    },
    greetingText: {
        fontSize: '1rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
    },
    notificationContainer: {
        alignItems: 'center'
    },
    numberContainer: {
        backgroundColor: '#FF3B81',
        borderRadius: 100,
        width: '1.1rem',
        height: '1.1rem',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 32,
    },
    number: {
        fontSize: '.55rem',
        color: '#FFFF',
        fontFamily: 'sansation-regular',
    },
    userProfileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userProfileLeft: {
        flexDirection: 'row',
        alignItems: 'center'
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
    walletContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    wallet: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    walletText: {
        fontSize: '1.2rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(2),
        marginTop: normalize(5)
    },
    demoText: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginRight: normalize(8),
        marginTop: normalize(5)
    },
    demoAmount: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginRight: normalize(8),
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
        width: responsiveScreenWidth(15),
        height: responsiveScreenWidth(15),
        backgroundColor: '#FAC502',
        position: 'absolute',
        right: 10,
        bottom: 10,
        marginVertical: normalize(30),
        marginHorizontal: normalize(12),
        elevation: 5, // Android
    },
    gameText: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    gamepad: {
        width: responsiveScreenWidth(10),
        height: responsiveScreenWidth(10),
        marginTop: '.5rem'
    }
});