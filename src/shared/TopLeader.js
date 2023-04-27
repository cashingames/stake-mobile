import * as React from 'react';
import { Text, View, Image, Platform } from 'react-native';
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';

import normalize, { responsiveHeight, responsiveScreenWidth } from '../utils/normalize';
import { isTrue } from '../utils/stringUtl';

function TopLeader({ avatar, name, point, style, imageStyle, position, positionStyle }) {
    return (
        <View style={style}>
            {position === 1 &&
            <Image
                style={styles.crown}
                source={require("../../assets/images/leader-crown.png")}
            />}
            <Image
                style={imageStyle}
                source={isTrue(avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${avatar}` } : require("../../assets/images/user-icon.png")}
            />
            <View style={[styles.positionContainer, positionStyle]}>
                <Text style={styles.positionText}>{position}</Text>
            </View>
            <Text style={styles.leaderName}>{name}</Text>
                <Text style={styles.point}>{point}</Text>
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
        bottom: 8,
    },
    point: {
        color: '#FFFF',
        fontSize: '0.6rem',
        fontFamily: 'poppins',
        marginTop:6
    },
    leaderName: {
        color: '#fff',
        fontSize: '0.6rem',
        fontFamily: 'poppins',
        width: responsiveScreenWidth(22),
        textAlign: 'center',
        marginTop: normalize(16),
        height: responsiveHeight(100) * 0.03
    },
    crown:{
        height:24,
        width:33,
        marginTop:-90,
        marginBottom:5
    },
    positionContainer: {
        height:16,
        width:17,
        alignItems:'center',
        justifyContent: 'center',
        marginTop:-10,
        transform: [{ rotate: '45deg' }],
        borderRadius:4,
    },
    positionText: {
        color:'#fff',
        fontSize:'0.65rem',
        transform: [{ rotate: '-45deg' }],
        fontFamily:'poppins'
    }
});