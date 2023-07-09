import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { formatCurrency } from "../utils/stringUtl";
import { useSelector } from "react-redux";


const StakeWinnings = ({ amountWon }) => {
	const practiceMode = useSelector(state => state.game.practiceMode);
	const cashMode = useSelector(state => state.game.cashMode);

	return (
		<View style={styles.winningsAmount}>
			{cashMode &&
				<Text style={styles.winningsText}>Winnings</Text>
			}
			{practiceMode &&
				<Text style={styles.winningsText}>Demo amount won</Text>
			}
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
		textAlign:'center'
	},
	winningsCash: {
		color: '#072169',
		fontFamily: 'gotham-bold',
		fontSize: '1.1rem',
		marginTop: '.7rem',
		textAlign:'center'
	},
})