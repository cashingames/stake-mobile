import * as React from 'react';
import { Text, View, Image } from 'react-native';
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';

import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { isTrue } from '../utils/stringUtl';

function TopLeader({ avatar, podPosition, name, point }) {
    return (
        <View style={styles.position}>
            <Image
                style={styles.avatar}
                source={isTrue(avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${avatar}` } : require("../../assets/images/user-icon.png")}
            />
            <Text style={styles.leaderName}>{name}</Text>
            <Image
                style={styles.icon}
                source={podPosition}
            />
            <View style={styles.leaderPoint}>
                <Text style={styles.point}>{point}</Text>
            </View>
        </View>
    );
}
export default TopLeader;

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
        borderRadius: 10,
        backgroundColor: '#828282',
        paddingVertical: normalize(2.3),
        paddingHorizontal: normalize(6),
        position: 'absolute',
        bottom: 10,
    },
    point: {
        color: '#FFFF',
        fontSize: '0.55rem',
        fontFamily: 'graphik-regular',
    },
    leaderName: {
        color: '#535761',
        fontSize: '0.65rem',
        fontFamily: 'graphik-medium',
        width: responsiveScreenWidth(24),
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? normalize(4) : normalize(2),

    }
});