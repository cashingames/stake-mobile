import { View, Text, ImageBackground, Platform } from 'react-native'
import React from 'react'
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize'
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
import { responsiveFontSize } from '../../utils/normalize'


const gamesType = [
    {
        id: 1,
        gameName: 'Trivia Hub',
        backgroundImage: require('../../../assets/images/quiz-background.png'),
        gameImage: require('../../../assets/images/word-trivia2.png'),
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
        <MixedContainerBackground>
            <View style={styles.container}>
                <View style={styles.top}>
                <TopIcons />
                <GameScreenHeader />
                </View>
                <ScrollView horizontal={true} style={styles.gameContainer}>
                    {gamesType.map((game) => {
                        const { id, gameName, backgroundImage, gameImage, unlocked } = game;
                        return (
                            <Animated.View entering={randomEnteringAnimation().duration(1000)} key={id}>                                 
                            <ImageBackground resizeMode="contain" style={styles.gameCard} source={backgroundImage}>
                                {!unlocked && 
                                     <View style={styles.gameCover}>
                                        <Image style={styles.lockImage} source={require('../../../assets/images/game-lock.png')} />
                                     </View>
                                }
                                <View>
                                    <Text style={styles.gameText}>{gameName}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Image resizeMode='contain' style={ styles.cardImage} source={gameImage} />
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
    )
}

const styles = EStyleSheet.create({
    container: {
        height: responsiveHeight(100),
        paddingVertical: responsiveHeight(2),
    },
    games: {
        flexDirection: 'row'
    },
    top:{
        height:responsiveHeight(20)
    },
    gameContainer:{
        height: responsiveHeight(70),
        width: responsiveWidth(100),
        marginTop:responsiveHeight(8),
        paddingHorizontal: responsiveHeight(2),
    },
    //game card section to be removed
    gameCard: {
        height: responsiveHeight(50),
        width: responsiveWidth(50),
        marginHorizontal: 10,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(1),
        alignItems:'center',
    },
    gameText: {
        fontSize: '1.7rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        textAlign: 'center',
        width:'8rem',
        textAlign: 'center',
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
        zIndex: 10
    },
    cardImage: {
        height:Platform.OS === "ios" ? responsiveHeight(27) : responsiveHeight(29),
        width: responsiveWidth(30),
        marginTop: 10
    },

    cardBtnContainer: {
        marginTop: responsiveHeight(-4),
        paddingHorizontal: responsiveScreenWidth(2),
    },
    
    playBtn: {
        backgroundColor: '#15397D',
        width: responsiveWidth(45),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderBottomColor: '#0D2859',
        borderBottomWidth: 4,
        paddingVertical: '0.4rem',
        marginBottom: 5,
        paddingHorizontal: '2rem',

    },
    playText: {
        color: '#fff',
        fontFamily: 'blues-smile',
        fontSize: '0.9rem'
    },
    instructionBtn: {
        backgroundColor: '#fff',
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
    },
    setting: {
        position: 'absolute',
        left:0,
        right:0,
        top:responsiveHeight(90),
    },

})

export default GameScreen