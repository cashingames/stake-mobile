import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import { useState } from 'react'
import DashboardSettings from '../../shared/DashboardSettings'
import TopIcons from '../../shared/TopIcons'
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground'
import { ScrollView } from 'react-native-gesture-handler'
import { setGameMode } from './GameSlice'
import { useDispatch, useSelector } from 'react-redux'

const GameScreen = ({ navigation }) => {
    const [showSettings, setShowSettings] = useState(false);
    const dispatch = useDispatch()
    const gameModes = useSelector(state => state.common.gameModes);
    const gameModeSelected = gameModes.find(mode => mode.name === 'EXHIBITION')

    const goToGameInstruction = () => {
        navigation.navigate('AppRouter')
    }

    const goToGameCategory = () => {
        dispatch(setGameMode(gameModeSelected));
    //     await analytics().logEvent("game_mode_selected", {
    //         'id': user.username,
    //         'phone_number': user.phoneNumber,
    //         'email': user.email,
    //         'gamemode': mode.displayName,
    //     })
    // playSound()
        navigation.navigate('SelectGameCategory')
    }
    return (
        <MixedContainerBackground>
            <View style={styles.container}>
                <TopIcons />
                <View style={styles.logo}>
                    <Pressable style={styles.icons}>
                        <Image style={styles.imageIcons} source={require('../../../assets/images/home.png')} />
                    </Pressable>
                    <Image style={styles.smallLogo} source={require('../../../assets/images/ga-logo-small.png')} />
                </View>
                <ScrollView horizontal={true} style={styles.gameContainer}>
                    <ImageBackground style={styles.gameCard} source={require('../../../assets/images/quiz-background.png')}>
                        <View>
                            <Text style={styles.gameText}>Quiz Game</Text>
                        </View>
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                        <Image style={styles.cardImage} source={require('../../../assets/images/quiz-image.png')} />
                        </View>
                        <View style={styles.cardBtnContainer}>
                            <Pressable style={styles.playBtn} onPress={goToGameCategory}>
                                <Text style={styles.playText}>Play</Text>
                            </Pressable>
                            <Pressable style={styles.instructionBtn}>
                                <Text style={styles.instructionText}>How to play</Text>
                            </Pressable>
                        </View>
                    </ImageBackground>
                    <ImageBackground style={styles.gameCard} source={require('../../../assets/images/quiz-background.png')}>

                    </ImageBackground>
                    <ImageBackground style={styles.gameCard} source={require('../../../assets/images/quiz-background.png')}>

                    </ImageBackground>
                    <ImageBackground style={styles.gameCard} source={require('../../../assets/images/quiz-background.png')}>

                    </ImageBackground>
                </ScrollView>
                <View style={styles.setting}>
                    <DashboardSettings showSettings={showSettings} setShowSettings={setShowSettings} />
                </View>
            </View >
        </MixedContainerBackground>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
        // paddingHorizontal: responsiveScreenWidth(3),
    },

    logo: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: normalize(40),
        paddingHorizontal: responsiveScreenWidth(3),
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
    setting: {
        marginTop: responsiveScreenHeight(2.3),
    },
    imageIcons: {
        width: 50,
        height: 50,
        marginRight: normalize(60)

    },
    smallLogo: {
        width: 150,
        height: 95
    },

    gameContainer: {
        marginTop: 30
    },
    //game card section to be removed
    gameCard: {
        height: normalize(399),
        width: normalize(192),
        marginVertical:responsiveScreenHeight(2),
        marginHorizontal: responsiveScreenWidth(3),
        paddingVertical: responsiveScreenHeight(2),
        paddingHorizontal:responsiveScreenWidth(5),
    },
    gameText: {
        fontSize:'2.5rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        textAlign:'center'
    },
    cardImage:{
        height:191,
        width:144,
        marginTop:10
    },
    cardBtnContainer: {
        marginTop: -12
    },
    playBtn: {
        backgroundColor: '#15397D',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderBottomColor: '#0D2859',
        borderBottomWidth: 4,
        paddingVertical:'0.4rem',
        marginBottom:5
    },
    playText: {
        color: '#fff',
        fontFamily:'blues-smile',
        fontSize: '0.9rem'
    },
    instructionBtn: {
        backgroundColor: '#fff',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderBottomColor: '#C5C2C2',
        borderBottomWidth: 4,
        paddingVertical:'0.4rem'
    },
    instructionText: {
        color: '#15397D',
        fontFamily:'blues-smile',
        fontSize: '0.9rem'
    }

})

export default GameScreen