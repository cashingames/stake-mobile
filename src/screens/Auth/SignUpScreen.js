import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Image, Text, TouchableOpacity, View, Platform, Pressable } from 'react-native';
import AuthTitle from '../../shared/AuthTitle';
//import CheckBox from '@react-native-community/checkbox';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import SocialSignUp from '../../shared/SocialSignUp';
import { useNavigation } from '@react-navigation/native';
import AuthBanner from '../../shared/AuthBanner';
import SignInInput from '../../shared/SignInInput';
import AuthInput from '../../shared/SignInInput';
import InputError from '../../shared/InputError';
import UserPassword from '../../shared/UserPassword';
import SocialSigninDivider from '../../shared/SocialSigninDivider';
import { CheckBox } from 'react-native-elements'

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [inActive, setInActive] = useState(true);
  const [passErr, setPassError] = useState(false);
  const [emailErr, setEmailError] = useState(false);
  const [phoneErr, setPhoneError] = useState(false);
  const [checked, setChecked] = useState(false);



  const onChangeEmail = (email) => {
    emailErr && setEmailError(false);
    setEmail(email)
  }
  const onChangePassword = (password) => {
    password.length > 0 && password.length < 8 ? setPassError(true) : setPassError(false);
    setPassword(password)
  }
  const onChangePhone = (phone) => {
    phone.length > 0 && phone.length < 11 ? setPhoneError(true) : setPhoneError(false);
    setPhone(phone)
  }
  const onChangeConfirmPassword = (password) => {
    if (password !== password_confirmation) {setPasswordConfirmation(password)}
  }

  const checkBoxToggle = () => {
    if (!checked){
      setChecked(true)
      setInActive(false);
    }else{
      setChecked(false);
      setInActive(true);
    }

  }

  const onNext = (email, password, password_confirmation, phone) => {
    if (password !== password_confirmation) {
      setPassError(true);
      navigation.navigate("SignupScreen")
      return;
    }
    const re = /^\S+@\S+\.\S+$/;
    if (!(re.test(email))) {
      setInActive(true);
      setEmailError(true);
      console.log('checked')
      return;
    }
    if (password.length < 8) {
      setPassError(true);
      return;
    }
    if (phone.length < 11) {
      setPhoneError(true);
      return;
    }
    navigation.navigate("SignupDetails", { email, password, password_confirmation, phone })
  }



  useEffect(() => {
    if (email.length == 0 || phone.length == 0 ||
      password.length == 0 || password_confirmation.length == 0 ||
      phoneErr || passErr || emailErr) {
      setInActive(true);
    }
    console.log(password_confirmation, password)
  })
  return (
    <ScrollView style={styles.container}>
      <AuthBanner />
      <View style={styles.headerBox}>
        <AuthTitle text='Create an account' />
      </View>
      <View style={styles.inputContainer}>
        {emailErr && <InputError text='*email is not valid' textStyle={styles.err} />}
        <AuthInput
          label='Email'
          placeholder="johndoe@example.com"
          value={email}
          onChangeText={text => onChangeEmail(text)}
        />
        {phoneErr && <InputError text='Phone number cannot be less than 11 digits' textStyle={styles.err} />}
        <AuthInput
          label='Phone Number'
          placeholder="080xxxxxxxx"
          value={phone}
          onChangeText={text => onChangePhone(text)}
          keyboardType="numeric"
        />
        {
          passErr && <InputError text='*password must not be less than 8 digits' textStyle={styles.err} />
        }
        <AuthInput
          type="password"
          label='Password'
          value={password}
          placeholder="Enter password"
          onChangeText={text => { onChangePassword(text) }}
        />
        {
          passErr && <InputError text='*password confirmation must match password' textStyle={styles.err} />
        }
        <AuthInput
          type="password"
          label='Password'
          value={password_confirmation}
          placeholder="Confirm password"
          onChangeText={text => { onChangeConfirmPassword(text) }}
        />
      </View>
      <View style={styles.termsAndConditions}>
        {(Platform.OS === 'web') ? <input type="checkbox" onChange={checkBoxToggle} />
          :
          <CheckBox
            checked={checked}
            onIconPress = {checkBoxToggle}

          />
        }
        <Agreement />
      </View>
      {
        inActive && <Text style={styles.errorMsg}>*Please fill details and accept our terms and conditions to proceed</Text>
      }
      <View>
        <AppButton text='continue' onPress={() => onNext(email, password, password_confirmation, phone)} disabled={inActive} />
      </View>
      <SocialSigninDivider signInText='sign up' />
      <SocialSignUp action={() => navigation.navigate('SignIn')} />
      <SignIn />
    </ScrollView >
  );
}

