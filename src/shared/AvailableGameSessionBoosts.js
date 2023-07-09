import React, { useState } from 'react';
import { Pressable, View, Image, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import Constants from 'expo-constants';
import normalize from "../utils/normalize";
import { formatNumber } from '../utils/stringUtl';
import { bombOptions, boostReleased, consumeBoost, pauseGame, skipQuestion } from "../features/Games/GameSlice";
import { reduceBoostCount } from "../features/Auth/AuthSlice";
import logToAnalytics from '../utils/analytics';



const AvailableGameSessionBoosts = () => {
    const dispatch = useDispatch();
    const boosts = useSelector(state => state.auth.user.boosts);
    const user = useSelector(state => state.auth.user)
    const displayedOptions = useSelector(state => state.game.displayedOptions);
    const gameMode = useSelector(state => state.game.gameMode);
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);
    const [updatepracticeFreezeCount, setUpdatePracticeFreezeCount] = useState(20);
    const [updatepracticeSkipCount, setUpdatePracticeSkipCount] = useState(20);
    // const [showText, setShowText] = useState(true);

    const practiceBoosts = [
        {
            "id": 1,
            "icon": require('../../assets/images/timefreeze-boost.png'),
            "count": updatepracticeFreezeCount,
            "boostName": 'TIME FREEZE'
        },
        {
            "id": 2,
            "icon": require('../../assets/images/skip-boost.png'),
            "count": updatepracticeSkipCount,
            "boostName": 'SKIP'
        }
    ]

    const practiceBoostApplied = (data) => {
        const boostName = data.boostName.toUpperCase();
        if (boostName === 'TIME FREEZE') {
            // setClicked(true)
            setUpdatePracticeFreezeCount(data.count - 1)
            dispatch(pauseGame(true));
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
                // setClicked(false)

            }, 10000);
        }
        if (boostName === 'SKIP') {
            setUpdatePracticeSkipCount(data.count - 1)
            dispatch(skipQuestion());
            dispatch(boostReleased());
        }
    }


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
            {cashMode &&
                <>
                    {boosts?.length > 0 ?
                        <View style={styles.availableBoosts}>
                            {
                                boostsToDisplay().map((boost, index) =>
                                    boost.count >= 1 &&
                                    <AvailableBoost boost={boost} key={index} onConsume={boostApplied} />
                                )
                            }

                        </View>
                        :
                        <></>
                    }
                </>
            }

            {practiceMode &&
                <GamePracticeBoosts practiceBoosts={practiceBoosts} boostApplied={practiceBoostApplied} />
            }
        </>
    )
}

const AvailableBoost = ({ boost, onConsume }) => {
    const activeBoost = useSelector(state => state.game.activeBoost);
    const isActive = activeBoost.id === boost.id;

    return (
        <Pressable onPress={() => isActive ? {} : onConsume(boost)}>
            <View style={styles.boostContainer}>
                {/* <View style={[styles.availableBoost, isActive ? styles.boostActive : {}, { opacity: showText ? 0 : 1 }]}> */}
                <View style={[styles.boostDetailsHead, isActive ? styles.boostActive : {}]}>

                    <Image
                        source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                        style={styles.boostIcon}
                    />
                    <Text style={styles.storeItemName}>x{formatNumber(boost.count)}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const GamePracticeBoosts = ({ practiceBoosts, boostApplied, clicked }) => {
    return (
        <View style={styles.boostItems}>
            {
                practiceBoosts.map((practiceBoost, index) =>
                    <GamePracticeBoost practiceBoost={practiceBoost} key={index} onConsume={boostApplied} clicked={clicked} />
                )
            }
        </View>
    )
}

const GamePracticeBoost = ({ practiceBoost, onConsume }) => {

    return (
        <Pressable style={styles.boostContainer} onPress={() => onConsume(practiceBoost)}>
            <View style={styles.boostDetailsHead}>
                <Image
                    source={practiceBoost.icon}
                    style={styles.boostIcon}
                />
                <Text style={styles.storeItemName}>x{formatNumber(practiceBoost.count)}</Text>
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
        // paddingVertical: normalize(18),
        // paddingHorizontal:'1.3rem'
    },

    availableBoost: {
        display: 'flex',
        flexDirection: 'row',
        // marginRight: normalize(1)
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
     
    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: '1rem'
    },
    boostIcon: {
        width: '3.2rem',
        height: '3.2rem',
    },
    storeItemName: {
        fontSize: '.85rem',
        color: '#fff',
        fontFamily: 'gotham-bold',
        textShadowColor: '#121212',
        textShadowRadius: 1,
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        position: 'absolute',
        left: 35,
        top: 10
    },
    name: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        marginTop: '.5rem',
        width: "4rem"
    },
    boostItems: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '1rem',
        paddingVertical: '.7rem'
    },

})