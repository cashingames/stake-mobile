import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Animated from 'react-native-reanimated';
import { randomEnteringAnimation } from '../../utils/utils';
import { useNavigation } from '@react-navigation/core';
import normalize from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";


const HelpPages = () => {
    const navigation = useNavigation();
    useApplyHeaderWorkaround(navigation.setOptions);


    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileTabs}>
                <HelpTab tabName='Contact Us' onPress={() => navigation.navigate('ContactUs')} />
                <HelpTab tabName='FAQ' onPress={() => navigation.navigate('Support')} />
            </View>
        </ScrollView>
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
        backgroundColor: '#FFFF',
        paddingHorizontal: normalize(18),
    },
    profileTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(20)
    },
    tabText: {
        fontSize: '0.93rem',
        fontFamily: 'graphik-regular',
        color: '#151C2F',
    },
    profileTabs: {
        paddingVertical: normalize(25),
        justifyContent: 'center'

    }
})