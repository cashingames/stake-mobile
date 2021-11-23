import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../utils/normalize';

const UserPassword = ({ value, inputLabel, onChangeText }) => {
    const [hidden, setHidden] = useState(true);

    const toggleSecureText = () => {
        setHidden(!hidden);
    }

    return (
        <View>
            <Text style={styles.inputLabel} >{inputLabel}</Text>
            <View style={styles.input}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={hidden}
                />
                <Text onPress={toggleSecureText} style={styles.passwordIcon} >
                    <Ionicons name={hidden ? "eye" : 'eye-off'} size={20} color="#00000080" />
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
        alignItems: 'center',

    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8)
    },
    passwordIcon: {
        position: 'absolute',
        right: '5%',
        top: '55%',
        transform: [{ translateY: normalize(-8) }],
        zIndex: 2,

    },
});

