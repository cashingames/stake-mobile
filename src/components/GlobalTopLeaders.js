import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import TopLeader from '../components/TopLeader';



function GlobalTopLeaders({ leaders }) {

    return (
        <View style={styles.content}>
            {/* {games.map( (game: any) =><GameCard game={game} />)} */}
            <TopLeader podPosition={require('../../assets/images/position3.png')} name='Zubby Nwajigba' point='3000' avatar={require('../../assets/images/user-icon.png')}/>
            <TopLeader podPosition={require('../../assets/images/position1.png')} name='Joy Bewa' point='8000' avatar={require('../../assets/images/user-icon.png')} />
            <TopLeader podPosition={require('../../assets/images/position2.png')} name='Chimdia Anyiam' point='5000' avatar={require('../../assets/images/user-icon.png')} />

        </View>
    )
}
export default GlobalTopLeaders;

const styles = StyleSheet.create({

    title: {
        fontSize: normalize(15),
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(15),
        marginTop: normalize(10),
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
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    },

});
