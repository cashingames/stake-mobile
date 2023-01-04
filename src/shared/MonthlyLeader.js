import * as React from 'react';
import { Text, View, Image } from 'react-native';
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';

import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { isTrue } from '../utils/stringUtl';

function MonthlyLeader({ avatar, podPosition, name, point,styleProp,avatarProp,stage }) {
    return (
        <View style={styles.position}>
            <View style={styleProp}>
                <Image
                    style={avatarProp}
                    source={isTrue(avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${avatar}` } : require("../../assets/images/user-icon.png")}
                />
                <Text style={styles.leaderName}>{name}</Text>
                <View style={styles.leaderPoint}>
                    <Text style={styles.point}>{point}</Text>
                </View>
            </View>

            <Image
                style={stage}
                source={podPosition}
            />

        </View>
    );
}
export default MonthlyLeader;

const styles = EStyleSheet.create({
    avatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    position: {
        display: 'flex',
        alignItems: 'center',
    },
    leaderPoint: {
        alignItems: 'center',
        // borderRadius: 10,
        // backgroundColor: '#828282',
        marginVertical: normalize(2.3),
        // paddingHorizontal: normalize(6),
    },
    point: {
        color: '#FFFF',
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
    },
    leaderName: {
        color: '#FFFF',
        fontSize: '0.65rem',
        fontFamily: 'graphik-medium',
        width: responsiveScreenWidth(22),
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? normalize(4) : normalize(2),

    },
    stage: {
        width: normalize(98),
        height: normalize(98),
    },
});