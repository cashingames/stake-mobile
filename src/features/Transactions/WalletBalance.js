import React from 'react';
import {Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
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
        paddingVertical: responsiveScreenWidth(15),
        borderColor: '#E5E5E5',
        borderBottomWidth: normalize(3),
        backgroundColor: '#fff',
    },
    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
        color: '#7C7D7F'
    },
    availableAmount: {
        fontFamily: 'graphik-bold',
        fontSize: '2.2rem',
        color: '#333333'
    },

});

export default WalletBalance;