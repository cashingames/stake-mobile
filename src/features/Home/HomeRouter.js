import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from '@react-navigation/core';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import normalize from '../../utils/normalize';
import HomeScreen from './HomeScreen';
import WalletScreen from '../Transactions/WalletScreen';
import GameScreen from '../Games/GameScreen';
import { logoutUser } from '../Auth/AuthSlice';

const HomeStack = createDrawerNavigator();

const HomeRouter = () => {

    const AppMainHeaderOptions = () => {
        return {
            headerRight: (props) => <RightButtons {...props} />,
            headerRightContainerStyle: {
                paddingRight: normalize(15),
            }
        };
    }

    return (
        <HomeStack.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={AppMainHeaderOptions}>
            <HomeStack.Screen name="Game" component={GameScreen} options={{ title: 'Game' }} />
            <HomeStack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
            <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        </HomeStack.Navigator>
    );
}

const RightButtons = ({ options }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../../assets/images/Home.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Game')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../../assets/images/gamepad.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../../assets/images/smallpurse.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

function CustomDrawerContent(props) {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logoutUser());
    }

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={drawStyles.container}>
            <View style={drawStyles.sideHeader}>
                <Image
                    style={drawStyles.logo}
                    source={require('../../../assets/images/user-icon.png')}
                />
                <Text style={drawStyles.userTitle}> {user.fullName}</Text>
                <Text style={drawStyles.userName}> @{user.username}</Text>
                <TouchableOpacity style={drawStyles.profile}><Text style={drawStyles.viewProfile}>View Profile</Text></TouchableOpacity>
            </View>

            <View style={drawStyles.menu}>
                <DrawerItem
                    label={() =>
                        <View style={drawStyles.labelName}>
                            <Text style={drawStyles.itemLabel}>Home</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                        </View>}
                    onPress={() => navigation.navigate('Home')}
                    activeTintColor='#EF2F55'
                    style={drawStyles.label}
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
        width: normalize(20),
        height: normalize(20),
    },
});

const drawStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    sideHeader: {
        // flex: 2,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
        paddingTop: normalize(35),
        paddingBottom: normalize(15),
    },
    logo: {
        resizeMode: 'contain',
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
    itemLabel: {
        color: '#151C2F',
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
    },
    label: {
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: normalize(10),
    },
    labelName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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