import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";
import GlobalTopLeaders from "./GlobalTopLeaders";
import { copilot, CopilotStep } from "react-native-copilot";


const GlobalTopLeadersHero = ({ copilot }) => {
    const navigation = useNavigation();
    const leaders = useSelector(state => state.common.globalLeaders)

    return (
        <View style={styles.leaderboard} {...copilot}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Global Leaders</Text>
                <View style={styles.extended}>
                    <Text onPress={() => navigation.navigate('Leaderboard')}>
                        <Text style={styles.extendedText}>Extended Leaderboard</Text>
                    </Text>
                    <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
                </View>
            </View>
            <GlobalTopLeaders leaders={leaders} />
        </View>
    )
}
export default  copilot()(GlobalTopLeadersHero);

const styles = StyleSheet.create({
    leaderboard: {
        // paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        // marginBottom: normalize(30)
    },
    leaderboardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(8)
    },
    extended: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    extendedText: {
        fontSize: normalize(9),
        color: '#EF2F55',
        fontFamily: 'graphik-bold',
    },
    title: {
        fontSize: normalize(15),
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(15),
        marginTop: normalize(10),
    },
})