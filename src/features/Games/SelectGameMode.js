import React from 'react';
import { Image, Pressable, Text, View, Linking } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setGameMode } from './GameSlice';
import Animated, { BounceInRight } from "react-native-reanimated";
import Constants from 'expo-constants';
import normalize from '../../utils/normalize';
import { useNavigation } from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';
import useSound from "../../utils/useSound";




// const SelectGameMode = ({ Walkthroughable, CopilotStep }) => {
const SelectGameMode = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const gameModes = useSelector(state => state.common.gameModes);
    const user = useSelector(state => state.auth.user)
    const token = useSelector(state => state.auth.token)
    const games = [...gameModes].sort((a, b) => a.id - b.id);

    const { playSound } =  useSound(require('../../../assets/sounds/open.wav'))

    const onSelectGameMode = async (mode) => {
        dispatch(setGameMode(mode));
        await analytics().logEvent("game_mode_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'gamemode': mode.displayName,
        })
    playSound()
        navigation.navigate('SelectGameCategory')
    };


    const goToStakingApp = async (mode) => {
        dispatch(setGameMode(mode));
        await analytics().logEvent("navigating_to_staking_platform", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'gamemode': mode.displayName,
        })
        handleStakingNavigation(`${Constants.manifest.extra.stakingAppUrl}/${token}`);
    };

    const handleStakingNavigation = async (url) => {
        const isValidUrl = await Linking.canOpenURL(url);
        if (isValidUrl) {
            await Linking.openURL(url);
        } else {
            console.log(`This url is not valid: ${url}`);
        }
    }


    return (
        <View>
            <Text style={styles.title}>Select game mode</Text>
            <View style={styles.subcategories}>
                <SwiperFlatList>
                    {games.map((gameMode, i) =>
                        {
                            if(gameMode.name === "STAKING"){
                                return null;
                            }

                            return (
                                <AvailableMode
                                    key={i}
                                    gameMode={gameMode}
                                    onPress={() => { gameMode.name === "STAKING" ? goToStakingApp(gameMode) : onSelectGameMode(gameMode) }}
                                />
                            )
                        }
                    )}
                </SwiperFlatList>
            </View>
        </View>
    )
}

export const AvailableMode = ({ gameMode, onPress, isSelected }) => {
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
        width: normalize(163.5),
        // width: normalize(130),
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
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '.5rem',
    },
    cardActionContainer: {
        borderTopWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '.5rem'
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
    tourTitle: {
        color: '#EF2F55',
        fontWeight: '600',
        fontSize: 22,
        marginBottom: 10
    }
})