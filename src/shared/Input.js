import React, { useState } from 'react';
import { TextInput, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../utils/normalize';

import { Ionicons } from '@expo/vector-icons';


export default function (props) {
    const { label, type, error, editable, defaultValue, style, labelStyle } = props;

    const [hidden, setHidden] = useState(type === "password");

    const toggleSecureText = () => {
        setHidden(!hidden);
    }

    //if the param is not passed or it is passed as true, then it is editable
    const shouldUseEditableStyle = editable === undefined || editable === true;

    return (
        <>
            <Text style={[styles.inputLabel, labelStyle]} >{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, shouldUseEditableStyle ? {} : styles.disabled, style]}
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

const styles = EStyleSheet.create({
    inputLabel: {
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize:'1rem',
        marginBottom: normalize(4)
    },
    inputContainer: {
        marginBottom: normalize(15),
    },
    input: {
        height: normalize(38),
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#00000080',
        fontSize: '0.75rem',
        backgroundColor:"#fff",
    },
    passwordIcon: {
        position: 'absolute',
        right: '5%',
        top: '22%',
        // transform: [{ translateY: normalize(-5) }],
    },
    error: {
        color: '#fff',
        fontSize: normalize(10),
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
    },
    disabled: {
        borderColor: '#fff',
        paddingLeft: 5,
        // borderColor: '#ede4e4',
    },
});