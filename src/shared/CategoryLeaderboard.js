import * as React from 'react';
import { Text, View, Image, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
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
            <OtherLeaders leaders={leaders} otherStyles={styles.otherLeaders} otherName={styles.otherName} />
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
            {topLeaders.length > 0 ? <>
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
            </> : <></>
            }
        </View>
    )
}

function CategoryTopLeader({ avatar, name, position, point, topLeaderStyle }) {
    return (
        <View style={[styles.topLeader, topLeaderStyle]}>
            <Image
                style={styles.avatar}
                source={isTrue(avatar) ? { uri: `${Constants.manifest.extra.apiBaseUrl}/${avatar}` } : require("../../assets/images/user-icon.png")}
            />
            <View style={styles.numberContainer}>
                <Text style={styles.number}>{formatNumber(position)}</Text>
            </View>
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
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        lineHeight: '2rem',
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
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        borderColor:'#808080'
    },
    leaderPoint: {
        alignItems: 'center',
        backgroundColor: '#828282',
        paddingVertical: normalize(2),
        paddingHorizontal: normalize(6),
        borderRadius: 10,
        marginTop: normalize(6),
    },
    point: {
        color: '#FFFF',
        fontSize: '0.5rem',
        fontFamily: 'graphik-regular',


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
    numberContainer: {
        backgroundColor: '#f0b802',
        paddingVertical: normalize(1),
        paddingTop: Platform.OS === 'ios' ? normalize(2) : normalize(1),
        paddingHorizontal: normalize(1),
        position: 'absolute',
        right: 10,
        top: 0,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
        width: normalize(17),
        height: normalize(17),
    },
    number: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'graphik-regular',
        fontSize: Platform.OS === 'ios' ? '0.55rem' : '0.5rem',
    },
    firstPosition: {
        top: normalize(-30)
    },
    otherLeaders: {
        backgroundColor: '#9C3DB8',
    },
    otherName: {
        color:'#FFFF'
    },
});
