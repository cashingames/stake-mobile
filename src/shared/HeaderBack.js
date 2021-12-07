import React from "react";
import { StyleSheet, Image, Pressable, View, Text } from 'react-native';
import normalize from "../utils/normalize";


export default function HeaderBack({ onPress, title }) {

    return (
        <View style={styles.backButton} >
            <Pressable
                onPress={onPress}
                style={styles.button}>
                <Image
                    source={require('../../assets/images/arrow_back.png')}
                />
                <Text style={styles.title}>{title}</Text>
            </Pressable>
        </View>

    );

}

const styles = StyleSheet.create({
    backButton: {
        // backgroundColor: '#fff'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor: '#FFFF',
    },
    title: {
        marginLeft: normalize(20),
        fontSize: normalize(12),
        fontFamily:'graphik-medium',
    }
});

