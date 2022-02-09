import React from "react";
import {Text, View} from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
// import { Text, View } from './Themed';
import normalize from '../utils/normalize';

export default function AuthTitle({ text }) {

    return (
        <View >
            <Text style={styles.titleText}>{text}</Text>
        </View>
    );



}

const styles = EStyleSheet.create({
    titleText: {
        textAlign: 'center',
        fontFamily: 'graphik-bold',
        fontSize: '1.55rem',
    },

});
