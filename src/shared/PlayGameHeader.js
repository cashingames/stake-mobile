import React from "react";
import { Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import BoostsInfo from "./BoostInfo";

const PlayGameHeader = ({ onPress, onPressBoost }) => {

    return (
        <View style={styles.header}>
            <BoostsInfo onPress={onPressBoost} />
            <Pressable onPress={onPress}>
                <Text style={styles.headerTitle}>Exit</Text>
            </Pressable>
        </View>
    )
};
export default PlayGameHeader;

const styles = EStyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: '0.82rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
    },
})