import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import normalize from '../utils/normalize';

import { Ionicons } from '@expo/vector-icons';


export default function (props) {
    const { label, type, error, editable } = props;

    const [hidden, setHidden] = useState(type === "password");

    const toggleSecureText = () => {
        setHidden(!hidden);
    }

    //if the param is not passed or it is passed as true, then it is editable
    const shouldUseEditableStyle = editable === undefined || editable === true;

    return (
        <>
            <Text style={styles.inputLabel} >{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, shouldUseEditableStyle ? {} : styles.disabled]}
                    {...props}
                    secureTextEntry={hidden}
                />

                {type === "password" &&
                    <Text
                        onPress={toggleSecureText}
                        style={styles.passwordIcon}
                    >
                        <Ionicons name={hidden ? 'eye-off' : "eye"} size={20} color="#00000080" />
                    </Text>
                }

                {error && <Text style={styles.error} >{error}</Text>}
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: normalize(15),
    },
    input: {
        height: normalize(38),
        borderWidth: 1,
        borderRadius: 10,
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
    passwordIcon: {
        position: 'absolute',
        right: '5%',
        top: '33%',
        // transform: [{ translateY: normalize(-5) }],
    },
    error: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    disabled: {
        borderColor: '#fff',
        paddingLeft: 0,
        // borderColor: '#ede4e4',
    },
});