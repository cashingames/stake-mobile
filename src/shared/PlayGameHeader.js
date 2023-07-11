import React from "react";
import { Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const PlayGameHeader = ({ onPress, challengeGame }) => {

    return (
        <View style={styles.header}>
            <Pressable onPress={onPress} style={styles.exitContainer}>
                <Text style={styles.headerTitle}>X</Text>
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
        width:'2rem',
        height:'2rem',
        borderRadius:50,
        backgroundColor:'#EEEEEE',
        alignItems:'center',
        justifyContent:'center'
    },
    headerTextStyle: {
        textAlign: 'center',
        fontSize: '1.2rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
    },
    headerTitle: {
        fontSize: '1.5rem',
        fontFamily: 'sansation-regular',
        color: '#072169',
    },

})