import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, View, Platform, Image, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { LoginManager } from "react-native-fbsdk-next";
import { useDispatch } from 'react-redux';
import { loginWithSocialLink } from '../features/Auth/AuthSlice';
import normalize from '../utils/normalize';


const Login = ({ text }) => {

  const dispatch = useDispatch()
  const handleLogin = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw new Error('Login cancelled');
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Something went wrong obtaining the users access token');
    }
    const userInfo = await getUserInfo(data.accessToken);
    console.log(userInfo)
    dispatch(loginWithSocialLink(
      {
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        email: userInfo.email
      }))
  };

  const getUserInfo = async (accessToken) => {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me?fields=first_name,last_name',
        {
          accessToken,
          parameters: {
            fields: {
              string: 'first_name,last_name',
            },
          },
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      new GraphRequestManager().addRequest(request).start();
    });
  };


  const FacebookButton = ({ onPress, text }) => {
    return (
      <Pressable onPress={onPress} style={styles.fbButton}>
        <Text style={styles.fbText}>{text} with Facebook</Text>
        <View style={styles.fbIcon}>
          <FontAwesome5 name="facebook-f" size={13} color='#fff' />
        </View>
        {/* {loading && <ActivityIndicator size="small" color='#ffff' />} */}
      </Pressable>
    )
  }


  return (
    <>
      <FacebookButton onPress={handleLogin} text={text} />
    </>
  );
};


const styles = EStyleSheet.create({
  fbButton: {
    backgroundColor: '#3b5998',
    flexDirection: 'row',
    paddingVertical: Platform.OS === 'ios' ? normalize(9) : normalize(9),
    paddingHorizontal: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: '0.5rem'
  },
  fbIcon: {
    marginLeft: normalize(5)
  },
  fbText: {
    color: '#FFFF',
    fontFamily: 'graphik-medium',
    fontSize: '0.7rem'
  },
  pointsIcon: {
    width: Platform.OS === 'ios' ? '.6rem' : '.65rem',
    height: Platform.OS === 'ios' ? '.6rem' : '.65rem',
  }
})
export default Login;

