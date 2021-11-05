import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import OtherLeader from './OtherLeader';

function OtherLeaders({ othersAvatar, othersPoints, subLeaderFirstName, subLeaderLastName, position, indexArrow }) {
    return (
        <View style={styles.container}>
            <OtherLeader
                othersAvatar={require('../../assets/images/user-icon.png')}
                othersPoints='2500'
                subLeaderFirstName='Fluffy'
                subLeaderLastName='Oye'
                position='4'
                indexArrow={require('../../assets/images/up_arrow.png')}
            />
            <OtherLeader
                othersAvatar={require('../../assets/images/user-icon.png')}
                othersPoints='2000'
                subLeaderFirstName='Joy'
                subLeaderLastName='Richard'
                position='5'
                indexArrow={require('../../assets/images/up_arrow.png')}
            />
            <OtherLeader
                othersAvatar={require('../../assets/images/user-icon.png')}
                othersPoints='1500'
                subLeaderFirstName='Danielle'
                subLeaderLastName='Mark'
                position='4'
                indexArrow={require('../../assets/images/up_arrow.png')}
            />
        </View>
    );
}
export default OtherLeaders;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    headerTitle: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
    },
    headerIcons: {
        display: 'flex',
        flexDirection: 'row',

    },
    pageIcon: {
        marginLeft: normalize(30),
    },
    userDetails: {
        backgroundColor: '#151C2F',
        paddingTop: normalize(10),
        paddingRight: normalize(20),
        paddingLeft: normalize(20),
        paddingBottom: normalize(15),
    },
    icon: {

    },
    wallet: {
        display: 'flex',
        flexDirection: 'row',
    },
    walletText: {
        fontSize: normalize(16),
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(8),
    },
    points: {
        backgroundColor: '#01A7DB',
        borderRadius: normalize(10),
        marginTop: normalize(30),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: normalize(8),
        paddingRight: normalize(15),
        paddingLeft: normalize(6),
    },
    trophy: {
        // width: 100
    },
    pointsNumber: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    userPoint: {
        fontSize: normalize(20),
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    pointDetail: {
        color: '#FFFF',
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
    },
    userRanking: {
        backgroundColor: '#FFFF',
        borderRadius: normalize(10),
        marginTop: normalize(15),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: normalize(15),
    },
    gamesPlayed: {

    },
    globalRanking: {
        alignItems: 'flex-end'
    },
    rankNumber: {
        fontSize: normalize(20),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    rankDetail: {
        color: '#151c2f73',
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
    },
    games: {
        paddingHorizontal: normalize(20),
        paddingTop: normalize(10),
    },
    title: {
        fontSize: normalize(15),
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(15),
        marginTop: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: normalize(18),
    },
    card: {
        backgroundColor: '#9C3DB8',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
        width: normalize(133),
        borderRadius: normalize(7),
        marginRight: normalize(15),
    },
    cardInstruction: {
        fontSize: normalize(10),
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    cardTitle: {
        fontSize: normalize(12),
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginTop: normalize(8),
    },
    replay: {
        fontSize: normalize(10),
        color: '#EF2F55',
        fontFamily: 'graphik-regular',
    },
    musicIcon: {
    },

    playedTitle: {
        fontSize: 15,
        color: '#4F4F4F',
        fontFamily: 'graphik-bold',
        lineHeight: 17,
        marginTop: normalize(8),
    },
    leaderboard: {
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        marginBottom: normalize(30)
    },
    leaderboardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(8)
    },
    extended: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    extendedText: {
        fontSize: normalize(9),
        color: '#EF2F55',
        fontFamily: 'graphik-bold',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#FAC502',
        paddingHorizontal: normalize(30),
        paddingTop: normalize(25),
        borderRadius: 10,
    },
    position: {
        display: 'flex',
        alignItems: 'center',
    },
    leaderPoint: {
        alignItems: 'center',
    },
    point: {
        color: '#FFFF',
        fontSize: normalize(8),
        fontFamily: 'graphik-regular',
        backgroundColor: '#828282',
        paddingVertical: normalize(2),
        paddingHorizontal: normalize(6),
        borderRadius: 10,
        position: 'absolute',
        bottom: 10,
    },
    leaderName: {
        color: '#535761',
        fontSize: normalize(10),
        fontFamily: 'graphik-bold',
        width: normalize(75),
        textAlign: 'center',
    }
});
