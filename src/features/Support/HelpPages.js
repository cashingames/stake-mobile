import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Animated from 'react-native-reanimated';
import { randomEnteringAnimation } from '../../utils/utils';
import normalize, { responsiveScreenHeight } from "../../utils/normalize";
import { useDispatch } from "react-redux";
import { logoutUser } from "../Auth/AuthSlice";
import Constants from 'expo-constants';


const HelpPages = ({ navigation }) => {
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logoutUser());
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.profileTabs}>
                    <HelpTab tabName='Contact Us' onPress={() => navigation.navigate('ContactUs')} />
                    <HelpTab tabName='FAQ' onPress={() => navigation.navigate('Support')} />
                </View>
            </ScrollView>
            <View style={styles.logoutContainer}>
                <Text style={styles.appVersion}>App version: {Constants.expoConfig.version}</Text>
                <Pressable onPress={onLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
            </View>
        </View>
    )
}

const HelpTab = ({ tabName, onPress }) => {
    return (
        <Animated.View entering={randomEnteringAnimation().duration(1000)}>
            <Pressable onPress={onPress} style={styles.profileTab}>
                <Text style={styles.tabText}>{tabName}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#524D4D" />
            </Pressable>
        </Animated.View>
    )
}

export default HelpPages;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        justifyContent: 'space-between',
    },
    contentContainer: {
        // flex: 1,
        backgroundColor: '#F2F5FF',
    },
    profileTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(18)
    },
    tabText: {
        fontSize: '0.93rem',
        fontFamily: 'graphik-regular',
        color: '#151C2F',
    },
    profileTabs: {
        paddingVertical: normalize(25),
        justifyContent: 'center'

    },
    logoutContainer: {
        paddingHorizontal: normalize(18),
        // justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom:'1rem'
    },
    logoutText: {
        color: '#EF2F5F',
        textAlign: 'center',
        fontSize: '0.75rem',
        fontFamily: 'sansation-bold',
        paddingVertical: responsiveScreenHeight(1),

    },
    appVersion: {
        color: '#000000',
        fontSize: '0.8rem',
        fontFamily: 'sansation-regular',
        opacity: 0.7,
        textAlign: 'center',
    },
})