import React from "react";
import { Text, View, Pressable } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";


const ExhibitionStakeAmount = ({ onPress }) => {

    return (
        <View style={styles.stakeContainer}>
            <Text style={styles.stakeAmount}>Stand a chance of winning up to 1 Million
                Naira by playing this game
            </Text>
            <Pressable style={styles.stakeButton} onPress={onPress}>
                <Text style={styles.showMe}>PLAY NOW</Text>
            </Pressable>
        </View>
    )
}

export default ExhibitionStakeAmount;

const styles = EStyleSheet.create({
    stakeContainer: {
        backgroundColor: '#518EF8',
        borderRadius: 15,
        paddingHorizontal: "2.5rem",
        paddingVertical: "1.3rem",
        marginTop: ".8rem",
        marginBottom: "1rem",
        alignItems: 'center',
        justifyContent: 'center'
    },
    stakeAmount: {
        fontSize: '1.1rem',
        fontFamily: 'graphik-medium',
        color: '#ffff',
        textAlign: 'center',
        lineHeight: '1.65rem'
    },
    stakeButton: {
        marginTop: '1rem',
        borderWidth: 1,
        borderColor: "#ffff",
        paddingVertical: '.8rem',
        paddingHorizontal: '1.3rem',
        borderRadius: 8
    },
    showMe: {
        fontSize: '.8rem',
        fontFamily: 'graphik-regular',
        color: '#ffff',
        textAlign: 'center',
    }
})