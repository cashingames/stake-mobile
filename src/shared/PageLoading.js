
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function () {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: '#fff',
        padding: 10
    },
})