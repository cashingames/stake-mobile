import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text,View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../utils/normalize';

const UserPassword = ({ value, inputLabel, onChangeText, onPress, secureStyle, secure, secureTextEntry }) => {
    return (
        <View>
            <Text style={styles.inputLabel} >{inputLabel}</Text>
            <View style={styles.input}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                />
                <Text onPress={onPress} style={secureStyle} >
                    <Ionicons name={{ secure } ? "eye" : 'eye-off'} size={20} color="#00000080" />
                </Text>
            </View>
        </View>
    )
}
export default UserPassword;

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
        color: '#00000080',
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center',
        // justifyContent:'space-between'

    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8)
    },
});

