import React, { useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import AppButton from '../../shared/AppButton';
import { getUser } from '../Auth/AuthSlice';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from '../../shared/LottieAnimations';
import useSound from '../../utils/useSound';

const GameBoostPurchaseSuccessfulScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { playSound } =  useSound(require('../../../assets/sounds/open.wav'))


    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <View style={styles.topContainer}>
            <View style={styles.container}>
                <View style={styles.image}>
                    <LottieAnimations
                        animationView={require('../../../assets/transaction-successful.json')}
                        width={normalize(100)}
                        height={normalize(100)}
                    />
                </View>
                <Text style={styles.paymentHeader}>Payment Successful!</Text>
                <Text style={styles.message}>
                    Your purchased item has been accrued to your account. Continue to enjoy your gaming experience!
                </Text>
            </View>
            <View style={styles.congratsButtons}>
                <AppButton text={"Play a Game"} onPress={() => {
                    playSound()
                    navigation.navigate('Dashboard')
                }}
                    style={styles.actionButton} />
                <AppButton text={"Store"} onPress={() => {
                    playSound
                    navigation.navigate('GameStore')
                }}
                    style={styles.actionButton} />
            </View>
        </View>
    )
}
export default GameBoostPurchaseSuccessfulScreen;


const styles = EStyleSheet.create({
    topContainer: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingTop: responsiveScreenWidth(20),
        paddingHorizontal: responsiveScreenWidth(5),
    },
    container: {
        marginBottom: responsiveScreenWidth(25),
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: responsiveScreenWidth(40)
    },
    actionButton: {
        // marginHorizontal: normalize(15),
        marginTop: normalize(10),
        width: '9rem'
    },
});
