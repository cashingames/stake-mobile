import React from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from 'react-native';
import normalize from '../utils/normalize';


export default function SocialSignUp({ action }) {

    return (
        <View style={styles.socialIcons}>
            <TouchableOpacity onPress={action} >
                <Image
                    style={{ ...styles.icon, width: 20, height: 20 }}
                    source={require('../../assets/images/google_icon.png')}
                />
                <Text style={styles.social}>Google</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={action} >
                <Image
                    style={{ ...styles.icon, width: 11, height: 23 }}
                    source={require('../../assets/images/facebook_icon.png')}
                />
                <Text style={styles.social}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={action} >
                <Image
                    style={styles.icon}
                    source={require('../../assets/images/apple_icon.png')}
                />
                <Text style={styles.social}>Apple</Text>
            </TouchableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    socialIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    icon: {
        position: 'absolute',
        top: normalize(36),
        left: normalize(10),
    },
    social: {
        color: 'rgba(0, 0, 0, 0.5)',
        borderWidth: normalize(1),
        borderRadius: normalize(10),
        paddingLeft: normalize(32),
        paddingRight: normalize(10),
        paddingVertical: normalize(10),
        borderColor: '#CDD4DF',
        marginTop: normalize(23),
        fontFamily: 'graphik-regular'
    },

});
