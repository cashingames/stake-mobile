import React, { useState, useEffect } from "react";
import { ActivityIndicator, Image, Text, View, Pressable } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useDispatch } from 'react-redux';

import normalize from '../utils/normalize';
import { loginWithGoogle, setToken } from "../features/Auth/AuthSlice";
import { saveToken } from "../utils/ApiHelper";
import { androidClientId } from "../utils/BaseUrl";

WebBrowser.maybeCompleteAuthSession();

export default function SocialSignUp() {
    const dispatch = useDispatch();
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: androidClientId,
    });
    const loginSocial = () => {
        console.log("here");
        if (response?.type === 'success') {
            console.log("2");
            const { authentication } = response;
            loginViaGoogle(authentication.accessToken)
        }
        console.log("3");
        promptAsync();
    }

    const loginViaGoogle = (googleToken) => {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${googleToken}`,
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then(user => {
            loginWithGoogle({
                email: user.email,
                first_name: user.given_name,
                last_name: user.family_name,
            }).then(res => {
                saveToken(res.data.data)
                dispatch(setToken(res.data.data))
            });
        });
    }


    return (
        <View style={styles.socialIcons}>
            <Pressable onPress={() => loginSocial()} style={styles.socialContainer} >
                <Image
                    style={{ ...styles.icon, width: 20, height: 20 }}
                    source={require('../../assets/images/google_icon.png')}
                />
                <Text style={styles.socialText}>Google</Text>

            </Pressable>
        </View>
    );
}

const styles = EStyleSheet.create({
    socialIcons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    socialContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: '1rem',
        paddingVertical: '0.6rem',
        borderWidth: '0.1rem',
        borderColor: '#CDD4DF',
        borderRadius: normalize(10),
    },
    icon: {
        marginRight: '1rem',
    },
    socialText: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
});
