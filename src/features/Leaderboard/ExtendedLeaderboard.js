import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import CategoryLeaderboard from '../../shared/CategoryLeaderboard';
import normalize from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import { getData } from '../../utils/ApiHelper';
import GlobalTopLeaders from '../../shared/GlobalTopLeaders';
import OtherLeaders from '../../shared/OtherLeaders';
import { getGlobalLeaders } from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function ExtendedLeaderboard({ navigation }) {

    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.globalLeaders)
    const [categoryLeaders, setCategoryLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        var _2 = getData('v2/leaders/categories').then(response => setCategoryLeaders(response.data))

        Promise.all([_2]).then(values => {
            setLoading(false);
        });
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

    return (
        <ScrollView style={styles.container}>
            <SwiperFlatList showPagination paginationActiveColor='red' renderAll={true} >
                <GlobalLeaderboard leaders={leaders} />
                {categories.map((c, i) => <CategoryLeaderboard key={i} category={c} leaders={categoryLeaders[c]} />)}
            </SwiperFlatList>
        </ScrollView>
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
    title: {
        fontSize: '0.9rem',
        color: '#000',
        fontFamily: 'graphik-medium',
        lineHeight:'2rem',
        textAlign: 'center',
        marginVertical: normalize(10)
    },
});
