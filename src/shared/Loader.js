import { View, Text } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'
import { Dimensions } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { ScrollView } from 'react-native-gesture-handler'
import LottieAnimations from './LottieAnimations'
import normalize from '../utils/normalize'

const Loader = () => {
    return (
        <ImageBackground source={require('../../assets/images/login-image.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <ImageBackground source={require('../../assets/images/transparent2.png')}
                resizeMethod="resize"
                style={{
                    flex: 1,
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <LottieAnimations
                        animationView={require('../../assets/loader.json')}
                        width={normalize(170)}
                        height={normalize(170)}
                    />         
            </ImageBackground>
        </ImageBackground>
    )
}


export default Loader