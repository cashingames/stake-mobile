import React, { useEffect, useState, useRef } from 'react';
import { Image, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';
import LottieAnimations from '../../shared/LottieAnimations';

const SelectGameCategoryScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    useEffect(() => {
        StatusBar.setTranslucent(true)
        StatusBar.setBackgroundColor("transparent")
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.animation}>
                <LottieAnimations
                    animationView={require('../../../assets/select-game.json')}
                    width={normalize(100)}
                    height={normalize(100)}
                />
            </View>
            <View>
                <GamePicker initialShowPlayButton={false} title={"Pick a game"} />
            </View>
        </ScrollView>
    )
}

export default SelectGameCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5d5fef',
        paddingHorizontal: normalize(18),
        justifyContent: 'center'
    },
    animation: {
        alignItems: 'center',
        // marginBottom: normalize(10)
    }
})