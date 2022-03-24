import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import {
    getCategoryLeadersByDate,
    getGlobalLeadersByDate
} from '../CommonSlice';
import DatePicker from 'react-native-date-ranges';
import { unwrapResult } from '@reduxjs/toolkit';
import EStyleSheet from 'react-native-extended-stylesheet';


const LeaderBoardFilter = () => {
    const dispatch = useDispatch();

    const onFilterLeaders = (dateRange) => {
        const startDate = Math.floor(new Date(dateRange.startDate).getTime() / 1000);
        const endDate = Math.floor(new Date(dateRange.endDate).getTime() / 1000);
        console.log(startDate);
        console.log(endDate);

        const sortedLeaders = () => {
            dispatch(getGlobalLeadersByDate({
                startDate,
                endDate
            }
            ))
            dispatch(getCategoryLeadersByDate({
                startDate,
                endDate
            }
            ))
                .then(unwrapResult)
                .then((originalPromiseResult) => {
                    console.log('fetched')
                })
                .catch((rejectedValueOrSerializedError) => {
                    console.log(rejectedValueOrSerializedError)
                })
        }
        sortedLeaders();
    }



    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Extended Leaderboard</Text>
            <Pressable style={styles.container}>
                <DatePicker
                    style={styles.filterContainer}
                    customStyles={{
                        placeholderText: { fontSize: 14, color: '#EF2F55' },
                        headerStyle: { backgroundColor: '#FAC502' },
                        headerMarkTitle: { fontSize: 15 },
                        headerDateTitle: { fontSize: 15 },
                    }}
                    centerAlign
                    allowFontScaling={false}
                    placeholder={'Sort by Date'}
                    mode={'range'}
                    markText={'Select date'}
                    onConfirm={onFilterLeaders}
                    selectedBgColor={'#EF2F55'}
                />
            </Pressable>
        </View>
    )
}
export default LeaderBoardFilter;

const styles = EStyleSheet.create({
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: '.9rem',
        color: "#000000",
        fontFamily: 'graphik-medium',
    },
    container: {
        marginLeft: responsiveScreenWidth(11),
        width: normalize(80),
    },
    filterContainer: {
        borderRadius: 0,
        borderTopWidth: 0,
        borderWidth: 0,
        backgroundColor: '#FFFF',
    },

});

