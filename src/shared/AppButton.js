import React from "react";
import { Text, Pressable } from 'react-native';
import normalize from "../utils/normalize";
import EStyleSheet from "react-native-extended-stylesheet";


export default function AppButton({ onPress, text, disabled, style, textStyle }) {
    return (

        <Pressable
            onPress={onPress}
            style={[styles.button, disabled ? styles.disabled : {}, style]}
            disabled={disabled}
        >
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </Pressable>
    );

}

const styles = EStyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(28),
        marginVertical: 30,
        borderRadius: 12,
        elevation: 3,
        backgroundColor: '#EF2F55'
    },
    text: {

        lineHeight: '1rem',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: '0.9rem'
    },
    disabled: {
        backgroundColor: '#DFCBCF'
    }

});

