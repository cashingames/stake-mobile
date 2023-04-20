import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View, Image, Text, Animated } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import Constants from 'expo-constants';
import normalize from "../utils/normalize";
import { formatNumber } from '../utils/stringUtl';
import { bombOptions, boostReleased, consumeBoost, pauseGame, skipQuestion } from "../features/Games/GameSlice";
import { reduceBoostCount } from "../features/Auth/AuthSlice";
import { unwrapResult } from '@reduxjs/toolkit';
import analytics from '@react-native-firebase/analytics';
import useSound from '../utils/useSound';
import { useRef } from 'react';



const AvailableGameSessionBoosts = () => {
    const dispatch = useDispatch();
    const boosts = useSelector(state => state.auth.user.boosts);
    const user = useSelector(state => state.auth.user)
    const displayedOptions = useSelector(state => state.game.displayedOptions);
    const gameMode = useSelector(state => state.game.gameMode);
    const [showText, setShowText] = useState(true);

    const freeze =  useSound(require('../../assets/sounds/sound.wav'))
    const skip =  useSound(require('../../assets/sounds/achievement-unlocked2.wav'))



    const boostsToDisplay = () => {
        //  bomb is only applicable to multiple choices
        if (displayedOptions.length === 2) {
            return boosts.filter(x => x.name.toUpperCase() !== "BOMB");
        }
        if (gameMode.name === "CHALLENGE") {
            return boosts.filter(x => x.name.toUpperCase() !== "SKIP");
        }
        return boosts;
    }

    // useEffect(() => {
    //     // Change the state every second or the time given by User.
    //     const interval = setInterval(() => {
    //         setShowText((showText) => !showText);
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    const boostApplied = (data) => {
        dispatch(consumeBoost(data))
        dispatch(reduceBoostCount(data.id))
        analytics().logEvent('boost_used', {
            'id': user.username,
            'boostName': data.name
        })
        const name = data.name.toUpperCase();
        if (name === 'TIME FREEZE') {
            dispatch(pauseGame(true));
            freeze.playSound()
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
        }, 10000);

        }
        if (name === 'SKIP') {
            dispatch(skipQuestion());
            skip.playSound()
            dispatch(boostReleased());
        }
        if (name === "BOMB") {
            dispatch(bombOptions());
            dispatch(boostReleased());
        }
    }

    return (
        <>
            {boosts?.length > 0 ?
                <View style={styles.availableBoosts}>
                    <View style={styles.boostinfo}>
                        <Text style={styles.title}>BOOST</Text>
                    </View>
                    {
                        boostsToDisplay().map((boost, index) =>
                            boost.count >= 1 &&
                            <AvailableBoost boost={boost} key={index} onConsume={boostApplied} showText={showText} />
                        )
                    }

                </View>
                :
                <></>
            }
        </>
    )
}

const AvailableBoost = ({ boost, onConsume, showText }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const zoomAnimation = {
        transform: [{ scale: scaleValue }],
    };

    const zoom = useCallback(() => {
        Animated.sequence([
            Animated.timing(scaleValue, { toValue: 1.2, duration: 500, useNativeDriver: true }),
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
    const activeBoost = useSelector(state => state.game.activeBoost);
    const isActive = activeBoost.id === boost.id;

    return (
        <Pressable onPress={() => isActive ? {} : onConsume(boost)}>
            <Animated.View style={styles.boostContainer}>
                <View style={[styles.availableBoost, isActive ? styles.boostActive : {}]}>
                    <Image resizeMode="contain"
                        source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
                        style={styles.boostIcon}
                    />
                    <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
                </View>
                <Text style={styles.name}>{boost.name}</Text>
            </Animated.View>
        </Pressable>
    )
}
export default AvailableGameSessionBoosts;


const styles = EStyleSheet.create({
    availableBoosts: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: normalize(30),
        paddingVertical: normalize(10),
    },
    boostinfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    title: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '.9rem'
    },
    availableBoost: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: normalize(20)
    },
    boostActive: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: normalize(5),
        padding: normalize(7),
        shadowColor: 'rgba(0, 0, 0, 0.75)',
        shadowOffset: { width: -1, height: 1 },
    },
    boostContainer: {
        alignItems: 'flex-end'
    },
    boostIcon: {
        width: normalize(28),
        height: normalize(28)
    },
    amount: {
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        fontSize: '0.6rem',
    },
    name: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
    },

})