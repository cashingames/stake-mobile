import React, { useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../utils/normalize";
import GlobalTopLeaders from "./GlobalTopLeaders";
import EStyleSheet from 'react-native-extended-stylesheet';
import Animated, { BounceInDown } from 'react-native-reanimated';
import { getGlobalLeaders } from '../features/CommonSlice';

export default function GlobalTopLeadersHero() {
    const navigation = useNavigation();
    const leaders = useSelector(state => state.common.globalLeaders)

    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            console.info("Global leaderboard useFocusEffect");
            dispatch(getGlobalLeaders());
        }, [])
    );

    return (
        <View style={styles.leaderboard}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Daily Top Players</Text>
                <Text style={styles.extendedText} onPress={() => navigation.navigate('Leaderboard')}>View more</Text>
            </View>
            <GlobalTopLeaders leaders={leaders} />
        </View>
    )
}

const styles = EStyleSheet.create({
    leaderboard: {
        marginRight: normalize(15)
    },
    leaderboardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(3),
    },
    title: {
        fontSize: '.8rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        marginLeft:'.5rem'
    },
    extendedText: {
        fontSize: '0.65rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
    },
    extended: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FAC502',
        justifyContent: 'center',
        paddingVertical: normalize(5)
    },

})