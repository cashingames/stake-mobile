import React from 'react';
import { Platform, ScrollView, StatusBar, View } from 'react-native';
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
                    <GamePicker />
                </View>
            </ScrollView>
        </View>
    )
}


export default SelectGameCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5d5fef',
        paddingHorizontal: normalize(18),
    },
    animation: {
        alignItems: 'center',
    },
})