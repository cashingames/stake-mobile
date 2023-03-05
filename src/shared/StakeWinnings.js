import React from "react";
import { Platform, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../utils/normalize";
import { formatCurrency } from "../utils/stringUtl";


const StakeWinnings = ({ amountWon }) => {
    return (
        <View style={styles.winningsAmount}>
            <Text style={styles.winningsText}>You have won</Text>
            <Text style={styles.winningsCash}> &#8358;{formatCurrency(amountWon)}!</Text>
        </View>
    )
}
export default StakeWinnings;

const styles = EStyleSheet.create({
	winningsAmount: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: '.6rem',
		padding: Platform.OS === 'ios' ? normalize(25) : normalize(20),
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
		color: '#000000',
		fontFamily: 'graphik-bold',
		fontSize: '1.2rem',
	},
})