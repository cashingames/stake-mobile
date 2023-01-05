import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';

import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { formatNumber, isTrue } from '../utils/stringUtl';

export default function OtherMonthlyLeaders({ leaders, otherStyles, otherName }) {
    const currentLeadedrs = leaders?.slice(3, leaders.length) ?? null;
    if (currentLeadedrs === null) {
        return <></>;
    }

    return (
        <View style={[styles.container, otherStyles]}>
            {currentLeadedrs.map((leader, i) => <OtherLeader key={i} leader={leader}
                position={formatNumber(i + 4)}
                indexArrow={require('../../assets/images/up_arrow.png')}
                otherName={otherName}
            />)}
            {currentLeadedrs.length === 0 && <Text style={otherLeaderStyles.noData}>No data</Text>}
        </View>
    );
}
function OtherLeader({ leader, position, indexArrow, otherName }) {
    return (
        <View style={otherLeaderStyles.container}>
            <View style={otherLeaderStyles.avatar}>
                <Image
                    style={otherLeaderStyles.profilePic}
                    source={isTrue(leader.avatar) ?
                        { uri: `${Constants.manifest.extra.assetBaseUrl}/${leader.avatar}` } :
                        require("../../assets/images/user-icon.png")}
                />
                <View style={otherLeaderStyles.username}>
                    <Text style={[otherLeaderStyles.names, otherName]}>{`${leader.username}`}</Text>
                    <Text style={otherLeaderStyles.point}>{formatNumber(leader.points)} pts</Text>
                </View>
            </View>
            <View style={otherLeaderStyles.position}>
                <View style={otherLeaderStyles.rank}>
                    <Text style={otherLeaderStyles.rankText}>{position}</Text>
                </View>
                {/* <Image
                    style={otherLeaderStyles.arrow}
                    source={indexArrow}
                /> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        // backgroundColor: '#FAC502',
        paddingHorizontal: responsiveScreenWidth(4),
        paddingVertical: responsiveScreenWidth(6),
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        marginBottom: responsiveScreenWidth(19),
    },
});


const otherLeaderStyles = EStyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveScreenWidth(6),
        alignItems:'center'
    },
    profilePic: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFF',
        borderRadius: 100,
    },
    arrow: {
        marginLeft: normalize(7)
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center'

    },
    position: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        marginLeft: normalize(10),
    },
    names: {
        color: '#FFFF',
        fontSize: '0.66rem',
        fontFamily: 'graphik-medium',
    },
    rank: {
        // padding: '.4rem',
        width: normalize(30),
        height: normalize(30),
        borderRadius: 100,
        borderWidth: 1,
        borderColor:'#EF2F55',
        alignItems:'center',
        justifyContent:'center'
    },
    rankText: {
        color: '#FFFF',
        fontSize: '0.65rem',
        fontFamily: 'graphik-medium',
    },
    point: {
        color: '#FFFF',
        fontSize: '0.55rem',
        fontFamily: 'graphik-medium',
        marginTop:'.25rem'
    },
    noData: {
        textAlign: 'center',
        color: '#FFFF',
        fontSize: '0.9rem',
        fontFamily: 'graphik-bold',
    }
});