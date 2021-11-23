import React, { useState } from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import normalize from '../utils/normalize';
import { Ionicons } from '@expo/vector-icons';


const AuthInput = (props) => {
    const [hidden, setHidden] = useState(true);
    const { label, type } = props;

    const toggleSecureText = () => {
        setHidden(!hidden);
    }

    return (
        <>
            <Text style={styles.inputLabel} >{label}</Text>
            <View>
                <TextInput
                    style={styles.input}
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
            </View>

        </>
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
    passwordIcon: {
        position: 'absolute',
        right: '5%',
        top: '40%',
        transform: [{ translateY: normalize(-8) }],
        zIndex: 2,

    },
});

export default AuthInput