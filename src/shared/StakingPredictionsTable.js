import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { formatCurrency } from "../utils/stringUtl";
import normalize from "../utils/normalize";



const StakingPredictionsTable = ({ gameStake, position, amount, containerStyle }) => {
    return (
        <View style={[styles.stakeSub, containerStyle]}>
            <View style={styles.stakeScoreContainer}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#333333" />
                <Text style={styles.stakeScoreDigit}>{gameStake.score}</Text>
            </View>
            <View style={styles.stakeNumber}>
                <Ionicons name="time-outline" size={16} color="#FF932F" />
                <Text style={styles.stakeOddDigit}>x{gameStake.odd}</Text>
            </View>
            <Text style={styles.stakeWinnings}>&#8358;{formatCurrency(amount * gameStake.odd)}</Text>
        </View>
    )
}

export default StakingPredictionsTable;

const styles = EStyleSheet.create({
    stakeSub: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: normalize(20),

    },
    stakeOddDigit: {
        fontFamily: "graphik-medium",
        fontSize: ".8rem",
        color: "#FF932F",
        marginLeft: '.3rem',
    },
    stakeScoreDigit: {
        fontFamily: "graphik-medium",
        fontSize: ".8rem",
        color: "#333333",
        marginLeft: '.3rem',
        opacity: 0.7
    },
    stakeWinnings: {
        fontFamily: "graphik-medium",
        fontSize: ".8rem",
        color: "#333333",
        width: '4.8rem',
        alignItems:'flex-start'
    },
    stakeNumber: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '3rem',
        marginLeft:'1rem'
    },
    stakeScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '2rem',
        marginLeft:'1rem'
    },

})