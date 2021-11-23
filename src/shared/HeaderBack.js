import React from "react";
import { StyleSheet, Image, Pressable, View } from 'react-native';


export default function HeaderBack({ onPress }) {

    return (
        <View >
            <Pressable
                onPress={onPress}
                style={styles.button}>
                <Image
                    source={require('../../assets/images/arrow_back.png')}
                />
            </Pressable>
        </View>

    );

}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        marginVertical: 20,
        // backgroundColor: '#FFFF',
    },
});

