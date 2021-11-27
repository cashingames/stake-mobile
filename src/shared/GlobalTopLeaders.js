import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import normalize from '../utils/normalize';
import TopLeader from './TopLeader';


function GlobalTopLeaders({ leaders }) {

    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { first_name: "..." };
    const secondLeader = topLeaders[1] ?? { first_name: "..." };
    const thirdLeader = topLeaders[2] ?? { first_name: "..." };
    return (
        <View style={styles.content}>
            {topLeaders.length > 0 ? <>
                <TopLeader
                    podPosition={require('../../assets/images/position3.png')}
                    name={`${thirdLeader.first_name} ${thirdLeader.last_name}`}
                    point={thirdLeader.points}
                    avatar={thirdLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position1.png')}
                    name={`${firstLeader.first_name} ${firstLeader.last_name}`}
                    point={firstLeader.points}
                    avatar={firstLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position2.png')}
                    name={`${secondLeader.first_name} ${thirdLeader.last_name}`}
                    point={secondLeader.points}
                    avatar={secondLeader.avatar} />
            </> : <></>
            }
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
