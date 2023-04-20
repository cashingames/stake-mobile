import { View, Text } from 'react-native'
import React from 'react'
import GameArkLogo from './GameArkLogo'
import { Image } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const AppHeader = ({ title }) => {
    const navigation = useNavigation()
    return (
        <>
         <Pressable
            style={styles.closeBtn} 
            onPress={() => navigation.goBack(null)}>
                <Image style={styles.closeIcon} source={require('../../assets/images/close-icon.png')} />
            </Pressable>
            <View style={styles.header}>
                <GameArkLogo />
                {title && <Text style={styles.title}>{title}</Text>}
            </View>
        </>
    )
}

const styles = EStyleSheet.create({
    header: {
        alignItems: 'center',
    },
    closeBtn:{
        alignItems: 'flex-end',
        marginBottom: -50,
        padding:responsiveScreenWidth(2),
        zIndex: 10
    },
    closeIcon: {
        width: 50,
        height: 50
    },
    title: {
        textAlign: 'center',
        color: "#fff",
        fontFamily: 'blues-smile',
        fontSize: '2rem',
        marginVertical: '1rem'
    },
})
export default AppHeader