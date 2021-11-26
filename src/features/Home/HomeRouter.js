import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";


import { useNavigation } from '@react-navigation/core';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import normalize from '../../utils/normalize';

import DashboardScreen from '../../screens/DashboardScreen';

const AppStack = createDrawerNavigator();

const HomeRouter = () => {

    const AppMainHeaderOptions = () => {
        return {
            headerStyle: {
                // backgroundColor: '#f4511e',
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

export default HomeRouter