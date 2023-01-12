import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setGameMode } from './GameSlice';
import Animated, { BounceInRight } from "react-native-reanimated";
import Constants from 'expo-constants';
import normalize from '../../utils/normalize';
import { useNavigation } from '@react-navigation/core';



const SelectGameMode = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const gameModes = useSelector(state => state.common.gameModes);

    const games = [...gameModes].sort((a, b) => a.id - b.id);


    const onSelectGameMode = (mode) => {
        dispatch(setGameMode(mode));
        navigation.navigate('SelectGameCategory')
    };

    return (
        <View>
            <Text style={styles.title}>Select game mode</Text>
            <View style={styles.subcategories}>
                <SwiperFlatList>
                    {games.map((gameMode, i) =>
                        <AvailableMode
                            key={i}
                            gameMode={gameMode}
                            onPress={() => onSelectGameMode(gameMode)}
                        />
                    )}
                </SwiperFlatList>
            </View>
        </View>
    )
}

const AvailableMode = ({ gameMode, onPress, isSelected }) => {
    return (
        <Animated.View style={[styles.card, { backgroundColor: gameMode.bgColor }]} entering={BounceInRight.duration(2000)}>
            <Pressable
                onPress={onPress}
            >
                <View style={styles.cardTopRow}>
                    <View style={styles.categoryCardTopRow}>
                        <Image
                            source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${gameMode.icon}` }}
                            style={styles.cardIcon}
                        />
                        {/* <Ionicons name={isSelected ? "md-ellipse-sharp" : "md-ellipse"} size={24} color={isSelected ? "#EF2F55" : "#FFFF"} /> */}
                    </View>
                    <Text style={styles.cardTitle}>{gameMode.name}</Text>
                    <Text style={styles.cardInstruction}>{gameMode.description}</Text>
                </View>
                <View style={gameMode.name === 'EXHIBITION' ? styles.cardActionContainer1 : styles.cardActionContainer}>
                    <Text style={styles.cardAction}>Play Now</Text>
                </View>
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
        // padding: normalize(15),
        // paddingBottom: 0,
        borderRadius: normalize(7),
        marginBottom: normalize(15),
        marginRight: normalize(10)
    },
    cardIcon: {
        width: 55,
        height: 55,
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
    cardActionContainer1: {
        borderTopWidth: 1,
        borderColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:'.5rem'
,        marginTop:'.75rem'
    },
    cardActionContainer: {
        borderTopWidth: 1,
        borderColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:'.5rem'
    },
    cardAction: {
        fontSize: '0.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        // marginLeft: 'auto'
        // marginTop: '.6rem',
        // textAlign: 'center',
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    cardTopRow: {
        padding: normalize(15),
        // paddingBottom: 0,
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