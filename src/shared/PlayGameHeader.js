import React from "react";
import { Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const PlayGameHeader = ({ onPress }) => {

    return (
        <View style={styles.header}>
            <View></View>
            <Text style={styles.headerTextStyle}>Trivia game</Text>
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
    headerTextStyle: {
        textAlign: 'center',
        fontSize: '1.2rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
    },
    headerTitle: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
    },

})