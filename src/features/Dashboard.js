import { View, Text } from 'react-native'
import React from 'react'
import Constants from 'expo-constants';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Pressable } from 'react-native'
import { useState } from 'react'
import DashboardSettings from '../shared/DashboardSettings'
import { set } from 'lodash'
import MainContainerBackground from '../shared/ContainerBackground/MainContainerBackground'
import GameArkLogo from '../shared/GameArkLogo'
import { useEffect } from 'react'
import { fetchFeatureFlags, getCommonData, initialLoadingComplete, loadSoundPrefernce, setSound } from './CommonSlice'
import { getUser } from './Auth/AuthSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import Loader from '../shared/Loader'
import useSound from '../utils/useSound'
import { ScrollView } from 'react-native-gesture-handler';
import { setGameMode } from './Games/GameSlice';
import { getAchievements } from './Profile/AchievementSlice';
import { Image } from 'react-native';
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../utils/utils';
import { Alert } from 'react-native';

const Dashboard = ({ navigation }) => {
    const loading = useSelector(state => state.common.initialLoading);
    const dispatch = useDispatch()
    const gameModes = useSelector(state => state.common.gameModes);
    const isSoundLoaded = useSelector(state => state.common.isSoundLoaded);
    const token = useSelector(state => state.auth.token);
    const exhibitionSelected = gameModes.find(item => item.name === 'EXHIBITION')

    const isFocused = useIsFocused();
    const { playSound, toogle, handleToggle, stopSound } = useSound(require('./../../assets/sounds/dashboard.mp3'));

    useEffect(() => {
        if (isFocused && isSoundLoaded) {
            playSound()
        }
    }, [isFocused, isSoundLoaded]);

    useEffect(()=>{
        Alert.alert('after publish', token)
    },[])

    useEffect(() => {
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())


        Promise.all([_2, _3]).then(() => {
            dispatch(initialLoadingComplete());
        });
        loadSoundPrefernce(dispatch, setSound)
        // getStoreItems()
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // console.info('UserDetails focus effect')
            dispatch(getUser());

            // get achievements badges
            dispatch(getAchievements());

        }, [])
    );

    const gameModeSelected = () => {
        dispatch(setGameMode(exhibitionSelected));
        navigation.navigate('Games')
        playSound()
    }


    if (loading) {
        return <Loader />
    }

    const handleToggleSwitch = () => {
        handleToggle();
        stopSound()
    };

    return (
        <>
            <RenderUpdateChecker />
            <ScrollView>
                <MainContainerBackground>
                    <View style={styles.container}>
                        <Pressable style={styles.icons} onPress={handleToggleSwitch}>
                            {toogle ? <Image style={styles.imageIcons} source={require('../../assets/images/sound-1.png')} /> :
                                <Image style={styles.imageIcons} source={require('../../assets/images/sound-off.png')} />
                            }
                        </Pressable>
                        <View style={styles.logo}>
                            <GameArkLogo />
                        </View>
                        <View style={styles.welcome}>
                            <Text style={styles.welcomeText}>Welcome to the ark</Text>
                            <Pressable onPress={gameModeSelected} style={styles.welcomeBtn}>
                                <Text style={styles.welcomeBtnText}>Play</Text>
                            </Pressable>
                        </View>
                        <View style={styles.setting}>
                            <DashboardSettings />

                        </View>
                    </View >
                </MainContainerBackground>
            </ScrollView>
        </>
    )
}


function RenderUpdateChecker() {
    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);
    if (minVersionCode && Constants.manifest.extra.isDevelopment !== "true") {
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }
    notifyOfPublishedUpdates();
    return null;
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(20),
    },

    logo: {
        // alignItems: 'center',
        // marginTop: normalize(20),
    },
    icons: {
        alignItems: 'flex-end',
        width: '100%',
        marginBottom: -50,
        paddingHorizontal: responsiveScreenWidth(3),
        zIndex: 10
    },

    welcome: {
        alignItems: 'center',
        marginTop: responsiveScreenHeight(36)
    },

    welcomeText: {
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        marginVertical: normalize(10)
    },

    welcomeBtn: {
        backgroundColor: '#15397D',
        height: normalize(38),
        width: responsiveScreenWidth(50),
        justifyContent: 'center',
        borderRadius: 20
    },
    welcomeBtnText: {
        color: "#fff",
        // lineHeight: '1.3rem',
        fontSize: '1.4rem',
        textAlign: 'center',
        fontFamily: 'blues-smile'
    },
    setting: {
        marginTop: responsiveScreenHeight(10),
    },
    imageIcons: {
        width: 50,
        height: 50,
        // marginBottom: normalize(60)

    },

})

export default Dashboard