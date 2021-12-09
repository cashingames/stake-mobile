import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import normalize from '../utils/normalize';
import { useNavigation } from '@react-navigation/native';


const AppNextButton = ({ text,onPress }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.buttonContainer}>
            <Pressable onPress={onPress}
                style={() => [
                    {
                        backgroundColor:
                            '#EF2F55'
                    },
                    styles.button
                ]}
            >
                <Text style={styles.playButton}>{text}</Text>
            </Pressable>
        </View>
    )
};
export default AppNextButton;

const styles = StyleSheet.create({
    buttonContainer: {
        paddingBottom: normalize(20),
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: normalize(12),
        // paddingHorizontal: normalize(32),
        borderRadius: 12,
    },
    playButton: {
        fontFamily: 'graphik-medium',
        // sze: normalize(12),
        color: '#FFFF'
    },
});