const Agreement = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.agreement}>I agree to
        <Text style={styles.touchable} onPress={() => navigation.navigate('TermsAndConditions')} >
          <Text style={styles.linkText}>Terms & conditions</Text>
        </Text>
      </Text>
      <View>
        <Text style={styles.agreement}>and
          <Text style={styles.touchable} onPress={() => navigation.navigate('PrivacyPolicy')} >
            <Text style={styles.linkText}> Privacy Policy</Text>
          </Text>
        </Text>
      </View>
    </View>
  )
}

const SignIn = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.signIn}><Text style={styles.signInText}>Have an account already ? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} >
        <Text style={{ ...styles.linkText, fontFamily: 'graphik-medium', marginLeft: normalize(15) }}>Sign in</Text>
      </TouchableOpacity>
    </View>
  )
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: normalize(15),
    paddingHorizontal: normalize(15),

  },
  headerBox: {
    marginTop: normalize(50),
    paddingTop: normalize(40)
  },
  image: {
    flex: 1,
    justifyContent: "center",
    position: 'absolute',
    left: normalize(10),
    top: normalize(10)
  },

  err: {
    fontFamily: 'graphik-regular',
    color: '#EF2F55',
    fontSize: normalize(10)
  },
  inputContainer: {
    marginTop: normalize(60),
  },

  input: {
    height: normalize(38),
    marginBottom: normalize(15),
    borderWidth: normalize(1),
    borderRadius: normalize(10),
    paddingLeft: normalize(10),
    paddingRight: normalize(20),
    borderColor: '#CDD4DF',
    fontFamily: 'graphik-regular',
    color: '#00000080'

  },
  inputLabel: {
    fontFamily: 'graphik-medium',
    color: '#000000B2',
    marginBottom: normalize(8)
  },
  passwordIcon: {
    left: '90%',
    top: '64%',
    transform: [{ translateY: normalize(-8) }],
    position: 'absolute',
    zIndex: 2,

  },
  confirmPassIcon: {
    left: '90%',
    top: '89%',
    transform: [{ translateY: normalize(-8) }],
    position: 'absolute',
    zIndex: 2,
  },
  linkText: {
    color: '#EF2F55',
    fontFamily: 'graphik-regular'
  },

  termsAndConditions: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'graphik-regular'
  },
  agreement: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'graphik-regular',
    color: 'rgba(0, 0, 0, 0.5)',
    marginLeft: normalize(10)

  },
  errorMsg: {
    fontFamily: 'graphik-regular',
    color: '#EF2F55',
    textAlign: 'center',
    marginTop: normalize(15),
    fontSize: normalize(10)
  },
  touchable: {
    // marginLeft: normalize(8),
    marginTop: normalize(8)

  },
  divider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  hr: {
    borderBottomColor: '#CDD4DF',
    borderBottomWidth: normalize(1),
    paddingHorizontal: normalize(41),
    marginBottom: normalize(5)
  },
  signUpOption: {
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: normalize(15),
    marginHorizontal: normalize(25),
    fontFamily: 'graphik-medium'
  },
  signIn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(25)
  },
  signInText: {
    color: '#00000080',
    fontFamily: 'graphik-medium',
    marginBottom: normalize(40)
  },
  errorBox: {
    marginVertical: normalize(20),
    backgroundColor: '#F442741A',
    paddingVertical: normalize(6),
    borderRadius: normalize(8),
    textAlign: 'center',
    fontFamily: 'graphik-regular',
    color: '#EF2F55',
    fontSize: normalize(10)
  },
});
