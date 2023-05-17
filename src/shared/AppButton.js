import React from "react";
import { Text, Pressable, View } from 'react-native';
import normalize from "../utils/normalize";
import EStyleSheet from "react-native-extended-stylesheet";
import { Ionicons } from "@expo/vector-icons";


export default function AppButton({ onPress, text, disabled, style, textStyle, isIcon, iconColor, disabledStyle }) {
    return (

        <Pressable
            onPress={onPress}
            style={[styles.button, disabled ? disabledStyle : {}, style]}
            disabled={disabled}
        >
            <View style={styles.textContainer}>
                <Text style={[styles.text, textStyle]}>{text}</Text>
                {isIcon &&
                    <Ionicons name="chevron-forward" size={22} color={iconColor} />
                }
            </View>
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
        borderRadius: 13,
        elevation: 3,
        backgroundColor: '#E15220',
    },
    text: {

        lineHeight: '1rem',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: '0.9rem'
    },
    textContainer: {
        flexDirection: "row",
        alignItems: 'center'
    },
    disabled: {
        backgroundColor: '#DFCBCF'
    }

});

