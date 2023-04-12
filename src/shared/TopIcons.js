import { View, Text, Image, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { responsiveScreenWidth } from '../utils/normalize'
import { useSelector } from 'react-redux'
import { formatNumber } from '../utils/stringUtl'
import { Animated } from 'react-native'
import { useRef } from 'react'

const TopIcons = () => {
    const user = useSelector(state => state.auth.user);
    var plans = useSelector(state => state.auth.user.activePlans ?? []);
    var boosts = useSelector(state => state.auth.user.boosts ?? []);
    const [sumOfPlans, setSumOfPlans] = useState(0);
    const [boostsString, setBboostsString] = useState('');
    console.log(boosts)
    // const { playSound } =  useSound(require('../../assets/sounds/option-picked.mp3'))

    useEffect(() => {
        const reducer = (accumulator, curr) => accumulator + curr;
        var x = plans && plans.map(a => a.game_count).reduce(reducer, 0);
        setSumOfPlans(x ?? 0);

        var boostResult = ''
        boosts && boosts.map((boost, i) => {
            boostResult += `${formatNumber(boost.count)} `
        });

        setBboostsString(boostResult?.length > 0 ? boostResult : "You have no boosts");

    }, [boosts, plans]);

    const scaleValue = useRef(new Animated.Value(1)).current;

    const zoomAnimation = {
        transform: [{ scale: scaleValue }],
    };

    const zoom = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleValue, { toValue: 1.5, duration: 500, useNativeDriver: true }),
            Animated.timing(scaleValue, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start(() => {
            scaleValue.setValue(1);
        });
    }, [scaleValue]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            zoom();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [zoom]);

    useEffect(() => {
        zoom();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <ImageBackground style={{ zIndex: 11 }} source={require('./../../assets/images/heart-icon.png')}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 65 }}>
                        <View>
                            <Text style={styles.gameLives}>{sumOfPlans}</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.liveText}>
                    <Text style={styles.text}>Lives</Text>
                </View>
            </View>
            <View style={styles.iconContainer}>
                <Animated.View style={zoomAnimation}>
                    <Image style={styles.bombIcon} source={require('./../../assets/images/boost-icon.png')} />
                </Animated.View>
                <View style={styles.bombText}>
                    <Text style={styles.text}>{boostsString}</Text>
                </View>
            </View>
            <View style={styles.iconContainer}>
                <Image style={styles.coinIcon} source={require('./../../assets/images/coin-icon.png')} />
                <View style={styles.coinText}>
                    <Text style={styles.text}>{user.points}</Text>
                </View>
            </View>
        </View>
    )
}


const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveScreenWidth(3),
        zIndex: 10
    },
    iconContainer: {
        // flexDirection:'row',
        alignItems: 'center',
    },
    liveText: {
        width: 83,
        height: 21,
        borderRadius: 7,
        paddingLeft: '2rem',
        backgroundColor: '#102058',
        marginTop: '0.3rem',
        justifyContent: 'center'
    },
    gameLives: {
        color: '#fff',
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        marginTop: '.6rem',
        marginLeft: '0.2rem'
    },
    bombText: {
        width: 55,
        height: 21,
        borderRadius: 7,
        paddingHorizontal: '0.6rem',
        backgroundColor: '#102058',
        marginTop: '0.3rem',
        justifyContent: 'center'
    },
    coinText: {
        width: 65,
        height: 21,
        borderRadius: 7,
        paddingHorizontal: '0.6rem',
        backgroundColor: '#102058',
        marginTop: '0.3rem',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#FFD600',
        fontSize: '.9rem',
        fontFamily: 'blues-smile'
    },
    bombIcon: {
        height: 53,
        width: 41
    },
    coinIcon: {
        height: 41,
        width: 47
    }
})
export default TopIcons