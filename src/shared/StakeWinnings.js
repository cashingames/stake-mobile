import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { formatCurrency } from "../utils/stringUtl";


const StakeWinnings = ({ amountWon }) => {
    return (
        <View style={styles.winningsAmount}>
            <Text style={styles.winningsText}>Winnings</Text>
            <Text style={styles.winningsCash}>NGN {formatCurrency(amountWon)}</Text>
        </View>
    )
}
export default StakeWinnings;

const styles = EStyleSheet.create({
	winningsAmount: {
		flexDirection: 'column',
		marginBottom: '.8rem',
	},
	winningsText: {
		color: '#072169',
		fontFamily: 'gotham-bold',
		fontSize: '1.2rem',
	},
    winningsCash: {
		color: '#072169',
		fontFamily: 'gotham-bold',
		fontSize: '1.1rem',
		marginTop: '.7rem'
	},
})