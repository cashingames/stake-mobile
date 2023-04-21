import React, { useState } from 'react';
import { Image, Pressable, StatusBar, Text, View } from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import useSound from '../../utils/useSound';
import QuizContainerBackground from '../../shared/ContainerBackground/QuizContainerBackground';
import TopIcons from '../../shared/TopIcons';
import GameSettings from '../../shared/GameSettings';

const SelectGameCategoryScreen = ({ navigation, initialShowPlayButton = false }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const gameMode = useSelector(state => state.game.gameMode);
    const { playSound } = useSound(require('../../../assets/sounds/open.wav'))
    const user = useSelector(state => state.auth.user);

    const onPlayButtonClick = () => {
        onSelectGameMode();
        playSound()
    }

    const onSelectGameMode = () => {
        if (gameMode.name === "CHALLENGE")
            navigation.navigate('ChallengeSelectPlayer');
        else
            navigation.navigate('GameInstructions');
    };

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    return (
        <QuizContainerBackground>
            <View style={styles.container}>
                <View style={{height:responsiveHeight(20)}}>
                <TopIcons />
                    <View style={styles.logo}>
                        <Pressable style={styles.icons} onPress={() => navigation.navigate('Dashboard')}>
                            <Image style={styles.imageIcons} source={require('../../../assets/images/home.png')} />
                        </Pressable>
                        <Text style={styles.title}>Trivia Hub</Text>
                    </View>
                    </View>
                    <View style={{height:responsiveHeight(40)}}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.quizImage} source={require('../../../assets/images/word-trivia.png')} />
                    </View>
                    <View>
                        <GamePicker navigation={navigation} />
                    </View>
                </View>

                <View style={styles.setting}>
                    <GameSettings onPress={() => navigation.goBack(null)} />
                </View>
            </View>
        </QuizContainerBackground>
    )
}

export default SelectGameCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        height: responsiveHeight(100),
        paddingVertical: responsiveHeight(2),
    },
    logo: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: normalize(20),
        marginBottom: responsiveHeight(5),
        paddingHorizontal: responsiveScreenWidth(3),
    },
    imageIcons: {
        width: 50,
        height: 50,
        marginTop: -10,
    },
    title: {
        color: '#fff',
        fontFamily: 'blues-smile',
        fontSize: '2.5rem',
        textAlign: 'center',
        flex: 1,
        marginRight: 30,
        // marginBottom: 40
    },
    imgContainer: {
        alignItems: 'center'
    },
    quizImage: {
        width: normalize(300),
        height: normalize(184)
    },
    setting: {
        position: 'absolute',
        left:0,
        right:0,
        top:responsiveHeight(88),
    },
})