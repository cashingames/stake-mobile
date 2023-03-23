import { View, Text, ImageBackground, Dimensions } from 'react-native'
import React from 'react'

const MainContainerBackground = ({children}) => {
  return (
    <ImageBackground source={require('../../../assets/images/login-image.png')}
    style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
    resizeMethod="resize">
        {children}
    </ImageBackground>
  )
}

export default MainContainerBackground