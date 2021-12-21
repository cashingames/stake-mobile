import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { backendUrl } from '../utils/BaseUrl';
import normalize from '../utils/normalize';
import { formatNumber, isTrue } from '../utils/stringUtl';
import OtherLeaders from './OtherLeaders';

export default function CategoryLeaderboard({ category, leaders }) {
    if (leaders === null || leaders === undefined || leaders.length === 0) {
        return <></>
    }
    return (
        <ScrollView>
            <View style={styles.category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <CategoryTopLeaders leaders={leaders} />
                <OtherLeaders leaders={leaders} />
            </View>
        </ScrollView>
    )
}

function CategoryTopLeaders({ leaders }) {

    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { first_name: "..." };
    const secondLeader = topLeaders[1] ?? { first_name: "..." };
    const thirdLeader = topLeaders[2] ?? { first_name: "..." };

    return (
        <View style={styles.topLeaders}>
            <CategoryTopLeader
                position='3'
                name={`${thirdLeader.first_name} ${thirdLeader.last_name}`}
                point={thirdLeader.points}
                avatar={thirdLeader.avatar}
            />
            <CategoryTopLeader
                position='1'
                name={`${firstLeader.first_name} ${firstLeader.last_name}`}
                point={firstLeader.points}
                avatar={firstLeader.avatar}
                topLeaderStyle={styles.firstPosition}
            />

            <CategoryTopLeader
                position='2'
                name={`${secondLeader.first_name} ${secondLeader.last_name}`}
                point={secondLeader.points}
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

const styles = StyleSheet.create({
    categories: {
        display: 'flex',
        flexDirection: 'row',
    },
    categoryTitle: {
        fontSize: normalize(16),
        color: '#000',
        fontFamily: 'graphik-medium',
        lineHeight: normalize(30),
        textAlign: 'center',
        marginVertical: normalize(10)
    },
    category: {
        // paddingVertical: normalize(20),
        paddingHorizontal: normalize(15),
        marginRight: normalize(5)
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
        paddingHorizontal: normalize(30),
        paddingTop: normalize(40),
        paddingBottom: normalize(25),
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    },
    icon: {

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
        marginTop: normalize(8),
        textAlign: 'center',
    },
    leaderName: {
        color: '#FFFF',
        fontSize: normalize(10),
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
    },
    firstPosition: {
        top: normalize(-30)
    }
});
