import React from 'react';
import { Text, View, ImageBackground, Dimensions } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from '../../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../shared/AppButton';
import { Image } from 'react-native';


export default function WithdrawalSuccessScreen() {
    const navigation = useNavigation()

    return (
        <ImageBackground source={require('../../../assets/images/success-background.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height, paddingHorizontal: 20}}
            resizeMethod="resize">
            <View style={styles.container}>
                <TransactionSuccessful />
            </View>
            <AppButton onPress={() => navigation.navigate('Wallet')} text='Okay, got it' />
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
            <Text style={styles.successTitle}>Withdrawal successful</Text>
        </View>
    )
};



const styles = EStyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
    },
    success: {
        alignItems:'center',
        marginHorizontal: normalize(15),
        marginVertical: normalize(200)
    },
    successTitle: {
        fontFamily: 'gotham-medium',
        fontSize: '1.5rem',
        color: '#072169',
        alignItems: 'center',
        textAlign: 'center',
        marginTop:'2rem'
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