import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function MiniHead({title}) {
    return (
        <View style={styles.container}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        paddingTop: 60,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: 'rgba(250, 197, 2, 1)',
        white: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontWeight: '500',
        fontSize: 14,
        marginLeft: 12
    }
})