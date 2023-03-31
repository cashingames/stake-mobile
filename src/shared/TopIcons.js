import { View, Text, Image, ImageBackground } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import { responsiveScreenWidth } from '../utils/normalize'

const TopIcons = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
            <ImageBackground style={{zIndex:11}} source={require('./../../assets/images/heart-icon.png')}>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: 50, width: 65}}>
                    <View>
                        <Text style={styles.gameLives}>16</Text>
                    </View>
                </View>
            </ImageBackground>
            <View style={styles.liveText}>
                <Text style={styles.text}>Lives</Text>
            </View>
            </View>
            <View style={styles.iconContainer}>
            <View style={styles.bombText}>
                <Text style={styles.text}>x55</Text>
            </View>
                <Image  style={styles.bombIcon} source={require('./../../assets/images/boost-icon.png')} />
            </View>
            <View style={styles.iconContainer}>
            <View style={styles.coinText}>
                <Text style={styles.text}>200</Text>
            </View>
                <Image style={styles.coinIcon} source={require('./../../assets/images/coin-icon.png')} />
            </View>
        </View>
    )
}


const styles = EStyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
          paddingHorizontal: responsiveScreenWidth(3),
    },
    iconContainer:{
        flexDirection:'row',
        alignItems:'flex-end',
    },
    liveText: {
        width:83,
        height:21,
        borderRadius:7,
        paddingLeft:'2rem',
        backgroundColor: '#102058',
        marginLeft:-30,
        marginBottom:'0.3rem',
        justifyContent:'center'
    },
    gameLives: {
        color:'#fff',
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        marginTop: '.6rem',
        marginLeft:'0.2rem'
    },
    bombText: {
        width:55,
        height:21,
        borderRadius:7,
        paddingHorizontal:'0.6rem',
        backgroundColor: '#102058',
        marginRight:-20,
        marginBottom:'0.3rem',
        justifyContent:'center'
    },
    coinText:{
        width: 60,
        height:21,
        borderRadius:7,
        paddingHorizontal:'0.6rem',
        backgroundColor: '#102058',
        marginRight:-15,
        marginBottom:'0.3rem',
        alignItems:'center',
        justifyContent:'center'
    },
    text: {
        color:'#FFD600',
        fontSize: '.9rem',
        fontFamily:'blues-smile'
    },
    bombIcon:{
        height:53,
        width:41
    },
    coinIcon: {
        height:41,
        width:47
    }
})
export default TopIcons