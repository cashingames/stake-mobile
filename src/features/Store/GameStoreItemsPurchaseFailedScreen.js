import React from 'react';
import {Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';

const GameStoreItemsPurchaseFailed = () => {
    const user = useSelector(state => state.auth.user)
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.image}>
                <Image
                    style={styles.failure}
                    source={require('../../../assets/images/failure.png')}
                />
            </View>
            <Text style={styles.paymentHeader}>Purchase Failed</Text>
            <Text style={styles.message}>Sorry purchase failed please try again</Text>
            <View style={styles.congratsButtons}>
                <AppButton text={"Store"} onPress={() => navigation.navigate('GameStore')} style={styles.actionButton} />
                <AppButton text={"Home"} onPress={() => navigation.navigate('Home')} style={styles.actionButton} />
            </View>
        </View>
    )
}
export default GameStoreItemsPurchaseFailed;


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
   failure: {
        width: normalize(65),
        height: normalize(65),
        marginVertical: normalize(10),
    },
    paymentHeader: {
        fontFamily: 'graphik-medium',
        fontSize: '1.2rem',
        textAlign: 'center',
        color: '#151C2F',
        marginTop: responsiveScreenWidth(5)
    },
    message: {
        fontFamily: 'graphik-regular',
        fontSize: '0.95rem',
        textAlign: 'center',
        color: '#535761',
        lineHeight: '1.6rem',
        marginTop: responsiveScreenWidth(15)
    },
    congratsButtons: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: responsiveScreenWidth(50)
    },
    actionButton: {
        marginHorizontal: normalize(15),
        marginVertical: normalize(10)
    },
});
