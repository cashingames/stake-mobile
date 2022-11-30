import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import AppButton from "./AppButton";
import Input from "./Input";

const FirstTimeUserDetails = ({ onPress,
    phoneNumber,
    username,
    referrer,
    phoneNumberErr, onChangePhoneNumber,
    onChangeUserName, usernameErr,
    onChangReferrer,
    canSave, saving
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Please input your details</Text>
            <View style={styles.inputBoxes}>
                <Input
                    label='Username'
                    placeholder="John"
                    value={username}
                    error={usernameErr && '*username must not be empty'}
                    onChangeText={text => onChangeUserName(text)}
                />

                <Input
                    label='Phone Number'
                    placeholder="080xxxxxxxx"
                    value={phoneNumber}
                    onChangeText={text => { onChangePhoneNumber(text) }}
                    error={phoneNumberErr && '*input a valid phone number'}
                    keyboardType="numeric"
                />
                <Input
                    label='Referral'
                    value={referrer}
                    placeholder="Input referral code(optional)"
                    onChangeText={text => { onChangReferrer(text) }}

                />
            </View>

            <AppButton onPress={onPress}
                text={saving ? 'Saving' : 'Proceed'}
                disabled={!canSave || saving}
            />
        </View>
    )
}
export default FirstTimeUserDetails;

const styles = EStyleSheet.create({
    inputContainer: {
        paddingHorizontal: normalize(18)
    },
    inputText: {
        color: '#000000',
        fontFamily: 'graphik-medium',
        fontSize: '0.8rem',
        textAlign: 'center',
        paddingVertical: normalize(5)
    },
    inputBoxes: {
        marginTop: '2.5rem'
    },
})