import React from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';

import { formatNumber } from '../utils/stringUtl';
import normalize from "../utils/normalize";
import { useNavigation } from '@react-navigation/native';

const UserItems = ({ showBuy }) => {

    const navigation = useNavigation();

    var plans = useSelector(state => state.auth.user.activePlans);
    const reducer = (accumulator, curr) => accumulator + curr;
    const sumOfPlans = plans.map(a => a.game_count).reduce(reducer);

    var boostsString = "";
    var boosts = useSelector(state => state.auth.user.boosts);
    boosts.map((boost, i) => {
        boostsString += `${formatNumber(boost.count)} ${boost.name}${i == boosts.length - 1 ? '' : ','} `
    });

    return (
        <View style={styles.container}>
            <View style={styles.contentTop}>
                <Image
                    source={require('../../assets/images/shooting-star.png')}
                />
                <View style={styles.leftContainer}>
                    <Text style={[styles.commonRow, styles.firstRow]}>You have {formatNumber(sumOfPlans)} games remaining</Text>
                    <Text style={[styles.commonRow, styles.secondRow]}>{boostsString}</Text>
                </View>
            </View>

            {showBuy && <Text onPress={() => navigation.navigate('GameStore')} style={styles.buyMore}>Buy More</Text>}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: '#518EF8',
        paddingVertical: normalize(12),
    },
    contentTop: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    leftContainer: {
        marginHorizontal: normalize(20)
    },
    commonRow: {
        color: '#FFFF',
        textAlign: 'center',
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
    },
    firstRow: {
        marginBottom: normalize(5),
        paddingBottom: normalize(5),
        borderBottomColor: '#B1CEFF',
        borderBottomWidth: normalize(1),
    },
    secondRow: {
    },
    buyMore: {
        alignSelf: 'flex-end',
        color: '#151C2F',
        textAlign: 'right',
        fontFamily: 'graphik-medium',
        marginRight: normalize(16),
        fontSize: normalize(14),
    }
});

export default UserItems;