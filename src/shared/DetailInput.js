import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import normalize from '../utils/normalize';


const DetailInput = ({ value, inputLabel, onChangeText, maxLength, keyboardType, style, editable, error }) => {

    return (
        <View style={styles.detail}>
            <Text style={styles.inputLabel}>{inputLabel}</Text>
            <TextInput
                style={style}
                onChangeText={onChangeText}
                value={value}
                maxLength={maxLength}
                keyboardType={keyboardType}
                editable={editable}
            />
             {error && <Text style={styles.error} >{error}</Text>}
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
    error: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    }
});
