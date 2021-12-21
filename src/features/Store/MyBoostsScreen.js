import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import normalize from '../../utils/normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { formatNumber } from '../../utils/stringUtl';

export default function () {

    var boosts = useSelector(state => state.auth.user.boosts);

    return (
        <View style={styles.availableBoosts1}>
            <View style={styles.boostCards}>
                {boosts.map((boost, i) => <MyItem key={i} boost={boost} />)}
            </View>
        </View>

    )
}

const MyItem = ({ boost }) => {
    return (
        <TouchableOpacity>
            <View style={styles.boostContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../../../assets/images/time_freeze.png')}
                        style={styles.boostIcon}
                    />
                    <View style={styles.hr}><Text></Text></View>
                </View>
                <Text style={styles.boostName}>{boost.name}</Text>
                <Text style={styles.number}>x{formatNumber(boost.count)}</Text>
                <Text style={styles.description}>{boost.description}</Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    availableBoosts1: {
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(20),
    },
    iconContainer: {
        backgroundColor: '#FFFF',
        alignItems: 'center',
        height: normalize(75),
        width: normalize(55),
        borderRadius: 10,
        elevation: 12,
    },
    boostCards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    boostContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFF',
        borderRadius: 11,
        marginBottom: normalize(20),
        width: normalize(130),
        borderWidth: normalize(1),
        borderColor: '#E0E0E0',
        paddingBottom: normalize(15),
        paddingHorizontal: normalize(10),
    },
    boostIcon: {
        marginTop: normalize(12),
        width: normalize(26),
        height: normalize(26),
    },
    hr: {
        borderBottomColor: '#F8A700',
        borderBottomWidth: normalize(5),
        width: normalize(23),
        borderRadius: 5,
        opacity: 0.4
    },
    boostName: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#EF2F55',
        marginTop: normalize(10),
    },
    number: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(8),
        color: '#FF932F',
        marginTop: normalize(4),
    },
    description: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(7),
        color: '#828282',
        marginTop: normalize(4),
        textAlign: 'center'
    },
    buy: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(4),
    },
    buyWithPoint: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: 'rgba(21, 28, 47, 0.6)',
        marginRight: normalize(15)
    },
    buyWithCash: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(8),
        color: '#151C2F',
    },
    winBig: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
        marginVertical: normalize(22),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    winText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        color: '#151C2F',
        width: normalize(130),
    },
    progress: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(15),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    progressText: {
        width: normalize(160),
    },
    progressTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(20),
        color: '#151C2F',
    },
    text: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(10),
        color: '#7C7D7F',
    },
    createQuiz: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        borderRadius: 8,
        marginBottom: normalize(20),
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    quiz: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectCategory: {
        marginTop: normalize(22),
    },
    categoryTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(14),
        color: '#151C2F',
        marginBottom: normalize(10),
    },
    create: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(12),
        color: '#EF2F55',
    },
    card: {
        backgroundColor: '#9C3DB8',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
        width: normalize(130),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
    },
    cardIcon: {},
    cardTitle: {
        fontSize: normalize(12),
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginTop: normalize(8),
    },
    cardInstruction: {
        fontSize: normalize(10),
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    games: {
        paddingVertical: normalize(10),
        marginRight: normalize(5)
    },
    title: {
        fontSize: normalize(22),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        // marginVertical: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        // marginTop: normalize(18),
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    tabs: {
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    select: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },
    uncheckIcon: {
        backgroundColor: '#FFFF',
    },
    selected: {
        display: 'flex'
    },
    clickButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
    },
    gameButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: '#151C2F',
        textAlign: 'center'
    },
    available: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    myQuiz: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: normalize(50)
    },
    didYouKnow: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(13),
        color: '#333333',
    },
    editQuiz: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(11),
        color: '#EF2F55',
    }
});
