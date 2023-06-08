import React, { useEffect, useState } from 'react';
import { Pressable, View, Image, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import Constants from 'expo-constants';
import normalize from "../utils/normalize";
import { formatNumber } from '../utils/stringUtl';
import { bombOptions, boostReleased, consumeBoost, pauseGame, skipQuestion } from "../features/Games/GameSlice";
import { reduceBoostCount } from "../features/Auth/AuthSlice";
import { unwrapResult } from '@reduxjs/toolkit';
import logToAnalytics from '../utils/analytics';



const AvailableGameSessionBoosts = () => {
    const dispatch = useDispatch();
    const boosts = useSelector(state => state.auth.user.boosts);
    const user = useSelector(state => state.auth.user)
    const displayedOptions = useSelector(state => state.game.displayedOptions);
    const gameMode = useSelector(state => state.game.gameMode);
    const [showText, setShowText] = useState(true);


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

    useEffect(() => {
        // Change the state every second or the time given by User.
        const interval = setInterval(() => {
            setShowText((showText) => !showText);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const boostApplied = (data) => {
        dispatch(consumeBoost(data))
        dispatch(reduceBoostCount(data.id))
        logToAnalytics('boost_used', {
            'id': user.username,
            'boostName': data.name
        })
        const name = data.name.toUpperCase();
        if (name === 'TIME FREEZE') {
            dispatch(pauseGame(true));
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
            }, 15000);
        }
        if (name === 'SKIP') {
            dispatch(skipQuestion());
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
    const activeBoost = useSelector(state => state.game.activeBoost);
    const isActive = activeBoost.id === boost.id;

    return (
        <Pressable onPress={() => isActive ? {} : onConsume(boost)}>
            <View style={styles.boostContainer}>
                <View style={[styles.availableBoost, isActive ? styles.boostActive : {}, { opacity: showText ? 0 : 1 }]}>
                    <Image
                        source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                        style={styles.boostIcon}
                    />
                    <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
                </View>
            </View>
        </Pressable>
    )
}
export default AvailableGameSessionBoosts;


const styles = EStyleSheet.create({
    availableBoosts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(18),
        paddingHorizontal:'1.3rem'
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
        alignItems: 'flex-end',
        marginRight:'1.5rem'
    },
    boostIcon: {
        width: normalize(40),
        height: normalize(40)
    },
    amount: {
        color: '#121212',
        fontFamily: 'graphik-bold',
        fontSize: '0.7rem',
    },
    name: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
    },

})