import React, { useEffect, useState } from "react";
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { formatNumber } from '../utils/stringUtl';
import normalize from "../utils/normalize";
import Animated, {
    BounceInLeft,
    useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming
} from 'react-native-reanimated';
import { getCommonData } from "../features/CommonSlice";
import { getUser } from "../features/Auth/AuthSlice";


const UserItems = () => {
    var boosts = useSelector(state => state.auth.user.boosts ?? []);

    let boostsString = ''
    boosts && boosts.map((boost, i) => {
        boostsString += `${formatNumber(boost.count)} ${boost.name}${i === boosts.length - 1 ? '' : ','} `
    });


    const rotation = useSharedValue(0);
    rotation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withRepeat(withTiming(15, { duration: 100 }), 6, true),
        withTiming(0, { duration: 50 })
    );
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });

    return (
        <Animated.View entering={BounceInLeft.duration(2000)} style={styles.container}>
            <Animated.Image
                style={[styles.trophy, animatedStyle]}
                source={require('../../assets/images/point-trophy.png')}
            />
            <View style={styles.boostContainer}>
                <Text style={[styles.commonRow, boostsString?.length > 0 ? styles.secondRow : styles.emptyRow]}>
                    {boostsString?.length > 0? boostsString: 'You have no boosts' }
                </Text>
            </View>
            {/* {showBuy && <Text onPress={buyMore} style={styles.buyMore}>Buy more</Text>} */}
        </Animated.View>
    )
}

const styles = EStyleSheet.create({
    container: {
        backgroundColor: '#518EF8',
        borderRadius: normalize(10),
        marginVertical: normalize(10),
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingRight: normalize(10),
        paddingLeft: normalize(20),
        alignItems: 'center'
    },
    boostContainer: {
        backgroundColor: '#072169',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(15),
        borderRadius: 10
    },
    commonRow: {
        color: '#FFFF',
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        fontSize: '0.9rem',
    },
    buyMore: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: '0.8rem',
        marginTop: normalize(.1),
        marginLeft: 'auto',
    },
    trophy: {
        position: 'relative',
        zIndex: 2,
        marginTop: normalize(-25)
    },
});

export default UserItems;