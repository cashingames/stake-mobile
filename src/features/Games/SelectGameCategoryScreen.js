import React from 'react';
import { ImageBackground, Platform, ScrollView, StatusBar, View } from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';
import LottieAnimations from '../../shared/LottieAnimations';
import { useFocusEffect } from '@react-navigation/native';

const SelectGameCategoryScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setTranslucent(true)
                StatusBar.setBackgroundColor("transparent")
                return;
            }
            StatusBar.setBarStyle('light-content');
            return () => {
                if (Platform.OS === "android") {
                    StatusBar.setTranslucent(true)
                    return;
                }
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={styles.container}>
                <GamePicker />
            </ScrollView>
        </ImageBackground>
    )
}


export default SelectGameCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(14),
        paddingTop: normalize(22)
    },
    animation: {
        alignItems: 'center',
    },
})