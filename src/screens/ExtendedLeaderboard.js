import * as React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import HeaderBack from '../components/HeaderBack';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalLeaderboard from '../components/GlobalLeaderboard';
import CategoryLeaderboard from '../components/CategoryLeaderboard';

export default function ExtendedLeaderboard({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('Dashboard')} />
                    <Text style={styles.headerTextStyle}>Extended Leaderboard</Text>
                </View>
                <View style={styles.leaderboards}>
                    <SwiperFlatList showPagination paginationActiveColor='red' >
                        <GlobalLeaderboard />
                        <CategoryLeaderboard category="Music Leaderboard" />
                        <CategoryLeaderboard category="Football Leaderboard" />
                    </SwiperFlatList>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    leaderboards: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
