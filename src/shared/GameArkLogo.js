import { View, Text } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import normalize from '../utils/normalize'
import { Image } from 'react-native'

const GameArkLogo = () => {
    return (
        <View style={styles.logo}>
            <Image  style={styles.image} source={require('./../../assets/images/game-logo.png')} />
        </View>
    )
}

const styles = EStyleSheet.create({
    logo: {
        alignItems: 'center',
        marginTop: normalize(45)
    },
    image:{
        width:240,
        height:152
    }
})
export default GameArkLogo