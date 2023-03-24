import React from "react";
import { Text, Pressable } from 'react-native';
import normalize from "../utils/normalize";
import EStyleSheet from "react-native-extended-stylesheet";


export default function GaButton({ onPress, text, disabled, style, textStyle }) {
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
        marginVertical: 10,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: '#F1D818',
        borderBottomColor: '#B58201',
        borderBottomWidth: 4,
    },
    text: {

        lineHeight: '1rem',
        letterSpacing: 0.25,
        color: '#2D53A0',
        fontFamily: 'blues-smile',
        fontSize: '1rem'
    },
    disabled: {
        backgroundColor: '#DFCBCF',
        borderBottomWidth: 0,
    }

});

