import React from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import normalize from '../utils/normalize';

export default function AuthBanner() {

    return (
        <View >
            <Image
                style={styles.image}
                source={require('../../assets/images/confetti.png')}
            />
        </View>
    );



}

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        left: normalize(10),
        top: normalize(15)
    },

});
