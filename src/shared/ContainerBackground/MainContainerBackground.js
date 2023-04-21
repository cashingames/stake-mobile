import { View, Text, ImageBackground, Dimensions } from 'react-native'
import React from 'react'

const MainContainerBackground = ({children}) => {
  return (
    <ImageBackground source={require('../../../assets/images/login-image.png')}
    style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
    resizeMode="stretch"
    >
        {children}
    </ImageBackground>

  )
}

export default MainContainerBackground