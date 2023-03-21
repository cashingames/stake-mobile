import React from "react";
import { Text } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";

export default function AuthTitle({ text, style }) {
    return <Text style={[styles.titleText, style]}>{text}</Text>;
}

const styles = EStyleSheet.create({
    titleText: {
        textAlign: 'center',
        fontFamily: 'graphik-bold',
        fontSize: '1.55rem',
    },

});
