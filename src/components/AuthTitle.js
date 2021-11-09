import React from "react";
import { StyleSheet , Text, View} from 'react-native';
// import { Text, View } from './Themed';
import { normalize } from "../constants/NormalizeFont";

export default function AuthTitle({ text }) {

    return (
        <View >
            <Text style={styles.titleText}>{text}</Text>
        </View>
    );



}

const styles = StyleSheet.create({
    titleText: {
        textAlign: 'center',
        fontFamily: 'graphik-bold',
        fontSize: 25,
    },

});
