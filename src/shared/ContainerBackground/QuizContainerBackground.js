import { View, Text, ImageBackground, Dimensions } from 'react-native'
import React from 'react'

const QuizContainerBackground = ({children}) => {
  return (
    <ImageBackground source={require('../../../assets/images/quiz-background-large-min.png')}
    style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
    >
        {children}
    </ImageBackground>

  )
}

export default QuizContainerBackground