import { View, Text } from 'react-native'
import React from 'react'
import { ImageBackground } from 'react-native'
import { Dimensions } from 'react-native'
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import { useState } from 'react'
import DashboardSettings from '../shared/DashboardSettings'
import { set } from 'lodash'

const Dashboard = ({ navigation }) => {
    const [showSettings, setShowSettings] = useState(false);

    const hideSettingsMenu = () => {
        setShowSettings(false)
    }
    return (
        <ImageBackground source={require('./../../assets/images/login-image.png')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize"
        >
            {showSettings ?
                <DashboardSettings onPress={hideSettingsMenu} />
                :
                <View style={styles.container}>
                    <View style={styles.logo}>
                        <Image source={require('./../../assets/images/Ga-logo.png')} />
                    </View>
                    <View style={styles.welcome}>
                        <Text style={styles.welcomeText}>Welcome to the ark</Text>
                        <Pressable onPress={() => navigation.navigate('Terms')} style={styles.welcomeBtn}>
                            <Text style={styles.welcomeBtnText}>Play</Text>
                        </Pressable>
                    </View>
                    <View style={styles.setting}>
                        <Pressable onPress={() => setShowSettings(true)}>
                            <Image source={require('./../../assets/images/settings-icon.png')} />
                        </Pressable>
                    </View>
                </View >
            }
        </ImageBackground>
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
        alignItems: 'center',
        marginTop: responsiveScreenHeight(35)
    },

    welcomeText: {
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        color: '#fff'
    },

    welcomeBtn: {
        backgroundColor: '#15397D',
        height: normalize(38),
        width: responsiveScreenWidth(50),
        justifyContent: 'center',
        borderRadius: 20
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
        marginTop: responsiveScreenHeight(3)
    }
})

export default Dashboard