import React, { useEffect, useState } from "react"
import { Pressable, Text, View } from "react-native"
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../utils/normalize";


const ResendOtp = ({ onPress, isCountdownInProgress, countdowvnDone }) => {


    return (
        <Pressable style={[styles.resendTimerContainer, isCountdownInProgress || countdowvnDone ? styles.disabled : {}]} onPress={onPress} disabled={isCountdownInProgress || countdowvnDone}>
            <Text style={[styles.statusText, isCountdownInProgress || countdowvnDone ? styles.disabledText : {}]}>Resend Otp code</Text>
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
        borderColor: '#1C453B',
        borderRadius: 13,
    },
    statusText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        color: '#1C453B'
    },
    disabledText: {
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        color: '#1C453B'
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