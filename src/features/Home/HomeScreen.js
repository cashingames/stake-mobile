import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, ScrollView, Platform, RefreshControl, Pressable } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, {
    responsiveHeight, responsiveScreenWidth
} from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { getCommonData, initialLoadingComplete } from '../CommonSlice';
import { Ionicons } from '@expo/vector-icons';
import UserAvailabeBoosts from './UserAvailabeBoosts';
import UpdatesChecker from './UpdatesChecker';
import logToAnalytics from '../../utils/analytics';
import GamesCardsList from '../../shared/GameCardsList';
import { formatCurrency } from '../../utils/stringUtl';
import MarketingPromotionCards from '../MarketingPromotions/MarketingPromotionCards';


const wait = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const HomeScreen = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.common.initialLoading);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getUser())
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        const _1 = dispatch(getUser());
        const _2 = dispatch(getCommonData());

        Promise.all([_1, _2]).then(() => {
            dispatch(initialLoadingComplete());
        });

    }, []);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getUser());
        }, [])
    );

    if (loading) {
        return <PageLoading spinnerColor="#0000ff" />
    }

    return (
        <>
            <UpdatesChecker />
            <ScrollView contentContainerStyle={styles.container} style={styles.mainContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#000000"
                    />
                }
            >
                <UserProfile />
                <UserAvailabeBoosts />
                <GamesCardsList />
                <MarketingPromotionCards />
            </ScrollView>
        </>
    );
}

export default HomeScreen;

const UserProfile = () => {
    const navigation = useNavigation();

    const user = useSelector(state => state.auth.user);
    const totalWalletBalance = Number.parseFloat(user.walletBalance ?? 0) + Number.parseFloat(user.bonusBalance ?? 0)

    const displayName = user.firstName ?? user.username;
    const getAvatarInitials = () => {
        if (user.firstName) {
            return user.firstName?.charAt(0) + '' + user.lastName?.charAt(0)
        } else {
            return user.username?.charAt(0)
        }
    }

    const viewWallet = () => {
        logToAnalytics("wallet_amount_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('Wallet')
    }

    return (
        <View style={styles.userProfileContainer}>
            <View style={styles.userProfileLeft}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getAvatarInitials()}</Text>
                </View>
                <Pressable style={styles.nameMainContainer} onPress={() => navigation.navigate('UserProfile')}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.welcomeText}>Hello </Text>
                        <Text style={styles.usernameText} numberOfLines={1}>{displayName}</Text>
                        <Ionicons name='chevron-forward-sharp' size={20} color='#072169' style={{ marginTop: 4 }} />
                    </View>
                </Pressable>
            </View>
            <Pressable style={styles.walletContainer} onPress={viewWallet}>
                <Text style={styles.balanceCurrency}>NGN {formatCurrency(totalWalletBalance)}</Text>
                <Ionicons name='chevron-forward-sharp' size={20} color='#072169' style={{ marginTop: 0.5 }} />
            </Pressable>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        // flex: 1,
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(15) : responsiveScreenWidth(13),
        paddingHorizontal: normalize(18),
        backgroundColor: '#EFF2F6',
        paddingBottom: responsiveScreenWidth(3)
    },
    mainContainer: {
        backgroundColor: '#EFF2F6',
        flex: 1,
    },
    avatar: {
        width: normalize(50),
        height: normalize(50),
        backgroundColor: '#FDCCD4',
        borderRadius: 100,
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: '1.1rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
        textTransform: 'uppercase'
    },
    nameMainContainer: {
        marginLeft: '.3rem'
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: responsiveScreenWidth(20),
    },
    welcomeText: {
        fontSize: '.95rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
    },
    usernameText: {
        fontSize: '.95rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
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
        fontSize: '.9rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
    },
    balanceDigit: {
        fontSize: '.9rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
    }
});