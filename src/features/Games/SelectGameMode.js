import React, { useEffect, useState, useRef } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setGameMode } from './GameSlice';
import Animated, { BounceInRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import normalize from '../../utils/normalize';
import { isTrue } from '../../utils/stringUtl';
import AppButton from '../../shared/AppButton';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';



const SelectGameMode = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [activeMode, setActiveMode] = useState();
    const gameModes = useSelector(state => state.common.gameModes);
    // const selectedGameMode = useSelector(state => state.game.gameMode);
    const currentMode = useSelector(state => state.common.gameModes ? state.common.gameModes[0] : null);
    // console.log(currentMode)


    const onSelectGameMode = (mode) => {
        setActiveMode(mode)
        console.log(mode)
        dispatch(setGameMode(mode));
    };

    const selectCategory = () => {
        navigation.navigate('SelectGameCategory')
    };

    useFocusEffect(
        React.useCallback(() => {
            setActiveMode(undefined);
            dispatch(setGameMode(currentMode));
        }, [])
    );

    };
    return (
        <View>
            <Text style={styles.title}>Select game mode</Text>
            <View style={styles.subcategories}>
                <SwiperFlatList>
                    {gameModes.map((gameMode, i) =>
                        <AvailableMode key={i} gameMode={gameMode}
                            onPress={() => onSelectGameMode(gameMode)}
                            isSelected={gameMode.id === activeMode?.id}
                        />
                    )}
                </SwiperFlatList>
            </View>
            {isTrue(activeMode) && <AppButton text="Proceed" onPress={selectCategory} />}

        </View>
    )
}

const AvailableMode = ({ gameMode, onPress, isSelected }) => {
    return (
        <Animated.View style={[styles.card, { backgroundColor: gameMode.bgColor }]} entering={BounceInRight.duration(2000)}>
            <Pressable
                onPress={onPress}
            >
                <View style={styles.categoryCardTopRow}>
                    <Image
                        source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${gameMode.icon}` }}
                        style={styles.cardIcon}
                    />
                    <Ionicons name={isSelected ? "md-ellipse-sharp" : "md-ellipse"} size={24} color={isSelected ? "#EF2F55" : "#FFFF"} />
                </View>
                <Text style={styles.cardTitle}>{gameMode.name}</Text>
                <Text style={styles.cardInstruction}>{gameMode.description}</Text>

            </Pressable>
        </Animated.View>
    )
}

export default SelectGameMode;

const styles = EStyleSheet.create({
    subcategories: {
        flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    card: {
        width: normalize(130),
        padding: normalize(15),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
        marginRight: normalize(10)
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: normalize(10)
    },
    cardTitle: {
        fontSize: '0.87rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginVertical: normalize(8),
    },
    cardInstruction: {
        fontSize: '0.73rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    categoryCardTopRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },
    title: {
        fontSize: '0.89rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginVertical: normalize(10),
    },
})