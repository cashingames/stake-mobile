import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import HeaderBack from '../components/HeaderBack';

const Toptab = createMaterialTopTabNavigator();

export default function GameBoosts({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('Dashboard')} />
                    <Text style={styles.headerTextStyle}>Store</Text>
                </View>
                <View style={styles.content}>
                    <GamesTabs />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const WinBig = () => {
    return (
        <View style={styles.winBig}>
            <Text style={styles.winText}>Play today to win big</Text>
            <Image
                source={require('../../assets/images/big_gamepad.png')}
            />
        </View>
    )
}

const BoostCard = ({ boost }) => {
    return (
        <TouchableOpacity>
            <View style={styles.boostContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={boost.boostIcon}
                        style={styles.boostIcon}
                    />
                    <View style={styles.hr}><Text></Text></View>
                </View>
                <Text style={styles.boostName}>{boost.boostName}</Text>
                <Text style={styles.number}>{boost.numberOfBoost}</Text>
                <Text style={styles.description}>{boost.boostDescription}</Text>
                <View style={styles.buy}>
                    <Text style={styles.buyWithPoint}>{boost.boostPointAmount}pts</Text>
                    <Text style={styles.buyWithCash}>&#8358;{boost.boostCurrencyAmount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const BoostCards = () => {
    const boosts = [
        {
            id: 1,
            boostIcon: require('../../assets/images/time_freeze.png'),
            numberOfBoost: "x5",
            boostName: 'Time Freeze',
            boostDescription: 'Time freeze for 15 seconds',
            boostPointAmount: 500,
            boostCurrencyAmount: 246.50
        },
        {
            id: 2,
            boostIcon: require('../../assets/images/skip.png'),
            numberOfBoost: "x3",
            boostName: 'Skip',
            boostDescription: 'Answer a different question',
            boostPointAmount: 500,
            boostCurrencyAmount: 246.50
        },
        {
            id: 3,
            boostIcon: require('../../assets/images/malware.png'),
            numberOfBoost: "x3",
            boostName: 'Bomb',
            boostDescription: 'Removes two wrong answers',
            boostPointAmount: 500,
            boostCurrencyAmount: 246.50
        }
    ]
    return (
        <View style={styles.availableBoosts1}>
            <Text style={styles.title}>Get Boosts</Text>
            <View style={styles.boostCards}>
                {boosts.map((boost) => <BoostCard boost={boost} />)}
            </View>
        </View>

    )
}

const MyItem = ({ boost }) => {
    return (
        <TouchableOpacity>
            <View style={styles.boostContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={boost.boostIcon}
                        style={styles.boostIcon}
                    />
                    <View style={styles.hr}><Text></Text></View>
                </View>
                <Text style={styles.boostName}>{boost.boostName}</Text>
                <Text style={styles.number}>{boost.numberOfBoost}</Text>
                <Text style={styles.description}>{boost.boostDescription}</Text>
            </View>
        </TouchableOpacity>
    )
}

const MyItems = () => {
    const boosts = [
        {
            id: 1,
            boostIcon: require('../../assets/images/time_freeze.png'),
            numberOfBoost: "x5",
            boostName: 'Time Freeze',
            boostDescription: 'Time freeze for 15 seconds',
        },
        // {
        //     id: 2,
        //     boostIcon: require('../../assets/images/skip.png'),
        //     numberOfBoost: "x3",
        //     boostName: 'Skip',
        //     boostDescription: 'Answer a different question',
        // },
        // {
        //     id: 3,
        //     boostIcon: require('../../assets/images/malware.png'),
        //     numberOfBoost: "x3",
        //     boostName: 'Bomb',
        //     boostDescription: 'Removes two wrong answers',
        // }
    ]
    return (
        <View style={styles.availableBoosts1}>
            <View style={styles.boostCards}>
                {boosts.map((boost) => <MyItem boost={boost} />)}
            </View>
        </View>

    )
}



const GamesTabs = () => {

    return (
        <Toptab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 12, fontFamily: 'graphik-medium', },
            tabBarStyle: { backgroundColor: '#FFFF' },
            tabBarInactiveTintColor: '#7C7D7F',
            tabBarActiveTintColor: '#151C2F',
            tabBarIndicatorStyle: { backgroundColor: '#EB5757' },
        }}
            sceneContainerStyle={{ backgroundColor: '#F8F9FD' }}
            style={{ height: Dimensions.get('window').height }}
        // height: Dimensions.get('window').height
        >
            <Toptab.Screen name="Boosts" component={BoostCards} />
            <Toptab.Screen name="My Items" component={MyItems} />
        </Toptab.Navigator>
    )
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        // marginVertical: normalize(20)
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
    },
    content: {
        // marginHorizontal: normalize(18),

    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    availableBoosts1: {
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(20),
    },
    iconContainer: {
        backgroundColor: '#FFFF',
        alignItems: 'center',
        height: normalize(75),
        width: normalize(55),
        borderRadius: 10,
        elevation: 12,
    },
    boostCards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    boostContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFF',
        borderRadius: 11,
        marginBottom: normalize(20),
        width: normalize(130),
        borderWidth: normalize(1),
        borderColor: '#E0E0E0',
        paddingBottom: normalize(15),
        paddingHorizontal: normalize(10),
    },
    boostIcon: {
        marginTop: normalize(12),
        width: normalize(26),
        height: normalize(26),
    },
    hr: {
        borderBottomColor: '#F8A700',
        borderBottomWidth: normalize(5),
        width: normalize(23),
        borderRadius: 5,
        opacity: 0.4
    },
    boostName: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#EF2F55',
        marginTop: normalize(10),
    },
    number: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(8),
        color: '#FF932F',
        marginTop: normalize(4),
    },
    description: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(7),
        color: '#828282',
        marginTop: normalize(4),
        textAlign: 'center'
    },
    buy: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(4),
    },
    buyWithPoint: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: 'rgba(21, 28, 47, 0.6)',
        marginRight: normalize(15)
    },
    buyWithCash: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(8),
        color: '#151C2F',
    },
    winBig: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
        marginVertical: normalize(22),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    winText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        color: '#151C2F',
        width: normalize(130),
    },
    progress: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(15),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    progressText: {
        width: normalize(160),
    },
    progressTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(20),
        color: '#151C2F',
    },
    text: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(10),
        color: '#7C7D7F',
    },
    createQuiz: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        borderRadius: 8,
        marginBottom: normalize(20),
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    quiz: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectCategory: {
        marginTop: normalize(22),
    },
    categoryTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(14),
        color: '#151C2F',
        marginBottom: normalize(10),
    },
    create: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(12),
        color: '#EF2F55',
    },
    card: {
        backgroundColor: '#9C3DB8',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
        width: normalize(130),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
    },
    cardIcon: {},
    cardTitle: {
        fontSize: normalize(12),
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginTop: normalize(8),
    },
    cardInstruction: {
        fontSize: normalize(10),
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    games: {
        paddingVertical: normalize(10),
        marginRight: normalize(5)
    },
    title: {
        fontSize: normalize(22),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        // marginVertical: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        // marginTop: normalize(18),
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    tabs: {
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    select: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },
    uncheckIcon: {
        backgroundColor: '#FFFF',
    },
    selected: {
        display: 'flex'
    },
    clickButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
    },
    gameButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: '#151C2F',
        textAlign: 'center'
    },
    available: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    myQuiz: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: normalize(50)
    },
    didYouKnow: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(13),
        color: '#333333',
    },
    editQuiz: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(11),
        color: '#EF2F55',
    }
});
