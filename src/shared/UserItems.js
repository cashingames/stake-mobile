import React, { useEffect, useState } from "react";
import { Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from '../shared/LottieAnimations';

import { formatNumber } from '../utils/stringUtl';
import normalize, { responsiveHeight, responsiveScreenWidth } from "../utils/normalize";
import Animated from "react-native-reanimated";
import { randomEnteringAnimation } from "../utils/utils";

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
        <Animated.View entering={randomEnteringAnimation().duration(1000)} style={styles.container}>
            <View style={styles.topRow}>
                <LottieAnimations
                    animationView={require('../../assets/treasure-chest.json')}
                    width={normalize(120)}
                    height={normalize(120)}
                />
                <View>
                    <View style={styles.firstRow}>
                        <Text style={[styles.commonRow]}>You have {formatNumber(sumOfPlans)} games left</Text>
                    </View>
                    <Text style={[styles.commonRow, boosts?.length > 0 ? styles.secondRow : styles.emptyRow]}>{boostsString}</Text>
                </View>
            </View>
            {showBuy && <Text onPress={() => navigation.navigate('GameStore')} style={styles.buyMore}>Buy more</Text>}
        </Animated.View>
    )
}

const styles = EStyleSheet.create({
    container: {
        borderRadius: 15,
        flexDirection: 'column',
        backgroundColor: '#518EF8',
        paddingBottom: normalize(8),
        paddingRight: normalize(14),
        // alignItems: 'center'
    },
    image: {
        flex: 1,
        shadowColor: '#000',
        shadowRadius: 100,
        marginLeft: normalize(10)
        // elevation: 2,
    },
    topRow: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between'
    },
    leftContainer: {
        alignItems: 'center',
        marginTop: normalize(10),
        marginRight: responsiveScreenWidth(3),
        // flex: 3,
    },
    commonRow: {
        color: '#FFFF',
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        fontSize: '0.9rem',
        width: '100%',
    },
    firstRow: {
        marginBottom: normalize(8),
        paddingBottom: normalize(8),
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
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: '0.8rem',
        marginTop: normalize(.2)
    }
});

export default UserItems;