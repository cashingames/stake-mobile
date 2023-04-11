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
            <View style={styles.header}>
                <GameArkLogo />
                <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable
            style={styles.closeBtn} 
            onPress={() => navigation.goBack(null)}>
                <Image style={styles.closeIcon} source={require('../../assets/images/close-icon.png')} />
            </Pressable>
        </>
    )
}

const styles = EStyleSheet.create({
    header: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsiveScreenHeight(1)
    },
    closeBtn:{
        position: 'absolute',
        right: responsiveScreenWidth(5),
        top: responsiveScreenHeight(4),
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