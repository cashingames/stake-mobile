import React from 'react';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../utils/normalize";
import EStyleSheet from 'react-native-extended-stylesheet';
import WeeklyTopLeaders from './WeeklyTopLeaders';
import { getWeeklyLeadersByDate } from '../features/CommonSlice';
import analytics from '@react-native-firebase/analytics';


export default function WeeklyTopLeadersHero({ gameModes }) {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const leaders = useSelector(state => state.common.weeklyLeaderboard.leaderboard)
    const user = useSelector(state => state.auth.user)

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 5, 0, 0);
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 59, 0);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getWeeklyLeadersByDate({
                startDate,
                endDate
            }));
        }, [])
    );

    const viewLeaderboard = async () => {
        await analytics().logEvent("weekly_leaderboard_view_more_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('WeeklyLeaderboard')
    }

    return (
        <View style={styles.leaderboard}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Top Players for the day</Text>
                <Text style={styles.extendedText} onPress={viewLeaderboard}>View More</Text>
            </View>
            <WeeklyTopLeaders leaders={leaders} firstDay='5:00am' lastDay='10:00pm' gameModes={gameModes} />
        </View>
    )
}

const styles = EStyleSheet.create({
    leaderboard: {
        width: normalize(320),
        marginRight: normalize(20)
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