import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ActivityIndicator, Pressable, View, Platform, Image, Text, Alert } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager, Profile } from 'react-native-fbsdk-next';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithSocialLink, registerWithSocialLink } from '../features/Auth/AuthSlice';
import { triggerTour } from '../features/Tour/Index';
import { saveToken } from '../utils/ApiHelper';
import analytics from '@react-native-firebase/analytics';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import FirstTimeUserDetails from './FirstTimeUserDetails';
import UniversalBottomSheet from './UniversalBottomSheet';
import { triggerNotifierForReferral } from './Notification';
import logToAnalytics from '../utils/analytics';


const Login = ({ text }) => {
  const navigation = useNavigation();
  const refRBSheet = useRef();
  const user = useSelector(state => state.auth.user);
  const [phone_number, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [referrer, setReferrer] = useState('');
  const [phoneNumberErr, setPhoneNumberError] = useState(false);
  const [usernameErr, setUsernameError] = useState(false);
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [saving, setSaving] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState(false)

  const dispatch = useDispatch()

  if (Platform.OS === "android") {
    LoginManager.setLoginBehavior("web_only")
  }

  const openBottomSheet = () => {
    refRBSheet.current.open()
  }

  const closeBottomSheet = () => {
    refRBSheet.current.close()
  }



  const onChangePhoneNumber = (text) => {
    text.length > 0 && text.length < 11 ? setPhoneNumberError(true) : setPhoneNumberError(false);
    setPhoneNumber(text)
  }

  const onChangeUserName = (text) => {
    text.length > 0 && text.length < 5 ? setUsernameError(true) : setUsernameError(false);
    setUsername(text)
  }

  const onChangReferrer = (text) => {
    setReferrer(text)
  }

  const registerUserWithFacebook = () => {
    setSaving(true);
    dispatch(registerWithSocialLink({
      email,
      firstName,
      lastName,
      phone_number,
      username,
      referrer
    })).then(unwrapResult)
      .then((originalPromiseResult) => {
        console.log(originalPromiseResult)
        triggerTour(navigation)
        triggerNotifierForReferral()
        console.log(originalPromiseResult, 'hitting');
        saveToken(originalPromiseResult.data.token)
        closeBottomSheet()
        navigation.navigate('AppRouter')
        setSaving(false)
      })
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw new Error('User cancelled request');
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining the users access token');
      }

      const userProfile = await getUserProfile(data.accessToken);
      if (userProfile.email === null || userProfile.email === undefined || !userProfile.email) {
        setLoading(false)
        setLoginError(true)
        return
      }
      dispatch(loginWithSocialLink(
        {
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          email: userProfile.email
        })).then(unwrapResult)
        .then((originalPromiseResult) => {
          logToAnalytics('signin_with_facebook', {
            'id': userProfile.first_name,
            'email': userProfile.email,
            'username': user.username
          })
          saveToken(originalPromiseResult.data.token)
          setLoading(false)
        })
        .catch((error) => {
          Alert.alert('Network error. Please, try again later.')
          setLoading(false)
        })
    } catch (error) {
      logout()
      setLoginError(true)
      setLoading(false)
    }

  };

  const getUserProfile = async (accessToken) => {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me?fields=first_name,last_name,email',
        {
          accessToken,
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

  const logout = () => {
    LoginManager.logOut();
  };


  useEffect(() => {
    const invalid = usernameErr || username === '' ||
      phone_number === '' || phoneNumberErr;
    setCanSave(!invalid);
  }, [usernameErr, username, phone_number, phoneNumberErr])

  return (
    <>
       {loginError &&
        <>
          <Text style={styles.errorText}>Facebook email not verified.</Text>
          <Text style={styles.errorText}>Please verify and try again or log in with other options</Text>
        </>
       }
      <FacebookButton onPress={handleLogin} text={text} loading={loading} />
      <UniversalBottomSheet
        refBottomSheet={refRBSheet}
        height={560}
        subComponent={<FirstTimeUserDetails
          onPress={registerUserWithFacebook}
          phoneNumber={phone_number}
          username={username}
          referrer={referrer}
          phoneNumberErr={phoneNumberErr}
          onChangePhoneNumber={onChangePhoneNumber}
          onChangeUserName={onChangeUserName}
          usernameErr={usernameErr}
          onChangReferrer={onChangReferrer}
          canSave={canSave}
          saving={saving}
          setUsernameError={setUsernameError}
        />}
      />
    </>
  );
};

const FacebookButton = ({ onPress, text, loading }) => {
  return (
    <Pressable onPress={onPress} style={styles.fbButton}>
      <View style={styles.fbIcon}>
        {loading ? <ActivityIndicator size="small" color='#ffff' />
          :
          <FontAwesome5 name="facebook" size={22} color='#fff' />
        }
      </View>
      <Text style={styles.fbText}>{text} with Facebook</Text>
    </Pressable>
  )
}


const styles = EStyleSheet.create({
  fbButton: {
    backgroundColor: '#3B5AAC',
    flexDirection: 'row',
    paddingVertical: Platform.OS === 'ios' ? normalize(9) : normalize(9),
    paddingHorizontal: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: responsiveScreenWidth(70),
    height: normalize(38),
    marginVertical: '0.5rem'
  },
  fbIcon: {
    marginLeft: normalize(5)
  },
  fbText: {
    color: '#FFFF',
    fontFamily: 'graphik-regular',
    fontSize: '1rem',
    marginLeft: normalize(5)
  },

  errorCase: {
    justifyContent: 'center'
  },

  errorText: {
    textAlign: 'center',
    fontSize: '0.7rem',
    fontFamily: 'graphik-medium',
    lineHeight: '1.4rem',
    color: '#fff',
    // marginVertical: '0.7rem'
  }
})
export default Login;

