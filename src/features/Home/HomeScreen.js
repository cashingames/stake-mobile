import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, ScrollView, StatusBar, Platform, RefreshControl, Image, Pressable } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import normalize, {
    responsiveHeight, responsiveScreenWidth
} from '../../utils/normalize';
import { formatCurrency, isTrue } from '../../utils/stringUtl';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { fetchFeatureFlags, getCommonData, initialLoadingComplete } from '../CommonSlice';
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../../utils/utils';
import { Ionicons } from '@expo/vector-icons';
import UserWalletAccounts from '../../shared/UserWalletAccounts';
import GamesCards from '../Games/GamesCards';
import LeaderboardCards from '../Leaderboard/LeaderboardCards';
import logToAnalytics from '../../utils/analytics';


const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const HomeScreen = () => {
    const dispatch = useDispatch();

    const loading = useSelector(state => state.common.initialLoading);
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector(state => state.auth.user);

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
            if (Platform.OS === "ios") {
                return
            }
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("#ffff")
            StatusBar.setBarStyle('dark-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBackgroundColor("#ffff")
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
                <GamesCards />
                <LeaderboardCards />
            </ScrollView>
        </>
    );
}
export default HomeScreen;

const UserProfile = ({ user }) => {
    const navigation = useNavigation();

    const viewNotifications = async () => {
        logToAnalytics("notification_button_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('Notifications')
    }

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
                        <Text style={styles.usernameText} onPress={() => navigation.navigate('UserProfile')}>{user.username}</Text>
                        <Ionicons name='chevron-forward-sharp' size={20} color='#072169' />
                    </View>
                    {/* <Text style={styles.greetingText}>Welcome 🙌🏻</Text> */}
                </View>
            </View>
            {/* <Pressable style={styles.notificationContainer} onPress={viewNotifications}>
                {user.unreadNotificationsCount !== 0 ?
                    <Ionicons name='mail-unread' size={40} color='#072169' /> :
                    <Ionicons name='mail' size={40} color='#072169' />
                }
                {user.unreadNotificationsCount !== 0 &&
                    <View style={styles.numberContainer}>
                        <Text style={styles.number}>{user.unreadNotificationsCount}</Text>
                    </View>
                }
            </Pressable> */}
            <Pressable style={styles.walletContainer} onPress={viewNotifications}>
                <Text style={styles.balanceCurrency}>NGN </Text>
                <Text style={styles.balanceDigit}>{formatCurrency(user.walletBalance ?? 0)}</Text>
                <Ionicons name='chevron-forward-sharp' size={20} color='#072169' />
            </Pressable>
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


const styles = EStyleSheet.create({
    container: {
        // flex: 1,
        paddingTop: responsiveScreenWidth(20),
        paddingHorizontal: normalize(18),
        backgroundColor: '#EFF2F6',
        paddingBottom: responsiveScreenWidth(10)
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
        marginLeft: '.3rem'
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
    },
    balanceCurrency: {
        fontSize: '1rem',
        color: '#072169',
        fontFamily: 'gotham-medium',
    },
    balanceDigit: {
        fontSize: '1rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
    }
});