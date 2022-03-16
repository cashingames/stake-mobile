import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import CategoryLeaderboard from '../../shared/CategoryLeaderboard';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import GlobalTopLeaders from '../../shared/GlobalTopLeaders';
import OtherLeaders from '../../shared/OtherLeaders';
import {
    getCategoryLeaders,
    getCategoryLeadersByDate,
    getGlobalLeaders,
    getGlobalLeadersByDate
} from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-native-date-ranges';
import EStyleSheet from 'react-native-extended-stylesheet';
import { unwrapResult } from '@reduxjs/toolkit';

export default function ExtendedLeaderboard({ navigation }) {

    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.globalLeaders)
    const categoryLeaders = useSelector(state => state.common.categoryLeaders)
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        dispatch(getCategoryLeaders())
        setLoading(false);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getGlobalLeaders())
        }, [])
    );

    if (loading) {
        return <PageLoading />
    }

    const categories = Object.keys(categoryLeaders);
    console.log(categories)
    return (
        <View style={styles.container}>
            <DatePicker
                style={styles.filterContainer}
                customStyles={{
                    placeholderText: { fontSize: 14, color:'#EF2F55' },
                    headerStyle: { backgroundColor: '#FAC502' },
                    headerMarkTitle: { fontSize: 15 },
                    headerDateTitle: { fontSize: 15 },
                }}
                centerAlign
                allowFontScaling={false}
                placeholder={'Filter by Date'}
                mode={'range'}
                markText={'Select date'}
                onConfirm={onFilterLeaders}
                selectedBgColor={'#EF2F55'}
            />
            <ScrollView>
                <SwiperFlatList showPagination paginationActiveColor='red' renderAll={true} >
                    <GlobalLeaderboard leaders={leaders} />
                    {categories.map((c, i) => <CategoryLeaderboard key={i} category={c} leaders={categoryLeaders[c]} />)}
                </SwiperFlatList>
            </ScrollView>
        </View>
    )
}

function GlobalLeaderboard({ leaders }) {
    return (
        <View style={styles.global}>
            <Text style={styles.title}>Global Leaderboard</Text>
            <GlobalTopLeaders leaders={leaders} />
            <OtherLeaders leaders={leaders} />
        </View>

    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    global: {
        paddingHorizontal: normalize(15),
        marginBottom: normalize(10),
    },
    filterContainer: {
        height: normalize(30),
        marginTop: responsiveScreenWidth(1.5),
        borderRadius: 0,
        borderTopWidth: 0,
        borderWidth: .3,
        // width: normalize(100),
        // marginLeft:'1rem',
        backgroundColor: '#FFFF'
    },
    title: {
        fontSize: '0.9rem',
        color: '#000',
        fontFamily: 'graphik-medium',
        lineHeight: '2rem',
        textAlign: 'center',
        marginVertical: normalize(10)
    },
});
