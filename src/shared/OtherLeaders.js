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
        <ScrollView scrollEnabled={false}>
            <ScrollView style={[styles.container, otherStyles]}>
                {currentLeadedrs.map((leader, i) => <OtherLeader key={i} leader={leader}
                position={formatNumber(i + 4)}
                indexArrow={require('../../assets/images/up_arrow.png')}
                otherName={otherName}
            />)}
                {currentLeadedrs.length === 0 && <Text style={otherLeaderStyles.noData}>No data</Text>}
            </ScrollView>
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
                    {/* <Text style={otherLeaderStyles.point}>20 pts</Text> */}
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
        backgroundColor: '#0A1F45',
        paddingTop: responsiveScreenWidth(3),
        paddingBottom: responsiveHeight(15),
        marginTop: responsiveScreenWidth(3),
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        height: Platform.OS === "ios" ? responsiveHeight(30) : responsiveHeight(25),
    },
});


const otherLeaderStyles = EStyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: responsiveScreenWidth(6),
        marginHorizontal: responsiveScreenWidth(10),
        alignItems: 'center',
        borderColor: ' rgba(95, 89, 89, 0.54)',
        borderBottomWidth: 1,
        paddingVertical: normalize(20),
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
        fontSize: '0.85rem',
        fontFamily: 'graphik-bold',
    },
    // rank: {
    //     backgroundColor: '#C4C4C4',
    //     paddingHorizontal: Platform.OS === 'ios' ? normalize(7) : normalize(8.6),
    //     paddingVertical: normalize(3),
    //     borderRadius: 5
    // },
    rankText: {
        color: '#fff',
        fontSize: '0.85rem',
        fontFamily: 'graphik-bold',
    },
    point: {
        color: '#FFFF',
        fontSize: '0.55rem',
        fontFamily: 'graphik-bold',
        marginTop: '.5rem'
    },
    noData: {
        textAlign: 'center',
        color: '#FFFF',
        fontSize: '0.9rem',
        fontFamily: 'graphik-bold',
    }
});