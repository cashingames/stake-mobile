import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { backendUrl } from '../utils/BaseUrl';
import normalize from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isTrue } from '../utils/stringUtl';

function TopLeader({ avatar, podPosition, name, point }) {


    return (
        <View style={styles.position}>
            <Image
                style={styles.avatar}
                source={isTrue(avatar) ? { uri: `${backendUrl}/${avatar}` } : require("../../assets/images/user-icon.png")}
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
    icon: {},
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
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
        width: normalize(75),
        textAlign: 'center',
    }
});