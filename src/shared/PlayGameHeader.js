import React from "react";
import { Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const PlayGameHeader = ({ onPress, challengeGame }) => {

    return (
        <View style={styles.header}>
            <Pressable onPress={onPress} style={styles.exitContainer}>
                <Text style={styles.headerTitle}>Exit Game</Text>
            </Pressable>
            <Text style={styles.headerTextStyle}>{challengeGame ?'Challenge Player' : 'Trivia game'}</Text>
            <View></View>
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
    exitContainer: {
        backgroundColor:'#FA5F4A',
        borderRadius:30,
        paddingHorizontal:'.5rem',
        paddingVertical:'.2rem'
    },
    headerTextStyle: {
        textAlign: 'center',
        fontSize: '1.4rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
    },
    headerTitle: {
        fontSize: '0.7rem',
        fontFamily: 'gotham-medium',
        color: '#FFF',
    },

})