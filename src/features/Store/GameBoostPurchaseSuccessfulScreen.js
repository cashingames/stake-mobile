import React, {useEffect} from 'react';
import {Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import AppButton from '../../shared/AppButton';
import { getUser } from '../Auth/AuthSlice';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';

const GameBoostPurchaseSuccessfulScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
  

    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.image}>
                <Image
                    style={styles.success}
                    source={require('../../../assets/images/success.png')}
                />
            </View>
            <Text style={styles.paymentHeader}>Payment Successful</Text>
            <Text style={styles.message}>You successfully purchased a boost to continue playing games, climb up the leaderboard and win great prizes</Text>
            <View style={styles.congratsButtons}>
                <AppButton text={"Play a Game"} onPress={() => navigation.navigate('Game')} style={styles.actionButton} />
                <AppButton text={"Store"} onPress={() => navigation.navigate('GameStore')} style={styles.actionButton} />
            </View>
        </View>
    )
}
export default GameBoostPurchaseSuccessfulScreen;


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
