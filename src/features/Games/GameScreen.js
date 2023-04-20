import { View, Text, ImageBackground, Platform } from 'react-native'
import React from 'react'
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize'
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
                                    <Image resizeMode='contain' style={[gameName !== 'Word Trivia' ? styles.cardImage : styles.wordTrivia]} source={gameImage} />
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
        // flex: 1,
        height: responsiveHeight(100),
        paddingVertical: responsiveHeight(2),
        // paddingHorizontal: responsiveScreenWidth(3),
    },
    games: {
        flexDirection: 'row'
    },
    top:{
        height:responsiveHeight(20)
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
    gameContainer:{
        height: responsiveHeight(70),
        // marginVertical:
        marginTop:responsiveHeight(8),
        // justifyContent:'center'
    },
    //game card section to be removed
    gameCard: {
        height: normalize(399),
        width: normalize(192),
        marginVertical: Platform.OS === 'ios' ? responsiveScreenHeight(5) : responsiveScreenHeight(2),
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
    wordTrivia:{
        height: 200,
        width: 105,
        marginTop: 10
    },
    cardBtnContainer: {
        marginTop: -12
    },
    wordTriviaBtnContainer:{
        position:'absolute',
        bottom: responsiveScreenHeight(6),
        right:0,
        left:0,
        alignItems:'center',
        paddingHorizontal: responsiveScreenWidth(5),
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
    },
    setting: {
        position: 'absolute',
        left:0,
        right:0,
        top:responsiveHeight(90),
    },

})

export default GameScreen