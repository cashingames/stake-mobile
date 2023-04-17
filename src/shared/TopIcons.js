import { View, Text, Image, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { responsiveScreenWidth } from '../utils/normalize'
import { useSelector } from 'react-redux'
import { formatNumber, isTrue } from '../utils/stringUtl'
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Animated } from 'react-native'
import { useRef } from 'react'

const TopIcons = () => {
    const user = useSelector(state => state.auth.user);
    var plans = useSelector(state => state.auth.user.activePlans ?? []);
    
    const [sumOfPlans, setSumOfPlans] = useState(0);

    // const { playSound } =  useSound(require('../../assets/sounds/option-picked.mp3'))
    useEffect(() => {
        const reducer = (accumulator, curr) => accumulator + curr;
        var x = plans && plans.map(a => a.game_count).reduce(reducer, 0);
        setSumOfPlans(x ?? 0);
    }, [plans]);

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
                <Image style={styles.heartIcon} source={require('./../../assets/images/heart-icon.png')} />
                <View style={styles.iconBox}>
                    <View style={styles.iconText}>
                        <Text style={styles.text}>{sumOfPlans}</Text>
                    </View>
                   <IconDetails />
                </View>
            </View>
            <View style={styles.iconContainer}>
                <Image style={styles.coinIcon} source={require('./../../assets/images/coin-icon.png')} />
                <View style={styles.iconBox}>
                    <View style={styles.iconText}>
                        <Text style={styles.text}>{user.points}</Text>
                    </View>
                   <IconDetails />
                </View>
            </View>
        </View>
    )
}

const IconDetails = () => {
    return(
        <View style={styles.plusCase}>
        <Feather name="plus" size={18} color="#fff" />
    </View>
    )
}


const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsiveScreenWidth(3),
        zIndex: 10,
        marginBottom: 10
    },
    iconContainer: {
        // flexDirection:'row',
        alignItems: 'center',
    },
    heartIcon: {
        height: 37,
        width: 48
    },
    gameLives: {
        color: '#fff',
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        marginTop: '.6rem',
        marginLeft: '0.2rem'
    },
    iconBox:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        height: 18,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        paddingHorizontal: '0.6rem',
        justifyContent:'center',
        backgroundColor: '#102058',
        marginTop: '0.3rem',
    },
    text: {
        color: '#FFD600',
        fontSize: '.9rem',
        fontFamily: 'blues-smile',
        alignItems: 'center',

    },
    coinIcon: {
        height: 37,
        width: 43
    },
    plusCase: {
        height: 18,
        width: 18,
        backgroundColor: '#E0004B',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        marginTop: '0.3rem',
    },
    plus:{
        color:'#fff',
        fontSize:'1rem'
    }
})
export default TopIcons