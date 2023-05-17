import React, { useState } from 'react';
import { TextInput, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../utils/normalize';

import { Ionicons } from '@expo/vector-icons';


export default function (props) {
    const { label, type, error, editable, defaultValue } = props;

    const [hidden, setHidden] = useState(type === "password");

    const toggleSecureText = () => {
        setHidden(!hidden);
    }

    //if the param is not passed or it is passed as true, then it is editable
    const shouldUseEditableStyle = editable === undefined || editable === true;

    return (
        <View style={styles.inputHeader}>
            <View style={styles.labelContainer}>
                <Text style={styles.inputLabel} >{label}</Text>
                {type === "password" &&
                    <Text
                        onPress={toggleSecureText}
                    // style={styles.passwordIcon}
                    >
                        <Ionicons name={hidden ? 'eye-off' : "eye"} size={20} color="#072169" />
                    </Text>
                }
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, shouldUseEditableStyle ? {} : styles.disabled]}
                    {...props}
                    secureTextEntry={hidden}
                />

                {error && <Text style={styles.error} >{error}</Text>}
            </View>

        </View>
    );
}

const styles = EStyleSheet.create({
    inputHeader: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputLabel: {
        fontFamily: 'gotham-medium',
        color: '#072169',
        fontSize: '0.98rem',
        marginBottom: normalize(10)
    },
    inputContainer: {
        marginBottom: normalize(30),
    },
    labelContainer: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:'.3rem'
    },
    input: {
        height: normalize(52),
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: normalize(18),
        paddingRight: normalize(20),
        borderColor: '#D9D9D9',
        fontFamily: 'sansation-regular',
        color: '#072169',
        fontSize: '0.85rem',
        backgroundColor: '#fff',
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