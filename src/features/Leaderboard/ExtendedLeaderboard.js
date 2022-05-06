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
    getGlobalLeaders,
} from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';


export default function ExtendedLeaderboard() {

    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.globalLeaders)
    const categoryLeaders = useSelector(state => state.common.categoryLeaders)
    const [loading, setLoading] = useState(true);


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
    title: {
        fontSize: '0.9rem',
        color: '#000',
        fontFamily: 'graphik-medium',
        lineHeight: '2rem',
        textAlign: 'center',
        marginVertical: normalize(10)
    },
    dateRange: {
        borderRadius: 5,
        borderColor: '#CDD4DF',
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: responsiveScreenWidth(5),
        marginTop: responsiveScreenWidth(3)
    }
});
