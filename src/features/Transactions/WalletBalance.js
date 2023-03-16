import React from 'react';
import { Text, View, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from '../../shared/LottieAnimations';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { formatCurrency } from '../../utils/stringUtl';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../shared/AppButton';
import useSound from '../../utils/useSound';



const WalletBalance = ({ balance }) => {
    return (
        <>
            <View style={styles.balance}>
                <View style={styles.balanceTop}>
                    <Text style={styles.walletTitle}>Deposit Balance</Text>
                    <View style={styles.animationView}>
                        <LottieAnimations
                            animationView={require('../../../assets/moneybag.json')}
                            // width={normalize(50)}
                            height={normalize(50)}
                        />
                    </View>
                    <Text style={styles.availableAmount}>&#8358;{formatCurrency(balance)}</Text>
                </View>
            </View>
            <Text style={styles.borderLine}></Text>
        </>
    )
};


const styles = EStyleSheet.create({
    balance: {
        display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#000059',
        marginHorizontal: normalize(30),
        opacity: 0.8,
        borderRadius: 15,
        paddingVertical: '.8rem',
    },
    animationView: {
        alignItems: 'center',
    },
    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '0.8rem',
        color: '#7C7D7F',
        textAlign: 'center'
    },
    availableAmount: {
        fontFamily: 'graphik-bold',
        fontSize: '1.6rem',
        color: '#FFFF',
        textAlign: 'center',
        marginBottom: '.6rem'
    },
    balanceTop: {
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderBottomWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
    },
    buttonContainer: {
        marginHorizontal: '1rem',
        marginTop: '.6rem'
    },
    button: {
        // alignItems: 'center',
        // justifyContent: 'center',
        // paddingVertical: normalize(15),
        // paddingHorizontal: normalize(28),
        // marginHorizontal: normalize(18),
        borderRadius: 12,
        elevation: 3,
        marginVertical: '.3rem',

    },
    borderLine: {
        borderBottomWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    }

});

export default WalletBalance;