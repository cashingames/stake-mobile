
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function ({ backgroundColor, spinnerColor, barStyle, statusBackground }) {
    return (
     
            <View style={[styles.loadingContainer,
            backgroundColor ? { backgroundColor: backgroundColor } : { backgroundColor: '#F9FBFF' }
            ]}>
                <ActivityIndicator size="large" color={spinnerColor} />
            </View>
  
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        padding: 10
    },
})