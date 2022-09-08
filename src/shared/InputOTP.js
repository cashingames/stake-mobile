import React, { useState } from "react"
import { TextInput, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import ResendOtp from "./ResendOtp"


const InputOTP = () => {
    const [firstDigit, setFirstDigit] = useState('')
    const [secondDigit, setSecondDigit] = useState('')
    const [thirdDigit, setThirdDigit] = useState('')
    const [fourthDigit, setFourthDigit] = useState('')


    return (
        <View style={styles.otpContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input]}
                    value={firstDigit}
                    onChangeText={setFirstDigit}
                    type="phone"
                    keyboardType="numeric"
                    autoFocus={true}
                    maxLength={1}
                />
                <TextInput
                    style={[styles.input]}
                    value={secondDigit}
                    onChangeText={setSecondDigit}
                    type="phone"
                    keyboardType="numeric"
                    maxLength={1}
                />
                <TextInput
                    style={[styles.input]}
                    value={thirdDigit}
                    onChangeText={setThirdDigit}
                    type="phone"
                    keyboardType="numeric"
                    maxLength={1}
                />
                <TextInput
                    style={[styles.input]}
                    value={fourthDigit}
                    onChangeText={setFourthDigit}
                    type="phone"
                    keyboardType="numeric"
                    maxLength={1}
                />
            </View>
            <ResendOtp />
        </View>
    )
}
export default InputOTP;

const styles = EStyleSheet.create({
    otpContainer: {
        marginVertical: '2.5rem',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        borderWidth: 2.3,
        borderColor: '#E0E0E0',
        paddingVertical: '.5rem',
        paddingHorizontal: '.7rem',
        textAlign: 'center',
        borderRadius: 5,
        color: '#00000080',
        fontSize: '1.5rem',
        // borderColor: '#CDD4DF',
        fontFamily: 'graphik-medium',
    },

})