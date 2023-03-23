import { View, Text } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'
import { Dimensions } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

const MixedContainerBackground = ({ children }) => {
    return (
        <ImageBackground source={require('../../../assets/images/login-image.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <ImageBackground source={require('../../../assets/images/trans-image.png')}
                resizeMethod="resize"
                style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}>                
                {children}
            </ImageBackground>
        </ImageBackground>
    )
}


export default MixedContainerBackground