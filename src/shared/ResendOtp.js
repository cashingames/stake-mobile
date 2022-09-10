import React, { useEffect, useState } from "react"
import { Pressable, Text, View } from "react-native"
import EStyleSheet from 'react-native-extended-stylesheet';


const ResendOtp = ({ onPress, counter, isCountdownInProgress }) => {


    return (
        <View style={styles.resendOtpText}>
            {isCountdownInProgress &&
                <View style={styles.resendTimerContainer}>
                    <Text style={styles.statusText}>Resend OTP in </Text>
                    <Text style={styles.resendTimer}>{counter}</Text>
                </View>
            }
            {!isCountdownInProgress &&
                <Pressable onPress={onPress}>
                    <Text style={styles.resendText}>
                        Resend OTP
                    </Text>
                </Pressable>
            }
        </View>
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
        justifyContent: 'center'
    },
    resendTimer: {
        fontSize: '.75rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
    },
    statusText: {
        fontSize: '.75rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    }
})