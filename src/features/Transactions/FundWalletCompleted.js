import React, { useEffect } from 'react';
import { Text, View, ImageBackground, Dimensions, Alert } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from '../../utils/normalize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AppButton from '../../shared/AppButton';
import { Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';


export default function FundWalletCompleted() {
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        dispatch(getUser())
    }, [])

    return (
        <ImageBackground source={require('../../../assets/images/success-background.png')}
            style={styles.mainContainer}
            resizeMethod="resize">
            <View style={styles.container}>
                <TransactionSuccessful />
                {user.showRegistrationBonusNotice === true &&
                    <WelcomeBonusNotification user={user} />
                }
            </View>
            <AppButton onPress={() => navigation.navigate('Wallet')} text={user.showRegistrationBonusNotice === false ? 'Okay, got it' : 'View Bonus'} />
        </ImageBackground>
    );
}
const TransactionSuccessful = () => {
    return (
        <View style={styles.success}>
            <Image
                style={styles.unavailable}
                source={require('../../../assets/images/success-mark.png')}
            />
            <Text style={styles.successTitle}>Deposit successful</Text>
        </View>
    )
};

const WelcomeBonusNotification = ({ user }) => {
    return (
        <View style={styles.bonusContainer}>
            <Image
                style={styles.confetti}
                source={require('../../../assets/images/bonus-confetti.png')}
            />
            <View style={styles.bonusTextContainer}>
                <Text style={styles.bonusMessage}>Hello {user.firstName} you have received a bonus in your bonus wallet</Text>
                <Text style={styles.bonusAmount}>NGN {user.bonusBalance}</Text>
            </View>
        </View>
    )
}



const styles = EStyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: normalize(20)
    },
    container: {
        // flex: 1,
    },
    success: {
        alignItems: 'center',
        marginHorizontal: normalize(15),
        marginBottom: normalize(80)
    },
    successTitle: {
        fontFamily: 'gotham-medium',
        fontSize: '1.5rem',
        color: '#072169',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: '2rem'
    },
    bonusContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 13,
        paddingHorizontal: '.7rem',
        paddingVertical: '.4rem',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
    },
    bonusTextContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: '.4rem'
    },
    bonusAmount: {
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        color: '#072169',
        marginTop: '.3rem'
    },
    confetti: {
        width: '4.5rem',
        height: '4.5rem'
    },
    bonusMessage: {
        fontFamily: 'gotham-medium',
        fontSize: normalize(15),
        color: '#072169',
        width: '12rem',
        lineHeight: normalize(22),
    },
    successText: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(13),
        color: '#4F4F4F',
        alignItems: 'center',
        textAlign: 'center',
        lineHeight: normalize(22),
        marginVertical: normalize(15)
    },
    buttonContainer: {
        // borderColor: 'rgba(0, 0, 0, 0.15)',
        // borderBottomWidth: normalize(1),
        paddingVertical: normalize(20),
        backgroundColor: '#fff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        marginHorizontal: normalize(18),
        borderRadius: 12,
        elevation: 3,
    },
    doneButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFFF'
    },


});
