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
        // <Animated.View style={styles.leaderboard} entering={BounceInDown.duration(2000)}>
        <View style={styles.leaderboard}>
            {/* <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Top Players</Text>
                <View style={styles.extended}>
                    <Text onPress={() => navigation.navigate('Leaderboard')}>
                        <Text style={styles.extendedText}>Extended Leaderboard</Text>
                    </Text>
                    <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
                </View>
            </View> */}
            <GlobalTopLeaders leaders={leaders} />
            </View>
        // </Animated.View>
    )
}

const styles = EStyleSheet.create({
    leaderboard: {
        marginRight: normalize(10)
    },
    leaderboardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(8)
    },
    title: {
        fontSize: '.9rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-bold',
    },
    extendedText: {
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
    },
    extended: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

})