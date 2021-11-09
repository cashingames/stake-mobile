import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '../constants/NormalizeFont';

const slides = [
  {
    key: 's1',
    text: 'Play exiciting quizzes and games with family and friends',
    image: require('../../assets/images/slide2.png'),
    backgroundColor: 'linear-gradient(360deg, rgba(255, 224, 196, 0.4) 37.56%, rgba(255, 224, 196, 0) 74%)',
  },
  {
    key: 's2',
    text: 'Your journey to being the ultimate quiz master starts here!',
    image: require('../../assets/images/slide1.png'),
    backgroundColor: 'linear-gradient(360deg, rgba(255, 224, 196, 0.4) 37.56%, rgba(255, 224, 196, 0) 74%)',
  },
  {
    key: 's3',
    text: 'Multiplayer Level Games',
    image: require('../../assets/images/slide3.png'),
    backgroundColor: 'linear-gradient(360deg, rgba(255, 224, 196, 0.4) 37.56%, rgba(255, 224, 196, 0) 74%)',
  }]

const IntroSlide = ({ navigation }) => {

  const onDone = () => {
    AsyncStorage.setItem('isFirst', JSON.stringify(false));
    navigation.navigate('DashboardScreen');
  };
  const _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons name="md-arrow-forward-sharp" size={24} color="rgba(255, 255, 255, .9)" />
      </View>
    );
  };
  const _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons name="md-checkmark" size={24} color="rgba(255, 255, 255, .9)" />
      </View>
    );
  };
  const _renderSkipButton = () => {
    return (

      <View style={styles.skipButton}>
        <Text style={styles.skip}>Skip</Text>
      </View>
    );
  };
  const _renderItem = ({ item }) => {
    return (
      <View
        style={[styles.item, { backgroundColor: item.backgroundColor }]}>
        {/* style={styles.item}> */}
        <Text style={styles.introTextStyle}>
          {item.text}
        </Text>
        <View style={styles.contentStyle}>
          <Image source={item.image} style={styles.image} />
        </View>

      </View>
    );
  };
  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      renderNextButton={_renderNextButton}
      renderDoneButton={_renderDoneButton}
      renderSkipButton={_renderSkipButton}
      showSkipButton={true}
      onSkip={onDone}
      onDone={onDone}
    />
  );
};

export default IntroSlide;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    paddingTop: normalize(40),
  },
  contentStyle: {
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  introTextStyle: {
    fontFamily: 'graphik-bold',
    fontSize: normalize(22),
    color: 'black',
    paddingHorizontal: normalize(18),
    lineHeight: 35,
  },
  buttonCircle: {
    width: normalize(30),
    height: normalize(30),
    backgroundColor: '#EF2F55',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    width: normalize(30),
    height: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  skip: {
    fontFamily: 'graphik-medium',
    fontSize: normalize(12),
    color: 'black',
  }
});
