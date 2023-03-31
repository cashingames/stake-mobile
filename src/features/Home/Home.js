import { View, Text } from 'react-native'
import React from 'react'
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import { useState } from 'react'
import DashboardSettings from '../../shared/DashboardSettings'
import { set } from 'lodash'
import MainContainerBackground from '../../shared/ContainerBackground/MainContainerBackground'
import GameArkLogo from '../../shared/GameArkLogo'
import TopIcons from '../../shared/TopIcons'

const Home = ({ navigation }) => {
    const [showSettings, setShowSettings] = useState(false);

    const goToGame = () => {
        navigation.navigate('Games')
    }
    return (
        <MainContainerBackground>
            <View style={styles.container}>
                <TopIcons />
                <View style={styles.logo}>
                    <GameArkLogo />
                </View>
                <View style={styles.welcome}>
                    <Pressable style={styles.playBtn} onPress={goToGame}>
                        <Text style={styles.welcomeBtnText}>Single Player</Text>
                    </Pressable>
                    <Pressable style={styles.playBtn} onPress={goToGame}>
                        <Text style={styles.welcomeBtnText}>Multi-Player</Text>
                    </Pressable>
                </View>
                <View style={styles.setting}>
                    <DashboardSettings showSettings={showSettings} setShowSettings={setShowSettings} />
                </View>
            </View >
        </MainContainerBackground>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
    },

    logo: {
        alignItems: 'center',
    },

    welcome: {
        alignItems: 'center',
        marginTop: responsiveScreenHeight(35)
    },

    welcomeText: {
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        color: '#fff'
    },

    playBtn: {
        backgroundColor: '#15397D',
        height: normalize(38),
        width: responsiveScreenWidth(50),
        justifyContent: 'center',
        borderRadius: 20,
        marginTop:10,
        borderBottomColor: '#0D2859',
        borderBottomWidth: 4,
    },
    welcomeBtnText: {
        color: "#fff",
        fontSize: '1.2rem',
        textAlign: 'center',
        fontFamily: 'blues-smile'
    },
    setting: {
        marginTop: responsiveScreenHeight(5.3),
    },

})

export default Home