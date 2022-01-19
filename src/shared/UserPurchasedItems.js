import React from "react";
import { Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { formatNumber } from '../utils/stringUtl';
import normalize, { responsiveHeight, responsiveScreenWidth } from "../utils/normalize";

const UserItems = ({ showBuy }) => {

    const navigation = useNavigation();

    var plans = useSelector(state => state.auth.user.activePlans);
    const reducer = (accumulator, curr) => accumulator + curr;
    const sumOfPlans = plans.map(a => a.game_count).reduce(reducer, 0);

    var boostsString = "";
    var boosts = useSelector(state => state.auth.user.boosts);
    boosts.map((boost, i) => {
        boostsString += `${formatNumber(boost.count)} ${boost.name}${i == boosts.length - 1 ? '' : ','} `
    });

    boostsString = boosts.length > 0 ? boostsString : "You have no boosts";

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                resizeMode='contain'
                source={require('../../assets/images/shooting-star.png')}
            />
            <View style={styles.leftContainer}>
                <Text style={[styles.commonRow, styles.firstRow]}>You have {formatNumber(sumOfPlans)} games remanining</Text>
                <Text style={[styles.commonRow, boosts.length > 0 ? styles.secondRow : styles.emptyRow]}>{boostsString}</Text>
                {showBuy && <Text onPress={() => navigation.navigate('GameStore')} style={styles.buyMore}>Buy more</Text>}
            </View>
        </View>
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
        borderBottomWidth: normalize(3),
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