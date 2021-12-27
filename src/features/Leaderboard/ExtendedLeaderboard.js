import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryLeaderboard from '../../shared/CategoryLeaderboard';
import normalize from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import { getData } from '../../utils/ApiHelper';
import GlobalTopLeaders from '../../shared/GlobalTopLeaders';
import OtherLeaders from '../../shared/OtherLeaders';

export default function ExtendedLeaderboard({ navigation }) {

    const [leaders, setLeaders] = useState([]);
    const [categoryLeaders, setCategoryLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        var _3 = getData('v2/leaders/global').then(response => setLeaders(response.data))
        var _2 = getData('v2/leaders/categories').then(response => setCategoryLeaders(response.data))

        Promise.all([_3, _2]).then(values => {
            setLoading(false);
        });
    }, []);

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    leaderboards: {
        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'center'
    },
    global: {
        paddingHorizontal: normalize(15),
        marginBottom: normalize(10),
    },
    title: {
        fontSize: normalize(16),
        color: '#000',
        fontFamily: 'graphik-medium',
        lineHeight: normalize(30),
        textAlign: 'center',
        marginVertical: normalize(10)
    },
});
