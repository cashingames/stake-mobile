import React, { useState } from "react"
import { TextInput, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import ResendOtp from "./ResendOtp"


const InputOTP = ({ firstDigit, setFirstDigit, secondDigit, setSecondDigit,
    thirdDigit, setThirdDigit, fourthDigit, setFourthDigit, fifthDigit, setFifthDigit,
    onPress, counter, isCountdownInProgress
}) => {


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
                <TextInput
                    style={[styles.input]}
                    value={fifthDigit}
                    onChangeText={setFifthDigit}
                    type="phone"
                    keyboardType="numeric"
                    maxLength={1}
                />
            </View>
            <ResendOtp onPress={onPress} counter={counter} isCountdownInProgress= {isCountdownInProgress} />
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