import React from "react";
import { StyleSheet, Text, Pressable } from 'react-native';


export default function AppButton({ onPress, text, disabled }) {
    return (

        <Pressable
            onPress={onPress}
            style={() => [
                {
                    backgroundColor: disabled
                        ? '#DFCBCF'
                        : '#EF2F55'
                },
                styles.button
            ]}
            disabled={disabled}
        >
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 32,
        marginVertical: 30,
        borderRadius: 12,
        elevation: 3,
    },
    text: {

        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: 18
    },

});

