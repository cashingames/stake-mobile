import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import normalize from '../utils/normalize'
import { Image } from 'react-native'
import { Animated } from 'react-native'
import { useEffect } from 'react'

const GameArkLogo = () => {
    const shakeValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      shake();
    }, []);
  
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeValue, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          shake();
        }
      });
    };
  
    const shakeAnimation = shakeValue.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-1deg', '1deg'],
    });
  
    return (
        <Animated.View style={[styles.logo, { transform: [{ rotate: shakeAnimation }] }]}>
            <Image  style={styles.image} source={require('./../../assets/images/gameark-logo.png')} />
        </Animated.View>
    )
}

const styles = EStyleSheet.create({
    logo: {
        alignItems: 'center',
        marginTop: normalize(45)
    },
    image:{
        width:240,
        height:152
    }
})
export default GameArkLogo