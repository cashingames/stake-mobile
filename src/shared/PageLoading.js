
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function ({ backgroundColor, spinnerColor, barStyle, statusBackground }) {
    return (
        <>
            {/* <StatusBar style={barStyle} backgroundColor={statusBackground} /> */}
            <View style={[styles.loadingContainer,
            backgroundColor ? { backgroundColor: backgroundColor } : { backgroundColor: '#fff' }
            ]}>
                <ActivityIndicator size="large" color={spinnerColor} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        // backgroundColor: '#fff',
        // "#0000ff"
        padding: 10
    },
})