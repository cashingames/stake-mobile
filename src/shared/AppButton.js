import React from "react";
import { Text, Pressable, View } from 'react-native';
import normalize from "../utils/normalize";
import EStyleSheet from "react-native-extended-stylesheet";
import { Ionicons } from "@expo/vector-icons";


export default function AppButton({ onPress, text, disabled, style, textStyle, isIcon, iconColor }) {
    return (

        <Pressable
            onPress={onPress}
            style={[styles.button, disabled ? styles.disabled : {}, style]}
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
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: '1.2rem'
    },
    textContainer: {
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor:'none'
    },
    disabled: {
        backgroundColor: '#EA8663'
    }

});

