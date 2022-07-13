import React from 'react';
import { Text, View, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from '../../shared/LottieAnimations';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { formatCurrency } from '../../utils/stringUtl';

const WalletBalance = ({ balance }) => {
    return (
        <View style={styles.balance}>
            <Text style={styles.walletTitle}>Wallet Balance</Text>
            <Text style={styles.availableAmount}>&#8358;{formatCurrency(balance)}</Text>
            <LottieAnimations
                animationView={require('../../../assets/moneybag.json')}
                width={normalize(100)}
                height={normalize(100)}
            />
        </View>
    )
};

const styles = EStyleSheet.create({
    balance: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsiveScreenWidth(10),
        borderColor: '#E5E5E5',
        backgroundColor: '#fff',
        borderBottomWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3)
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