import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";


const UserName = ({ userName }) => {
    return (
        <View style={styles.nameContainer}>
            <Text style={styles.name}>{userName}</Text>
        </View>
    )
}
export default UserName;

const styles = EStyleSheet.create({
    nameContainer: {
        alignItems: 'center',
        marginBottom: normalize(10)
    },
    name: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '2.3rem',
    },
})