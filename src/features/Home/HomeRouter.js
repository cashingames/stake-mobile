import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/core';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';

import normalize, { responsiveScreenHeight } from '../../utils/normalize';
import HomeScreen from './HomeScreen';
import WalletScreen from '../Transactions/WalletScreen';
import { logoutUser } from '../Auth/AuthSlice';
import { isTrue } from '../../utils/stringUtl';

import AppButton from '../../shared/AppButton';
// import LottieAnimations from '../../shared/LottieAnimations';
// import HowToWin from '../HowToWin/HowToWin';


const HomeStack = createDrawerNavigator();

const HomeRouter = () => {
    const loading = useSelector(state => state.common.initialLoading);

    const AppMainHeaderOptions = () => {
        return {
            headerShown: !loading,
            drawerType: "slide",
            drawerStyle: {
                width: '85%',
            },
            headerRight: (props) => <RightButtons {...props} />,
            headerRightContainerStyle: {
                paddingRight: normalize(20),
            },
            headerStyle: {
                backgroundColor: '#FAC502',
            },
            headerTitleStyle: {
                fontSize: normalize(20),
                lineHeight: normalize(20),
                color: "#000000",
                fontFamily: 'graphik-medium',
            },
            headerShadowVisible: true,
        };
    }

    return (
        <HomeStack.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={AppMainHeaderOptions}>
            <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <HomeStack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
            {/* <HomeStack.Screen name="HowToWin" component={HowToWin} options={{ title: 'How to win' }} /> */}


        </HomeStack.Navigator>
    );
}

const RightButtons = () => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    // console.log(user)
    const route = useRoute();

    const routeName = route.name

    return (
        <View style={styles.headerIcons}>

            <Pressable style={[styles.headerIconContainer, routeName === 'Home' ? styles.activeHeaderIcon : {}]} onPress={() => navigation.navigate('Home')}>
                <Ionicons name='home-outline' size={26} />
                <Text style={styles.headerIconText}>Home</Text>
            </Pressable>
            < Pressable style={[styles.headerIconContainer, routeName === 'Wallet' ? styles.activeHeaderIcon : {}]} onPress={() => navigation.navigate('Wallet')}>
                <Ionicons name='wallet-outline' size={26} style={[styles.headerIcon, routeName === 'Wallet' ? styles.activeHeaderIcon : {}]} />
                <Text style={styles.headerIconText}>Wallet</Text>
            </Pressable>

            <Pressable style={[styles.headerIconContainerNot, routeName === 'Notifications' ? styles.activeHeaderIcon : {}]} onPress={() => navigation.navigate('Notifications')}>
                <View style={styles.notificationContainer}>
                    <Ionicons name='notifications-outline' size={26} style={[styles.headerIcon, routeName === 'Notifications' ? styles.activeHeaderIcon : {}]} />
                    {user.unreadNotificationsCount !== 0 &&
                        <View style={styles.numberContainer}>
                            <Text style={styles.number}>{user.unreadNotificationsCount}</Text>
                        </View>
                    }

                </View>
            </Pressable>
        </View >
    )
}

function CustomDrawerContent(props) {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user)

    const onLogout = () => {
        dispatch(logoutUser());
    }

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={drawStyles.container}>
            <ScrollView>
                <View style={drawStyles.sideHeader}>
                    <Image
                        style={drawStyles.avatar}
                        source={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}
                    />
                    <Text style={drawStyles.userTitle}> {user.fullName}</Text>
                    <Text style={drawStyles.userName}> @{user.username}</Text>
                    <AppButton text="View Profile" style={drawStyles.profile} textStyle={drawStyles.profileText} onPress={() => navigation.navigate('UserProfile')} />

                </View>


                <View style={drawStyles.menu}>
                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>Live Trivia</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('LiveTrivias')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />
                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>My Challenges</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('MyChallenges')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />
                    {Platform.OS === 'ios' ?
                        <></>
                        :
                        <DrawerItem
                            label={() =>
                                <View style={drawStyles.item}>
                                    <Text style={drawStyles.itemLabel}>Store</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                                </View>}
                            onPress={() => navigation.navigate('GameStore')}
                            activeTintColor='#EF2F55'
                            style={drawStyles.label}
                            labelContainerStyle
                        />
                    }
                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>Leaderboards</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('Leaderboard')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />

                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>Get Help</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('Help')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />
                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>Invite Friends</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('Invite')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />

                </View>
            </ScrollView>
            <View style={drawStyles.logoutContainer}>
                <Text style={drawStyles.appVersion}>App version: {Constants.manifest.version}</Text>
                <Pressable onPress={onLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
            </View>


        </DrawerContentScrollView>
    );
}

