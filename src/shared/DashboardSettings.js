import { View, Text } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'
import { Dimensions } from 'react-native'
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import Animated, { BounceInRight, BounceOutRight, SlideInRight, SlideOutRight } from 'react-native-reanimated'


{/* <Animated.View style={[styles.card, { backgroundColor: category.bgColor }]} entering={BounceInRight.duration(2000)}> */}
const DashboardSettings = ({ onPress }) => {
  return (
    <Animated.View style={styles.container} entering={SlideInRight.duration(200)}
    exiting={SlideOutRight.duration(100)}>
    <ImageBackground source={require('./../../assets/images/trans-image.png')}
    style={styles.secondBgImg}
    resizeMethod="resize">
                 <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={require('./../../assets/images/Ga-logo.png')} />
                </View>
                <View style={styles.welcome}>
                   <Pressable style={styles.icons}>
                        <Image source={require('./../../assets/images/sound-icon.png')} />   
                   </Pressable>
                   <Pressable style={styles.icons}>
                        <Image source={require('./../../assets/images/leaderboard-icon.png')} />   
                   </Pressable>
                   <Pressable style={styles.icons}>
                        <Image source={require('./../../assets/images/profile-icon.png')} />   
                   </Pressable>
                   <Pressable style={styles.icons}>
                        <Image source={require('./../../assets/images/sound-icon.png')} />   
                   </Pressable>
                   <Pressable style={styles.icons}>
                        <Image source={require('./../../assets/images/help-icon.png')} />   
                   </Pressable >
                </View>
                <View style={styles.setting}>
                    <Pressable onPress={onPress}>
                        <Image source={require('./../../assets/images/close-icon.png')} />
                    </Pressable>
                </View>
            </View >
            </ImageBackground>
            </Animated.View>

  )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
    },

    secondBgImg: {
        height: responsiveScreenHeight(100)
    },

    logo: {
        alignItems: 'center',
        marginTop: normalize(110)
    },

    welcome: {
        flexDirection:'row',
        paddingHorizontal: responsiveScreenHeight(3),
        marginTop: responsiveScreenHeight(35),
        flexWrap: 'wrap',
        marginTop:responsiveScreenHeight(25)
    },

    welcomeText: {
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        color: '#fff'
    },

    welcomeBtn: {
        backgroundColor: '#15397D',
        height:normalize(38),
        width:responsiveScreenWidth(50),
        justifyContent:'center',
        borderRadius:20
    },

    welcomeBtnText: {
        color: "#fff",
        // lineHeight: '1.3rem',
        fontSize: '1.4rem',
        textAlign: 'center',
        fontFamily: 'blues-smile'
    },

    setting: {
        paddingHorizontal: responsiveScreenHeight(3),
        marginTop:responsiveScreenHeight(3)
    },

    icons: {
        marginHorizontal: 10,
        marginVertical: 10,
    }
})

export default DashboardSettings