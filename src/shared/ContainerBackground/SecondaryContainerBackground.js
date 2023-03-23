import { View, Text, ImageBackground, Dimensions } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'

const SecondaryContainerBackground = ({children}) => {
  return (
    <ImageBackground source={require('../../../assets/images/trans-image.png')}
    style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
    resizeMethod="resize">
        {children}
    </ImageBackground>
  )
}

export default SecondaryContainerBackground