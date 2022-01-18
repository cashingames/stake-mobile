import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";
import GlobalTopLeaders from "./GlobalTopLeaders";
import EStyleSheet from 'react-native-extended-stylesheet';
import { scalableRem } from '../utils/stringUtl';

export default function GlobalTopLeadersHero() {
    const navigation = useNavigation();
    const leaders = useSelector(state => state.common.globalLeaders)

    return (
        <View style={styles.leaderboard}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Leaderboard</Text>
                <View style={styles.extended}>
                    <Text onPress={() => navigation.navigate('Leaderboard')}>
                        <Text style={styles.extendedText}>Extended Leaderboard</Text>
                    </Text>
                    <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
                </View>
            </View>
            <GlobalTopLeaders leaders={leaders} />
        </View>
    )
}

const styles = EStyleSheet.create({
    leaderboard: {
        paddingTop: normalize(20),
    },
    leaderboardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(12)
    },
    extended: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    extendedText: {
        fontSize: '1rem',
        color: '#EF2F55',
        fontFamily: 'graphik-bold',
    },
    title: {
        fontSize: scalableRem(1.5),
        color: '#151C2F',
        fontFamily: 'graphik-bold',
    },
})