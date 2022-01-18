import React, {useState } from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View, Pressable } from 'react-native';
import normalize from '../utils/normalize';
import * as Google from 'expo-google-app-auth';
import { loginWithGoogle, setToken } from "../features/Auth/AuthSlice";
import { useDispatch } from 'react-redux';
import { saveToken } from "../utils/ApiHelper";
import { iosClientId, androidClientId } from "../utils/BaseUrl";
import { ActivityIndicator } from "react-native";


export default function SocialSignUp() {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoogleSignIn = () => {
        setIsSubmitting(true);
        const config = {
            iosClientId: iosClientId,
            androidClientId: androidClientId,
            scopes: ["profile", "email"]
        };
        Google.logInAsync(config).then((result) => {
            setIsSubmitting(true);
            const { type, user } = result;
            if (type == 'success') {
                loginWithGoogle({
                    email: user.email,
                    first_name: user.givenName,
                    last_name: user.familyName,
                }).then(response => {
                    saveToken(response.data.data)
                    dispatch(setToken(response.data.data))
                });
            } else {
                console.log('cancelled')
            }
            setIsSubmitting(false);
        }).catch(error => {
            setIsSubmitting(false);
            console.log(error)

        })
    }

    return (
        <View style={styles.socialIcons}>
            {isSubmitting ? <ActivityIndicator size="large" color="#0000ff" /> :
                <Pressable onPress={handleGoogleSignIn} >
                    <Image
                        style={{ ...styles.icon, width: 20, height: 20 }}
                        source={require('../../assets/images/google_icon.png')}
                    />
                    <Text style={styles.social}>Google</Text>

                </Pressable>
            }
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
