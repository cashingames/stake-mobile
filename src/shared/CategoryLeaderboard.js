import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { backendUrl } from '../utils/BaseUrl';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { formatNumber, isTrue } from '../utils/stringUtl';
import OtherLeaders from './OtherLeaders';

export default function CategoryLeaderboard({ category, leaders }) {
    if (leaders === null || leaders === undefined || leaders.length === 0) {
        return <></>
    }
    return (
        <View style={styles.category}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <CategoryTopLeaders leaders={leaders} />
            <OtherLeaders leaders={leaders} />
        </View>
    )
}

function CategoryTopLeaders({ leaders }) {

    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };

    return (
        <View style={styles.topLeaders}>
            <CategoryTopLeader
                position='3'
                name={`${thirdLeader.username}`}
                point={`${thirdLeader.points ? `${thirdLeader.points}` : 0}`}
                avatar={thirdLeader.avatar}
            />
            <CategoryTopLeader
                position='1'
                name={`${firstLeader.username}`}
                point={`${firstLeader.points ? `${firstLeader.points}` : 0}`}
                avatar={firstLeader.avatar}
                topLeaderStyle={styles.firstPosition}
            />

            <CategoryTopLeader
                position='2'
                name={`${secondLeader.username}`}
                point={`${secondLeader.points ? `${secondLeader.points}` : 0}`}
                avatar={secondLeader.avatar}
            />
        </View>
    )
}

function CategoryTopLeader({ avatar, name, position, point, topLeaderStyle }) {
    return (
        <View style={[styles.topLeader, topLeaderStyle]}>
            <Image
                style={styles.avatar}
                source={isTrue(avatar) ? { uri: `${backendUrl}/${avatar}` } : require("../../assets/images/user-icon.png")}
            />
            <Text style={styles.number}>{formatNumber(position)}</Text>
            <Text style={styles.leaderName}>{name}</Text>
            <View style={styles.leaderPoint}>
                <Text style={styles.point}>{formatNumber(point)} pts</Text>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    categoryTitle: {
        fontSize: '0.9rem',
        color: '#000',
        fontFamily: 'graphik-medium',
        lineHeight:'2rem',
        textAlign: 'center',
        marginVertical: normalize(10)
    },
    category: {
        paddingHorizontal: normalize(12),
        // marginRight: normalize(1)
    },
    topLeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topLeaders: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#9C3DB8',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: responsiveScreenWidth(8),
        paddingTop: responsiveScreenWidth(13),
        paddingBottom: responsiveScreenWidth(10),
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    },
    leaderPoint: {
        alignItems: 'center',
    },
    point: {
        color: '#FFFF',
        fontSize: '0.5rem',
        fontFamily: 'graphik-regular',
        backgroundColor: '#828282',
        paddingVertical: normalize(2),
        paddingHorizontal: normalize(6),
        borderRadius: 10,
        marginTop: normalize(8),
        textAlign: 'center',
    },
    leaderName: {
        color: '#FFFF',
        fontSize: '0.6rem',
        fontFamily: 'graphik-bold',
        width: normalize(75),
        textAlign: 'center',
    },
    avatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 50,
        marginBottom: normalize(5)
    },
    number: {
        backgroundColor: '#f0b802',
        paddingVertical: normalize(1),
        paddingHorizontal: normalize(1),
        textAlign: 'center',
        position: 'absolute',
        right: 10,
        top: 0,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
        width: normalize(16),
        height: normalize(16),
        color: 'white',
        fontFamily: 'graphik-regular',
        fontSize:'0.55rem'
    },
    firstPosition: {
        top: normalize(-30)
    }
});
