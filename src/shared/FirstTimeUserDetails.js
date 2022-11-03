import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import AppButton from "./AppButton";
import Input from "./Input";

const FirstTimeUserDetails = ({ onPress,
    password,
    password_confirmation,
    phoneNumber,
    username,
    referrer,
    phoneNumberErr, onChangePhoneNumber,
    passErr, onChangeConfirmPassword,
    onChangeUserName, usernameErr,
    onChangePassword, onChangReferrer,
    canSave, saving
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Please input your details</Text>

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
                type="password"
                label='Password'
                value={password}
                placeholder="Enter password"
                error={passErr && '*password must not be less than 8 digits'}
                onChangeText={text => { onChangePassword(text) }}
            />

            <Input
                type="password"
                label='Password'
                value={password_confirmation}
                placeholder="Confirm password"
                error={password_confirmation !== password && '*password confirmation must match password'}
                onChangeText={text => { onChangeConfirmPassword(text) }}
            />
            <Input
                label='Referral'
                value={referrer}
                placeholder="Input referral code(optional)"
                onChangeText={text => { onChangReferrer(text) }}

            />

            <AppButton onPress={onPress}
                text={saving ? 'Saving' : 'Proceed'}
                disabled={!canSave}
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
    }
})