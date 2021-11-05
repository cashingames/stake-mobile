import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBack from '../components/HeaderBack';

export default function UserStats({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('UserProfile')} />
                    <Text style={styles.headerTextStyle}>Stats</Text>
                </View>
                <View style={styles.content}>
                    <UserRank userRank='Master' userPoint={5000} />
                    <Detail />
                    <GamesPlayed />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const UserRank = ({ userRank, userPoint }) => {
    return (
        <View style={styles.rank}>
            <View>
                <Text style={styles.rankText}>{userRank}</Text>
                <Text style={styles.pointText}>{userPoint}points</Text>
            </View>
            <Image
                // style={styles.avatar}
                source={require('../../assets/images/trophy-cup.png')}
            />
        </View>
    )
}

const Detail = () => {
    return (
        <>
            <View style={styles.groupDetail}>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Nickname</Text>
                    <Text style={styles.responseText}>Holygrail</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Real Name</Text>
                    <Text style={styles.responseText}>Hilary Duff</Text>
                </View>
            </View>
            <View style={styles.groupDetail}>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Games Played</Text>
                    <Text style={styles.responseText}>107</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Global Ranking</Text>
                    <Text style={styles.responseText}>50</Text>
                </View>
            </View>
            <View style={styles.groupDetail}>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Win Rate</Text>
                    <Text style={styles.responseText}>49</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Position</Text>
                    <Text style={styles.responseText}>Master</Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailText}>Challenges Played</Text>
                    <Text style={styles.responseText}>78</Text>
                </View>
            </View>
        </>
    )
}

const GamePlayed = ({ gameCard, gameName }) => {
    return (
        <View style={styles.gameInfo}>
            <Image
                // style={styles.avatar}
                source={gameCard}
            />
            <Text style={styles.gameName}>{gameName}</Text>
        </View>
    )
}

const GamesPlayed = () => {
    return (
        <View>
            <Text style={styles.gamesTitle}>Games Played</Text>
            <View style={styles.gamesPlayed}>
                <GamePlayed gameCard={require('../../assets/images/music.png')} gameName='Naija Music' />
                <GamePlayed gameCard={require('../../assets/images/music.png')} gameName='Naija Music' />
                <GamePlayed gameCard={require('../../assets/images/music.png')} gameName='Naija Music' />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        // marginVertical: normalize(20)
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
    },
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(25),
        marginBottom: normalize(20)

    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
        backgroundColor: '#FFFF',
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    rank: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#151C2F',
        paddingVertical: normalize(25),
        paddingHorizontal: normalize(15),
        borderRadius: 16
    },
    rankText: {
        fontSize: normalize(20),
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
    pointText: {
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#828282',
    },
    detail: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    groupDetail: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        paddingVertical: normalize(15)
    },
    detailText: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#757575',
        marginBottom: normalize(10),
    },
    responseText: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#151C2F',
    },
    gameInfo: {
        backgroundColor: '#EA5038',
        flexDirection:'row',
        alignItems:'center',
        paddingVertical: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(15),
        borderRadius: 9,
        marginBottom: normalize(10),
      
    },
    gamesPlayed: {
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-between'
    },
    gamesTitle: {
        fontSize: normalize(15),
        fontFamily: 'graphik-regular',
        color: '#000000',
        marginVertical: normalize(12),
    },
    gameName: {
        fontSize: normalize(13),
        fontFamily: 'graphik-bold',
        color: '#FFFF',
        width: normalize(60),
        marginLeft: normalize(10),
    }
});