const styles = EStyleSheet.create({
    headerIcons: {
        flexDirection: 'row',
    },
    headerIconContainer: {
        opacity: 0.5,
        alignItems: 'center',
        marginLeft: '1.3rem',
    },
    headerIconContainerNot: {
        opacity: 0.5,
        alignItems: 'center',
        marginLeft: '1.3rem',
        marginTop: '.5rem'
    },
    headerIconText: {
        fontSize: '0.5rem',
        fontFamily: 'graphik-medium',
    },
    activeHeaderIcon: {
        opacity: 1
    },
    notificationContainer: {
        flexDirection: 'row',
    },
    numberContainer: {
        backgroundColor: '#518EF8',
        position: 'absolute',
        left: 22,
        top: 0,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 100,
        width: normalize(22),
        height: normalize(22),
        alignItems: 'center',
        justifyContent: 'center',
    },
    number: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: Platform.OS === 'ios' ? '0.43rem' : '0.43rem',
        // marginTop: Platform.OS === 'ios' ? normalize(3) : normalize(.5),
    },
    logoutText: {
        color: '#EF2F5F',
        textAlign: 'center',
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        paddingVertical: responsiveScreenHeight(1),

    },
});

const drawStyles = EStyleSheet.create({
    container: {
        flex: 1,
    },
    sideHeader: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        paddingTop: responsiveScreenHeight(6),
        paddingBottom: responsiveScreenHeight(2),
        backgroundColor: '#F2F5FF',
    },
    avatar: {
        width: normalize(90),
        height: normalize(90),
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 100
    },
    userTitle: {
        fontSize: '0.9rem',
        lineHeight: '0.9rem',
        fontFamily: 'graphik-medium',
        color: '#000000',
        marginTop: 10,
    },
    userName: {
        color: '#333333',
        fontSize: '0.7rem',
        lineHeight: '0.7rem',
        fontFamily: 'graphik-regular',
        opacity: 0.5,
        marginVertical: 10
    },
    profile: {
        backgroundColor: '#EF2F55',
        paddingVertical: 10,
        marginVertical: 0,
        borderRadius: 32,
    },
    profileText: {
        fontSize: '0.6rem',
        lineHeight: '0.6rem',
    },
    menu: {
        // flex: 7,
    },
    label: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: responsiveScreenHeight(0.4),
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemLabel: {
        color: '#151C2F',
        fontSize: '0.9rem',
        fontFamily: 'graphik-regular',
    },
    logoutContainer: {
        backgroundColor: '#FFFF',
        // flex: 1,
        // justifyContent: 'flex-end'
    },
    appVersion: {
        color: '#000000',
        fontSize: '0.8rem',
        lineHeight: '0.7rem',
        fontFamily: 'graphik-regular',
        opacity: 0.7,
        marginVertical: 10,
        textAlign: 'center',
    },
    numberContainer: {
        backgroundColor: '#518EF8',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 100,
        width: normalize(24),
        height: normalize(24),
        alignItems: 'center',
        justifyContent: 'center'
        // padding: '.1.5rem'
    },
    number: {
        textAlign: 'center',
        alignItems: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: Platform.OS === 'ios' ? '0.5rem' : '0.5rem',
        // marginTop: Platform.OS === 'ios' ? '.3rem' : '.081rem',
    },
    notificationCount: {
        flexDirection: 'row'
    }
});


export default HomeRouter