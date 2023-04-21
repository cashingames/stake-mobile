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
        style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
        // resizeMethod=''
        resizeMode="stretch">
            <ImageBackground source={require('../../assets/images/transparent2.png')}
                resizeMethod="resize"
                style={{
                    flex: 1,
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <LottieAnimations
                        animationView={require('../../assets/white-loader.json')}
                        width={normalize(170)}
                        height={normalize(170)}
                    />         
            </ImageBackground>
        </ImageBackground>
    )
}


export default Loader