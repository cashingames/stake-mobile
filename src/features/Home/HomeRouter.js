import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/core';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import normalize from '../../utils/normalize';
import HomeScreen from './HomeScreen';
import WalletScreen from '../Transactions/WalletScreen';
import GameScreen from '../Games/GameScreen';
import { logoutUser } from '../Auth/AuthSlice';
import { isTrue } from '../../utils/stringUtl';

import { backendUrl } from '../../utils/BaseUrl';
import GameInProgressScreen from '../Games/GameInProgressScreen';

const HomeStack = createDrawerNavigator();

const HomeRouter = () => {

    const AppMainHeaderOptions = () => {
        return {
            drawerType: "slide",
            headerRight: (props) => <RightButtons {...props} />,
            headerRightContainerStyle: {
                paddingRight: normalize(15),
            },
            headerTitleStyle: {
                fontSize: normalize(20),
                color: "#000000",
                fontFamily: 'graphik-medium',
            },
            // headerShadowVisible: false,
            headerStyle: {
                // paddingTop: normalize(20)
            },
        };
    }

    return (
        <HomeStack.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={AppMainHeaderOptions}>
            <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <HomeStack.Screen name="Game" component={GameScreen} options={{ title: 'Game' }} />
            <HomeStack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
        </HomeStack.Navigator>
    );
}

const RightButtons = ({ options }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const routeName = route.name

    return (
        <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Ionicons style={[styles.pageIcon, routeName === 'Home' ? styles.activePageIcon : {}]} name='home-outline' size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Game')}>
                <Ionicons style={[styles.pageIcon, routeName === 'Game' ? styles.activePageIcon : {}]} name='game-controller-outline' size={32} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
                <Ionicons style={[styles.pageIcon, routeName === 'Wallet' ? styles.activePageIcon : {}]} name='wallet-outline' size={32} />
            </TouchableOpacity>
        </View>
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
            <View style={drawStyles.sideHeader}>
                <Image
                    style={drawStyles.avatar}
                    source={isTrue(user.avatar) ? { uri: `${backendUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}
                />
                <Text style={drawStyles.userTitle}> {user.fullName}</Text>
                <Text style={drawStyles.userName}> @{user.username}</Text>
                <TouchableOpacity style={drawStyles.profile}
                    onPress={() => navigation.navigate('UserProfile')}>
                    <Text style={drawStyles.viewProfile}>View Profile</Text>
                </TouchableOpacity>
            </View>


            <View style={drawStyles.menu}>
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
                <DrawerItem
                    label={() =>
                        <View style={drawStyles.item}>
                            <Text style={drawStyles.itemLabel}>Terms & Conditions</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                        </View>}
                    onPress={() => navigation.navigate('Terms')}
                    activeTintColor='#EF2F55'
                    style={drawStyles.label}
                    labelContainerStyle
                />
                <DrawerItem
                    label={() =>
                        <View style={drawStyles.item}>
                            <Text style={drawStyles.itemLabel}>Privacy Policy</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                        </View>}
                    onPress={() => navigation.navigate('Privacy')}
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
                <DrawerItem
                    label={() =>
                        <View style={drawStyles.item}>
                            <Text style={drawStyles.itemLabel}>Support</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                        </View>}
                    onPress={() => navigation.navigate('Support')}
                    activeTintColor='#EF2F55'
                    style={drawStyles.label}
                    labelContainerStyle
                />
            </View>
            <BorderlessButton onPress={onLogout} style={styles.logoutContainer}>
                <Text style={drawStyles.logoutText}>Logout</Text>
            </BorderlessButton>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageIcon: {
        marginLeft: normalize(20),
        color: '#aaa'
    },
    activePageIcon: {
        color: '#000'
    }
});

const drawStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sideHeader: {
        // flex: 2,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        paddingTop: normalize(35),
        paddingBottom: normalize(15),
        backgroundColor: '#F2F5FF',
    },
    avatar: {
        // resizeMode: 'cover',
        width: normalize(70),
        height: normalize(70),
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 100
    },
    userTitle: {
        fontSize: normalize(16),
        fontFamily: 'graphik-bold',
        color: '#000000',
        marginVertical: normalize(10)
    },
    userName: {
        color: '#333333',
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        marginBottom: normalize(10),
        opacity: 0.5
    },
    profile: {
        backgroundColor: '#EF2F55',
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(18),
        borderRadius: 32,
        marginVertical: normalize(10)
    },
    viewProfile: {
        fontSize: normalize(10),
        color: '#fff',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
    },
    menu: {
        flex: 2,
    },
    label: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: normalize(10),

    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemLabel: {
        color: '#151C2F',
        fontSize: normalize(16),
        fontFamily: 'graphik-regular',
    },
    logoutText: {
        color: 'red',
        textAlign: 'center',
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        // backgroundColor: 'green',
        paddingVertical: normalize(20),
    },
});


export default HomeRouter