import { View, Text, Image } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet';


const LandingBanner = () => {
  return (
    <View style={styles.banner}>
       <Image
          resizeMode='contain'
            source={require('../../../assets/images/carousel-image1.png')}
        style={styles.img}/>
    </View>
  )
}

export default LandingBanner

const styles = EStyleSheet.create({
    banner:{
        height:240,
        width:'100%',
    },

    img:{
        width:'100%',
        height:'100%'
    }
})