import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";


import { useNavigation } from '@react-navigation/core';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import normalize from '../../utils/normalize';

import DashboardScreen from '../../screens/DashboardScreen';

const AppStack = createDrawerNavigator();

const HomeRouter = () => {
    // const MenuButton = (
    //     <View>
    //         <TouchableOpacity onPress={() => { /* AND NOW?! */ }}>
    //             <Icon name="bars" style={{ color: 'white', padding: 10, marginLeft: 10, fontSize: 20 }} />
    //         </TouchableOpacity>
    //     </View>
    // );
    const AppMainHeaderOptions = () => {
        return {
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerRight: (props) => <RightButtons {...props} />,
            headerRightContainerStyle: {
                paddingRight: normalize(15),
            }
        };
    }

    return (
        <AppStack.Navigator
            initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={AppMainHeaderOptions}>
            <AppStack.Screen name="Home" component={DashboardScreen} options={{ title: 'Home' }} />
        </AppStack.Navigator>
    );
}

const RightButtons = ({ options }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../../assets/images/Home.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GameScreen')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../../assets/images/gamepad.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('WalletScreen')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../../assets/images/smallpurse.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={drawStyles.container}>
            <View style={drawStyles.sideHeader}>
                <Image
                    style={drawStyles.logo}
                    source={require('../../../assets/images/favicon.png')}
                />
                <Text style={drawStyles.userName}> {"Oyesola Ogundele"}</Text>
                <Text style={drawStyles.userPhone}> {"Username"}</Text>
            </View>

            <View style={drawStyles.menu}>
                <DrawerItemList labelStyle={drawStyles.itemLabel} activeTintColor="#CE0303"  {...props} />
            </View>

            <DrawerItem
                label="Help"
                onPress={() => Linking.openURL('https://mywebsite.com/help')}
            />

            <DrawerItem
                label="Help"
                onPress={() => Linking.openURL('https://mywebsite.com/help')}
            />

            <DrawerItem
                label="Help"
                onPress={() => Linking.openURL('https://mywebsite.com/help')}
            />

            <DrawerItem
                label="Help"
                onPress={() => Linking.openURL('https://mywebsite.com/help')}
            />

            <BorderlessButton onPress={() => { }} style={styles.logoutContainer}>
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
        // flex: 1,
        height: '100%',
    },
    sideHeader: {
        // flex: 1,
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
        width: normalize(100),
        height: normalize(80),
    },
    userName: {
        fontSize: normalize(21),
        fontFamily: 'Roboto_900Black',
        color: '#181818',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    userPhone: {
        color: '#545252',
        fontSize: normalize(12),
        fontFamily: 'Roboto_400Regular',
        marginVertical: normalize(10),
    },
    viewProfile: {
        fontSize: normalize(12),
        color: '#2B4257',
        fontFamily: 'Roboto_700Bold',
        fontWeight: '700',
        lineHeight: normalize(14),
        textTransform: 'uppercase',
    },
    menu: {
        flex: 2,
        paddingVertical: normalize(40),
    },
    itemLabel: {
        textTransform: 'uppercase',
        fontFamily: 'Roboto_900Black',
        fontWeight: "900",
    },
});


export default HomeRouter