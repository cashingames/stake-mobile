import React from 'react';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../utils/normalize";
import EStyleSheet from 'react-native-extended-stylesheet';
import WeeklyTopLeaders from './WeeklyTopLeaders';
import { getWeeklyLeadersByDate } from '../features/CommonSlice';

export default function WeeklyTopLeadersHero({gameModes}) {
    const navigation = useNavigation();
    const leaders = useSelector(state => state.common.weeklyLeaderboard.leaderboard)
    const dispatch = useDispatch();

    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - today.getDay()));

    const endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6));
   
    const firstDayString = startDate.toDateString()
    const lastDayString = endDate.toDateString()


    useFocusEffect(
        React.useCallback(() => {
            dispatch(getWeeklyLeadersByDate({
                startDate,
                endDate
            }));
        }, [])
    );

    return (
        <View style={styles.leaderboard}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Top Players for the week</Text>
                <Text style={styles.extendedText} onPress={() => navigation.navigate('WeeklyLeaderboard')}>View More</Text>
            </View>
            <WeeklyTopLeaders leaders={leaders} firstDay={firstDayString} lastDay={lastDayString} gameModes={gameModes} />
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