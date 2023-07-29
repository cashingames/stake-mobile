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
                        <Ionicons name='chevron-forward-sharp' size={20} color='#1C453B' style={{ marginTop: 4 }} />
                    </View>
                </Pressable>
            </View>
            <Pressable style={styles.walletContainer} onPress={viewWallet}>
                <Text style={styles.balanceCurrency}>NGN {formatCurrency(totalWalletBalance)}</Text>
                <Ionicons name='chevron-forward-sharp' size={20} color='#1C453B' style={{ marginTop: 0.5 }} />
            </Pressable>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        // flex: 1,
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(15) : responsiveScreenWidth(13),
        paddingHorizontal: normalize(16),
        backgroundColor: '#EFF2F6',
        paddingBottom: responsiveScreenWidth(3)
    },
    mainContainer: {
        backgroundColor: '#EFF2F6',
        flex: 1,
    },
    avatar: {
        width: normalize(51),
        height: normalize(51),
        backgroundColor: '#ccded48c',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: '1.1rem',
        color: '#1C453B',
        fontFamily: 'gotham-medium',
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
        color: '#1C453B',
        fontFamily: 'gotham-bold',
    },
    usernameText: {
        fontSize: '.95rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
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
    walletContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceCurrency: {
        fontSize: '.9rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
    },
});