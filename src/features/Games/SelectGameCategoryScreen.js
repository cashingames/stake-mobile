import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StatusBar, View } from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';
import LottieAnimations from '../../shared/LottieAnimations';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { isTrue } from '../../utils/stringUtl';
import { useSelector } from 'react-redux';
import NoGame from '../../shared/NoGame';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import { Platform } from 'react-native';
import useSound from '../../utils/useSound';

const SelectGameCategoryScreen = ({ navigation, initialShowPlayButton = false }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const activeSubcategory = useSelector(state => state.game.gameCategory);
    const gameMode = useSelector(state => state.game.gameMode);
    const refRBSheet = useRef();
    const { playSound } =  useSound(require('../../../assets/sounds/open.wav'))

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
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.animation}>
                    <LottieAnimations
                        animationView={require('../../../assets/select-game.json')}
                        width={normalize(100)}
                        height={normalize(100)}
                    />
                </View>
                <View>
                    <GamePicker title={"Pick a game"} activeSubcategory={activeSubcategory} />
                </View>
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={Platform.OS === 'ios' ? 400 : 350}
                    subComponent={<NoGame
                        onClose={closeBottomSheet}
                    />}
                />
            </ScrollView>
            <ProceedButton disabled={!isTrue(activeSubcategory)} onPress={onPlayButtonClick} />
        </View>
    )
}

const ProceedButton = ({ onPress, disabled }) => {
    return (
        <Pressable onPress={onPress} style={[styles.selectButton, disabled ? styles.disabled : {}]} disabled={disabled} >
            <Ionicons name='arrow-forward-sharp' size={35} color='#FFFF' />
        </Pressable>
    )
}

export default SelectGameCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5d5fef',
        paddingHorizontal: normalize(18),
        // justifyContent: 'center'
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