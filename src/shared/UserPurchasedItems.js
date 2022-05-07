import React, { useEffect, useState } from "react";
import { Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { formatNumber } from '../utils/stringUtl';
import normalize, { responsiveHeight, responsiveScreenWidth } from "../utils/normalize";
import Animated, { BounceIn } from "react-native-reanimated";

const UserItems = ({ showBuy }) => {

    const navigation = useNavigation();

    var plans = useSelector(state => state.auth.user.activePlans ?? []);
    var boosts = useSelector(state => state.auth.user.boosts ?? []);
    const [sumOfPlans, setSumOfPlans] = useState(0);
    const [boostsString, setBboostsString] = useState('');

    useEffect(() => {
        const reducer = (accumulator, curr) => accumulator + curr;
        var x = plans && plans.map(a => a.game_count).reduce(reducer, 0);
        setSumOfPlans(x ?? 0);

        var boostResult = ''
        boosts && boosts.map((boost, i) => {
            boostResult += `${formatNumber(boost.count)} ${boost.name}${i == boosts.length - 1 ? '' : ','} `
        });

        setBboostsString(boostResult?.length > 0 ? boostResult : "You have no boosts");

    }, [boosts, plans]);

    return (
        <Animated.View entering={BounceIn.duration(1000)} style={styles.container}>
            <Image
                style={styles.image}
                resizeMode='contain'
                source={require('../../assets/images/shooting-star.png')}
            />
            <View style={styles.leftContainer}>
                <View style={styles.firstRow}>
                    <Text style={[styles.commonRow]}>You have {formatNumber(sumOfPlans)} games remanining</Text>
                </View>
                <Text style={[styles.commonRow, boosts?.length > 0 ? styles.secondRow : styles.emptyRow]}>{boostsString}</Text>
                {showBuy && <Text onPress={() => navigation.navigate('GameStore')} style={styles.buyMore}>Buy more</Text>}
            </View>
        </Animated.View>
    )
}

const styles = EStyleSheet.create({
    container: {
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: '#518EF8',
        paddingVertical: normalize(12),
    },
    image: {
        flex: 1
    },
    leftContainer: {
        alignItems: 'center',
        paddingTop: normalize(10),
        marginRight: responsiveScreenWidth(3),
        flex: 3,
    },
    commonRow: {
        color: '#FFFF',
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        fontSize: '0.9rem',
        width: '100%',
    },
    firstRow: {
        marginBottom: normalize(12),
        paddingBottom: normalize(12),
        borderBottomColor: '#B1CEFF',
        borderBottomWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),

    },
    secondRow: {
    },
    emptyRow: {
        fontStyle: "italic"
    },
    buyMore: {
        alignSelf: 'flex-end',
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        fontSize: '0.8rem',
        marginTop: responsiveHeight(2),
    }
});

export default UserItems;