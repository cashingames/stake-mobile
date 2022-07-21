import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../shared/Input';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useFocusEffect } from '@react-navigation/native';

const SignupVerifyEmailScreen = ({ navigation }) => {
  useApplyHeaderWorkaround(navigation.setOptions);

 
  useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.excellent}>
          <LottieAnimations
            animationView={require('../../../assets/excellent.json')}
            width={normalize(170)}
            height={normalize(170)}
          />
        </View>
        <VerifyEmailText />
      </ScrollView>
    </View>

  )
}

const VerifyEmailText = () => {
  return (
    <View style={styles.verifyText}>
      <Text style={styles.verifyHeadText}>
        Good job, you are almost there
      </Text>
      <Text style={styles.verifySubText}>
        A link has been sent to your email,click on the link to verify your email, so you
        can play exicting games and stand a chance to win lots of prizes
      </Text>
    </View>
  )
}

export default SignupVerifyEmailScreen;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    paddingVertical: responsiveScreenWidth(15),
    paddingHorizontal: normalize(20)
  },
  excellent: {
    alignItems: 'center'
  },
  verifyText: {
    alignItems: 'center',
    paddingVertical: normalize(15)
  },
  verifyHeadText: {
    fontSize: '1.4rem',
    color: '#151C2F',
    fontFamily: 'graphik-medium',
    textAlign: 'center',
    lineHeight: '2rem'
  },
  verifySubText: {
    fontSize: '.9rem',
    color: '#151C2F',
    fontFamily: 'graphik-medium',
    textAlign: 'center',
    lineHeight: '1.5rem',
    opacity: 0.6,
    marginTop: normalize(30)
  }
});