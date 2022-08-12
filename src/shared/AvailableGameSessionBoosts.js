import React from "react";
import { Pressable, View, Image, Text  } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import Constants from 'expo-constants';
import normalize from "../utils/normalize";
import { formatNumber } from '../utils/stringUtl';
import { bombOptions, boostReleased, consumeBoost, pauseGame, skipQuestion } from "../features/Games/GameSlice";
import { reduceBoostCount } from "../features/Auth/AuthSlice";


const AvailableGameSessionBoosts = () => {
    const dispatch = useDispatch();
    const boosts = useSelector(state => state.auth.user.boosts);
    const displayedOptions = useSelector(state => state.game.displayedOptions);

    const boostsToDisplay = () => {
        //  bomb is only applicable to multiple choices
        if (displayedOptions.length === 2) {
            return boosts.filter(x => x.name.toUpperCase() !== "BOMB");
        }
        return boosts;
    }

    const boostApplied = (data) => {
        dispatch(consumeBoost(data));
        dispatch(reduceBoostCount(data.id))
        const name = data.name.toUpperCase();
        if (name === 'TIME FREEZE') {
            dispatch(pauseGame(true));
            setTimeout(() => {
                dispatch(pauseGame(false))
                dispatch(boostReleased())
            }, 10000);
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
                    <View style={styles.boostinfo}>
                        <Text style={styles.title}>BOOST</Text>
                    </View>
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
    )
}

const AvailableBoost = ({ boost, onConsume }) => {
    const activeBoost = useSelector(state => state.game.activeBoost);
    const isActive = activeBoost.id === boost.id;

    return (
        <Pressable onPress={() => isActive ? {} : onConsume(boost)}>
            <View style={[styles.availableBoost, isActive ? styles.boostActive : {}]}>
                <Image
                    source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
            </View>
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
        paddingVertical: normalize(18),
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
        padding: normalize(7)
    },
    boostIcon: {
        width: normalize(35),
        height: normalize(35)
    },
    amount: {
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        fontSize: '0.6rem',
    },

})