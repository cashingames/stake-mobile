import React from 'react';
import {Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from '../../shared/LottieAnimations';

const GamePlanPurchaseSuccessfulScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.image}>
                <LottieAnimations
                    animationView={require('../../../assets/transaction-successful.json')}
                    width={normalize(100)}
                    height={normalize(100)}
                />
            </View>
            <Text style={styles.paymentHeader}>Payment Successful</Text>
            <Text style={styles.message}>You successfully purchased a game plan to continue playing games, climb up the leaderboard and win great prizes</Text>
            <View style={styles.congratsButtons}>
                <AppButton text={"Play a Game"} onPress={() => navigation.navigate('Game')} style={styles.actionButton} />
                <AppButton text={"Store"} onPress={() => navigation.navigate('GameStore')} style={styles.actionButton} />
            </View>
        </View>
    )
}
export default GamePlanPurchaseSuccessfulScreen;


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingVertical: responsiveScreenWidth(20),
        paddingHorizontal: responsiveScreenWidth(5),
    },
    image: {
        alignItems: 'center',
        marginVertical: normalize(15)
    },
   success: {
        width: normalize(65),
        height: normalize(65),
        marginVertical: normalize(10),
    },
    paymentHeader: {
        fontFamily: 'graphik-medium',
        fontSize: '1rem',
        textAlign: 'center',
        color: '#151C2F',
    },
    message: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(15),
        textAlign: 'center',
        color: '#535761',
        lineHeight: '1.6rem',
        marginTop: normalize(35)
    },
    congratsButtons: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: responsiveScreenWidth(40)
    },
    actionButton: {
        marginHorizontal: normalize(15),
        marginVertical: normalize(10)
    },
});
