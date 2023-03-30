import { View, Text, ImageBackground, Dimensions } from 'react-native'
import React from 'react'

const QuizContainerBackground = ({children}) => {
  return (
    <ImageBackground source={require('../../../assets/images/quiz-background-large.png')}
    style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
    resizeMode="cover">
        {children}
    </ImageBackground>

  )
}

export default QuizContainerBackground