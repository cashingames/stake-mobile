import { View, Text, ImageBackground, Dimensions } from 'react-native'
import React from 'react'

const QuizContainerBackground = ({children}) => {
  return (
    <ImageBackground source={require('../../../assets/images/quiz-background-large-min.png')}
    style={{ width: Dimensions.get("screen").width, height: 900 }}
    resizeMode="cover">
        {children}
    </ImageBackground>

  )
}

export default QuizContainerBackground