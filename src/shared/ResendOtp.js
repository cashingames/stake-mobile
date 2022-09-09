import React from "react"
import { Pressable, Text } from "react-native"
import EStyleSheet from 'react-native-extended-stylesheet';


const ResendOtp = () => {
    return (
        <Pressable style={styles.resendOtpText}>
            <Text style={styles.resendText}>
                Resend OTP
            </Text>
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
})