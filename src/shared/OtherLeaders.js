import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { backendUrl } from '../utils/BaseUrl';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { formatNumber, isTrue } from '../utils/stringUtl';

export default function OtherLeaders({ leaders }) {
    const currentLeadedrs = leaders?.slice(3, leaders.length) ?? null;
    if (currentLeadedrs === null) {
        return <></>;
    }

    return (
        <View style={styles.container}>
            {currentLeadedrs.map((leader, i) => <OtherLeader key={i} leader={leader}
                position={formatNumber(i + 4)}
                indexArrow={require('../../assets/images/up_arrow.png')}
            />)}
        </View>
    );
}
function OtherLeader({ leader, position, indexArrow }) {
    return (
        <View style={otherLeaderStyles.container}>
            <View style={otherLeaderStyles.avatar}>
                <Image
                    style={otherLeaderStyles.profilePic}
                    source={isTrue(leader.avatar) ? { uri: `${backendUrl}/${leader.avatar}` } : require("../../assets/images/user-icon.png")}
                />
                <View style={otherLeaderStyles.username}>
                    <Text style={otherLeaderStyles.names}>{`${leader.first_name} ${leader.last_name}`}</Text>
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
        backgroundColor: '#F2F5FF',
        paddingHorizontal: responsiveScreenWidth(4),
        paddingVertical:responsiveScreenWidth(6),
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        marginBottom: responsiveScreenWidth(19)
    },
});


const otherLeaderStyles =EStyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveScreenWidth(6)
    },
    profilePic: {
        width: normalize(30),
        height: normalize(30),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    arrow: {
        marginLeft: normalize(7)
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',

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
        color: '#535761',
        fontSize: '0.66rem',
        fontFamily: 'graphik-bold',
    },
    rank: {
        backgroundColor: '#C4C4C4',
        paddingHorizontal: normalize(7),
        paddingVertical: normalize(3),
        borderRadius: 5
    },
    rankText: {
        color: '#535761',
        fontSize: '0.6rem',
        fontFamily: 'graphik-bold',
    },
    point: {
        color: '#BDBDBD',
        fontSize: '0.55rem',
        fontFamily: 'graphik-bold',
    },
});