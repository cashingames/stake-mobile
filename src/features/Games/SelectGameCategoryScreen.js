import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, View } from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import LottieAnimations from '../../shared/LottieAnimations';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { isTrue } from '../../utils/stringUtl';
import { useSelector } from 'react-redux';
import NoGame from '../../shared/NoGame';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import { Platform } from 'react-native';
import useSound from '../../utils/useSound';
import QuizContainerBackground from '../../shared/ContainerBackground/QuizContainerBackground';
import TopIcons from '../../shared/TopIcons';

const SelectGameCategoryScreen = ({ navigation, initialShowPlayButton = false }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const activeSubcategory = useSelector(state => state.game.gameCategory);
    const gameMode = useSelector(state => state.game.gameMode);
    const refRBSheet = useRef();
    const { playSound } =  useSound(require('../../../assets/sounds/open.wav'))

    console.log(gameMode) 

    // const openBottomSheet = () => {
    //     refRBSheet.current.open()
    // }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }

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
        <TopIcons />
        <View style={styles.logo}>
                    <Pressable style={styles.icons}>
                        <Image style={styles.imageIcons} source={require('../../../assets/images/home.png')} />
                    </Pressable>
                    <Image style={styles.smallLogo} source={require('../../../assets/images/ga-logo-small.png')} />
                </View>
        <View>
            <GamePicker title={"Pick a game"} activeSubcategory={activeSubcategory} />
                </View>
        </View>
        </QuizContainerBackground>
    )
}

export default SelectGameCategoryScreen; 

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
        paddingHorizontal: responsiveScreenWidth(3),
    },
    animation: {
        alignItems: 'center',
        // marginBottom: normalize(10)
    },
    selectButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        width: 70,
        height: 70,
        elevation: 5,
        backgroundColor: '#EF2F55',
        position: 'absolute',
        right: 0,
        bottom: 0,
        margin: normalize(18)
    },
    disabled: {
        backgroundColor: '#DFCBCF'
    },

})