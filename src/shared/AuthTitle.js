import React from "react";
import { Text } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";

export default function AuthTitle({ text }) {
    return <Text style={styles.titleText}>{text}</Text>;
}

const styles = EStyleSheet.create({
    titleText: {
        textAlign: 'center',
        fontFamily: 'graphik-bold',
        fontSize: '1.55rem',
    },

});
