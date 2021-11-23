import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Image, Text, TouchableOpacity, View } from 'react-native';
import normalize from '../utils/normalize';


const SignInInput = ({ value, inputLabel, onChange, maxLength, keyboardType }) => {
    return (
        <View>
            <Text style={styles.inputLabel} >{inputLabel}</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                maxLength={maxLength}
                keyboardType={keyboardType}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    input: {
        height: normalize(38),
        marginBottom: normalize(15),
        borderWidth: normalize(1),
        borderRadius: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#00000080'

    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8)
    },
});

export default SignInInput