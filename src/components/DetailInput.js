import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { normalize } from '../constants/NormalizeFont';


const DetailInput = ({ value, inputLabel, onChange, maxLength, keyboardType, style }) => {

    return (
        <View style={styles.detail}>
            <Text style={styles.inputLabel}>{inputLabel}</Text>
            <TextInput
                style={style}
                onChangeText={onChange}
                value={value}
                maxLength={maxLength}
                keyboardType={keyboardType}
            />
        </View>
    )
}
export default DetailInput;

const styles = StyleSheet.create({
  
    detail: {
        marginVertical: normalize(10)
    },
    inputLabel: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: normalize(5)
    },
    input: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        padding: normalize(6),
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#000000',
    },
});
