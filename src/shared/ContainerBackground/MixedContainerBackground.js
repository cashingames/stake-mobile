import { View, Text } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'
import { Dimensions } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { ScrollView } from 'react-native-gesture-handler'

const MixedContainerBackground = ({ children }) => {
    return (
        <ImageBackground source={require('../../../assets/images/login-image.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <ImageBackground source={require('../../../assets/images/transparent2.png')}
                resizeMethod="resize"
                style={{ 
                    // width: Dimensions.get("screen").width, height: Dimensions.get("screen").height 
                    flex:1
                    }}> 
                <ScrollView>               
                {children}
                </ScrollView>
            </ImageBackground>
        </ImageBackground>
    )
}


export default MixedContainerBackground