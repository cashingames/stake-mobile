import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import normalize from '../../utils/normalize';
// import currency from "../services/currency";
const WalletBalance = ({ balance }) => {
    return (
        <View style={styles.balance}>
            <Text style={styles.walletTitle}>Wallet Balance</Text>
            <Text style={styles.availableAmount}>&#8358;{balance}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    balance: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(38),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        backgroundColor: '#fff',
    },
    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#7C7D7F'
    },
    availableAmount: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(30),
        color: '#333333'
    },
   
});

export default WalletBalance;