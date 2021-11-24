import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { showLogin } from './AuthSlice';

const slides = [
  {
    key: 's1',
    text: 'Play exiciting quizzes and games with family and friends',
    image: require('../../../assets/images/slide2.png'),
  },
  {
    key: 's2',
    text: 'Your journey to being the ultimate quiz master starts here!',
    image: require('../../../assets/images/slide1.png'),
  },
  {
    key: 's3',
    text: 'Multiplayer Level Games',
    image: require('../../../assets/images/slide3.png'),
  }]

const IntroSlide = () => {
  const dispatch = useDispatch();

  const onDone = () => {
    dispatch(showLogin())
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
        style={styles.item}>
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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#fff', '#FFE0C3']}
        style={styles.background}
        end={{ x: 1, y: 1 }}
      />
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
    </SafeAreaView>
  );
};

export default IntroSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE0C3',
    paddingTop: normalize(40),
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: normalize(1000),
  },
  item: {
    flex: 1,
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
