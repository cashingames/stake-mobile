import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";


const UserName = ({ userName }) => {
    return (
        <View style={styles.nameContainer}>
            <Text style={styles.name}>Hello {userName}</Text>
        </View>
    )
}
export default UserName;

const styles = EStyleSheet.create({
    nameContainer: {
        alignItems: 'center',
        marginVertical: '1.3rem'
    },
    name: {
        textAlign: 'center',
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '1.5rem',
    },
})