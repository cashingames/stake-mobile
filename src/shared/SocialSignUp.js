import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, Pressable } from 'react-native';
import normalize from '../utils/normalize';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { loginWithGoogle, setToken } from "../features/Auth/AuthSlice";
import { useDispatch } from 'react-redux';
import { saveToken } from "../utils/ApiHelper";
import { androidClientId } from "../utils/BaseUrl";
import { ActivityIndicator } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SocialSignUp() {
    const dispatch = useDispatch();
    const [googleToken, setGoogleToken] = useState('');

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: androidClientId,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            setGoogleToken(authentication.accessToken)
        }
    }, [response]);


    useEffect(() => {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${googleToken}`,
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(user => {
            loginWithGoogle({
                email: user.email,
                first_name: user.given_name,
                last_name: user.family_name,
            }).then(response => {
                saveToken(response.data.data)
                dispatch(setToken(response.data.data))
            });
        });
    }, [googleToken])

    return (
        <View style={styles.socialIcons}>
            {!request ? <ActivityIndicator size="large" color="#0000ff" /> :
                <Pressable onPress={() => {
                    promptAsync();
                }}>
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
