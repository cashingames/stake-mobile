import React from 'react';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../utils/normalize";
import EStyleSheet from 'react-native-extended-stylesheet';
import { getGlobalLeadersByDate } from '../features/CommonSlice';
import MonthlyTopLeaders from './MonthlyTopLeaders';

export default function MonthlyTopLeadersHero() {
    const navigation = useNavigation();
    const leaders = useSelector(state => state.common.globalLeadersbyDate)
    // const leaders = useSelector(state => state.common.globalLeaders)
    const dispatch = useDispatch();

    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - today.getDay()));

    const endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    // function getLastDayOfMonth(year, month) {
    //     return new Date(year, month + 1, 0);
    // }
    // function getFirstDayOfMonth(year, month) {
    //     return new Date(year, month, 1);
    // }

    // const startDate = getFirstDayOfMonth(
    //     date.getFullYear(),
    //     date.getMonth(),
    // );

    // const endDate = getLastDayOfMonth(
    //     date.getFullYear(),
    //     date.getMonth(),
    // );



    useFocusEffect(
        React.useCallback(() => {
            dispatch(getGlobalLeadersByDate({
                startDate,
                endDate
            }));
        }, [])
    );

    return (
        <View style={styles.leaderboard}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Top Players for the week</Text>
                <Text style={styles.extendedText} onPress={() => navigation.navigate('MonthlyLeaderboard')}>View More</Text>
            </View>
            <MonthlyTopLeaders leaders={leaders} />
            {/* <View style={styles.extended}>
                <Text onPress={() => navigation.navigate('MonthlyLeaderboard')}>
                    <Text style={styles.extendedText}>View More</Text>
                </Text>
            </View> */}
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
        marginBottom: normalize(3)
    },
    title: {
        fontSize: '.8rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-bold',
    },
    extendedText: {
        fontSize: '0.65rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
    },
    extended: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#5d5fef',
        justifyContent: 'center',
        paddingVertical: normalize(5)
    },

})