import React from 'react';
import {Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';
import { formatCurrency } from '../../utils/stringUtl';

const WalletBalance = ({ balance }) => {
    return (
        <View style={styles.balance}>
            <Text style={styles.walletTitle}>Wallet Balance</Text>
            <Text style={styles.availableAmount}>&#8358;{formatCurrency(balance)}</Text>
        </View>
    )
};

const styles = EStyleSheet.create({
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
        fontSize: '0.7rem',
        color: '#7C7D7F'
    },
    availableAmount: {
        fontFamily: 'graphik-bold',
        fontSize: '2.3rem',
        color: '#333333'
    },

});

export default WalletBalance;