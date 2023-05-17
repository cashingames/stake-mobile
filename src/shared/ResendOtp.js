import React, { useEffect, useState } from "react"
import { Pressable, Text, View } from "react-native"
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../utils/normalize";


const ResendOtp = ({ onPress, counter, isCountdownInProgress }) => {


    return (
        <Pressable style={[styles.resendTimerContainer, isCountdownInProgress ? styles.disabled : {}]} onPress={onPress} disabled={isCountdownInProgress}>
            <Text style={[styles.statusText, isCountdownInProgress ? styles.disabledText : {}]}>{!isCountdownInProgress ? 'Resend Otp code' : 'Resend Otp code in'}</Text>
            {isCountdownInProgress &&
                <Text style={styles.resendTimer}> {counter}</Text>
            }
        </Pressable>
    )
}
export default ResendOtp

const styles = EStyleSheet.create({
    resendOtpText: {
        marginTop: '1rem',
    },
    resendText: {
        fontSize: '.9rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    resendTimerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FBFF',
        marginVertical: 20,
        paddingVertical: normalize(19),
        borderWidth: 2,
        borderColor: '#072169',
        borderRadius: 13,
    },
    statusText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        color: '#072169'
    },
    disabledText: {
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        color: '#072169'
    },
    resendTimer: {
        fontSize: '.9rem',
        color: '#E15220',
        fontFamily: 'gotham-medium',
    },
    disabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
        opacity: 0.6
    }
})