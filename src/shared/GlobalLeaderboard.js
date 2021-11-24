import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import normalize from '../utils/normalize';
import GlobalTopLeaders from './GlobalTopLeaders';
import OtherLeaders from './OtherLeaders';



function GlobalLeaderboard({ leaders }) {
    return (
        <ScrollView>
            <View style={styles.global}>
                <Text style={styles.title}>Global Leaderboard</Text>
                <GlobalTopLeaders />
                <OtherLeaders />
            </View>
        </ScrollView>
    )
}
export default GlobalLeaderboard;

const styles = StyleSheet.create({

    global: {
        paddingVertical: normalize(20),
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
