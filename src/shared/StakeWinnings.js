import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { formatCurrency } from "../utils/stringUtl";


const StakeWinnings = ({ showText, amountWon }) => {
    return (
        <View style={styles.winningsAmount}>
            <Text style={styles.winningsText}>You have won</Text>
            <Text style={[styles.winningsCash, { opacity: showText ? 0 : 1 }]}> &#8358;{formatCurrency(amountWon)}!</Text>
        </View>
    )
}
export default StakeWinnings;

const styles = EStyleSheet.create({
	winningsAmount: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: '.6rem'
	},
	winningsText: {
		textAlign: 'center',
		color: '#000000',
		fontFamily: 'graphik-regular',
		fontSize: '.9rem',
		// lineHeight: '1.5rem'
	},
    winningsCash: {
		textAlign: 'center',
		color: '#EF2F55',
		fontFamily: 'graphik-regular',
		fontSize: '1.2rem',
	},
})