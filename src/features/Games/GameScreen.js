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
import { randomEnteringAnimation } from '../../utils/utils'
import useSound from '../../utils/useSound';
import Animated from 'react-native-reanimated'
import GameScreenHeader from '../../shared/GameScreenHeader'


const gamesType = [
    {
        id: 1,
        gameName: 'quiz game',
        backgroundImage: require('../../../assets/images/quiz-background.png'),
        gameImage: require('../../../assets/images/quiz-image.png'),
        unlocked: true
    },
    {
        id: 2,
        gameName: 'picture trivia',
        backgroundImage: require('../../../assets/images/picture-trivia.png'),
        gameImage: require('../../../assets/images/picture-trivia-icon.png'),
        unlocked: false
    },
    {
        id: 3,
        gameName: 'word swap',
        backgroundImage: require('../../../assets/images/word-snap.png'),
        gameImage: require('../../../assets/images/wordswap-icon.png'),
        unlocked: false
    },
    {
        id: 4,
        gameName: 'picture jumbo',
        backgroundImage: require('../../../assets/images/picture-jumbo.png'),
        gameImage: require('../../../assets/images/picturejumbo-icon.png'),
        unlocked: false
    },
]



const GameScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const activePlans = useSelector(state => state.auth.user.hasActivePlan);
    const { playSound } = useSound(require('../../../assets/sounds/open.wav'));
    const user = useSelector(state => state.auth.user)
console.log(user)

    const goToGameInstruction = () => {
        navigation.navigate('GameInstructions')
        playSound()
    }

    const goToGameCategory = () => {
        if(!activePlans){
            navigation.navigate('NoGame')
        }else{
            navigation.navigate('SelectGameCategory')
        }
        playSound()
      
    }
    return (
        <ScrollView>
        <MixedContainerBackground>
            <View style={styles.container}>
                <TopIcons />
                <GameScreenHeader />
                <ScrollView horizontal={true} style={styles.gameContainer}>
                    {gamesType.map((game) => {
                        const { id, gameName, backgroundImage, gameImage, unlocked } = game;
                        console.log(backgroundImage)
                        return (
                            <Animated.View entering={randomEnteringAnimation().duration(1000)} key={id}>                                 
                            <ImageBackground style={styles.gameCard} source={backgroundImage}>
                                {!unlocked && 
                                    //  <ImageBackground source={require('../../../assets/images/game-cover.png')} >
                                     <View style={styles.gameCover}>
                                        <Image style={styles.lockImage} source={require('../../../assets/images/game-lock.png')} />
                                     </View>
                                //  </ImageBackground>
                                }
                                <View>
                                    <Text style={styles.gameText}>{gameName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={styles.cardImage} source={gameImage} />
                                </View>
                                <View style={styles.cardBtnContainer}>
                                    <Pressable style={styles.playBtn} onPress={goToGameCategory}>
                                        <Text style={styles.playText}>Play</Text>
                                    </Pressable>
                                    <Pressable style={styles.instructionBtn} onPress={goToGameInstruction}>
                                        <Text style={styles.instructionText}>How to play</Text>
                                    </Pressable>
                                </View>
                            </ImageBackground>
                            </Animated.View>
                        )
                    })}
                </ScrollView>
                <View style={styles.setting}>
                    <DashboardSettings />
                </View>
            </View >
        </MixedContainerBackground>
        </ScrollView>
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
        marginTop: responsiveScreenHeight(30)
    },
    games: {
        flexDirection: 'row'
    },

    welcomeText: {
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        color: '#fff'
    },
    setting: {
        // marginTop: responsiveScreenHeight(),
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
        marginTop: 20
    },
    //game card section to be removed
    gameCard: {
        height: normalize(399),
        width: normalize(192),
        marginVertical: responsiveScreenHeight(2),
        marginHorizontal: responsiveScreenWidth(3),
        paddingVertical: responsiveScreenHeight(2),
        paddingHorizontal: responsiveScreenWidth(5),
    },
    gameText: {
        fontSize: '2.2rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        textAlign: 'center'
    },
    gameCover: {
        flex:1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        borderRadius:15,
        height: normalize(400),
        width: normalize(195),
        zIndex: 10
    },
    cardImage: {
        height: 191,
        width: 144,
        marginTop: 10
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
        paddingVertical: '0.4rem',
        marginBottom: 5
    },
    playText: {
        color: '#fff',
        fontFamily: 'blues-smile',
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
        paddingVertical: '0.4rem'
    },
    instructionText: {
        color: '#15397D',
        fontFamily: 'blues-smile',
        fontSize: '0.9rem'
    },
    lockImage: {
        height: normalize(92),
        width: normalize(72),
    }

})

export default GameScreen