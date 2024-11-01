import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';
import AppButton from '../../shared/AppButton';
import LottieAnimations from '../../shared/LottieAnimations';
import normalize from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';

export default ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <View style={styles.container}>
            <LottieAnimations
                animationView={require('../../../assets/transaction-successful.json')}
                width={normalize(100)}
                height={normalize(100)}
            />
            <SuccessText />
            <View style={styles.button}>
                <AppButton onPress={() => navigation.navigate('Login')} text="Continue" />
            </View>
        </View>
    );
}

const SuccessText = () => {
    return (
        <>
            <Text style={styles.headerTextStyle}>
                Successful!
            </Text>
            <Text style={styles.instructionTextStyle}>Your new password has been set.</Text>
            <Text style={styles.instructionTextStyle}>You can now login with the new password.</Text>
        </>
    )
}

    ;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextStyle: {
        fontSize: normalize(24),
        fontFamily: 'graphik-bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: normalize(40)
    },
    instructionTextStyle: {
        fontSize: 15,
        color: '#00000099',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        textAlign: 'center',
        marginTop: normalize(5),
    },
    button: {
        marginTop: normalize(25),
        width: normalize(280)
    },
    successImageStyle: {
        marginBottom: normalize(30),
    }
})