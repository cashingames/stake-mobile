import * as React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';

import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize';
import { formatNumber, isTrue } from '../utils/stringUtl';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';

export default function OtherLeaders({ leaders, otherStyles, otherName }) {
    const currentLeadedrs = leaders?.slice(3, leaders.length) ?? null;
    if (currentLeadedrs === null) {
        return <></>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: responsiveHeight(22) }}>
            {currentLeadedrs.map((leader, i) => <OtherLeader key={i} leader={leader}
                position={formatNumber(i + 4)}
                indexArrow={require('../../assets/images/up_arrow.png')}
                otherName={otherName}
            />)}
            {currentLeadedrs.length === 0 &&
                <View style={{height:responsiveHeight(30), justifyContent:'center'}}>
                    <Text style={otherLeaderStyles.noData}>No data</Text>
                </View>
            }
        </ScrollView>
    );
}
function OtherLeader({ leader, position, indexArrow, otherName }) {
    return (
        <View style={otherLeaderStyles.container}>
            <View style={otherLeaderStyles.avatar}>
                <Image
                    style={otherLeaderStyles.profilePic}
                    source={
                        isTrue(leader.avatar) ?
                        { uri: `${Constants.manifest.extra.assetBaseUrl}/${leader.avatar}` } :
                        require("../../assets/images/user-icon.png")}
                />
                <View style={otherLeaderStyles.username}>
                    <Text style={[otherLeaderStyles.names, otherName]}>{`${leader.username}`}</Text>
                    {/* <Text style={[otherLeaderStyles.names, otherName]}>jackgrealish</Text> */}

                    <Text style={otherLeaderStyles.point}>{formatNumber(leader.points)} pts</Text>
                    {/* <Text style={otherLeaderStyles.point}>{position}</Text> */}
                </View>
            </View>
            <View style={otherLeaderStyles.position}>
                <View style={otherLeaderStyles.rank}>
                    <Text style={otherLeaderStyles.rankText}>{position}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#0A1F45',
        paddingTop: responsiveScreenWidth(3),
        paddingBottom: responsiveHeight(20),
        marginTop: responsiveScreenWidth(3),
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        height: responsiveHeight(50),
    },
});


const otherLeaderStyles = EStyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: responsiveScreenWidth(10),
        alignItems: 'center',
        borderColor: ' rgba(95, 89, 89, 0.54)',
        borderBottomWidth: 1,
        paddingVertical: responsiveHeight(100) * 0.015,
    },
    profilePic: {
        width: normalize(48),
        height: normalize(48),
        backgroundColor: '#FFFF',
        borderRadius: 50,
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
        marginLeft: normalize(20),
    },
    names: {
        color: '#fff',
        fontSize: '0.65rem',
        fontFamily: 'poppins',
        marginTop: '.3rem'
    },
    rankText: {
        color: '#fff',
        fontSize: '0.65rem',
        fontFamily: 'poppins',
    },
    point: {
        color: '#FFFF',
        fontSize: '0.65rem',
        fontFamily: 'poppins',
        marginTop: '.3rem'
    },
    noData: {
        textAlign: 'center',
        color: '#FFFF',
        fontSize: '0.9rem',
        fontFamily: 'graphik-bold',
    }
});