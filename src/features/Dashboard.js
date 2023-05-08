import { View, Text, Platform } from 'react-native'
import React, { useState } from 'react'
import Constants from 'expo-constants';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Pressable } from 'react-native'
import DashboardSettings from '../shared/DashboardSettings'
import GameArkLogo from '../shared/GameArkLogo'
import { useEffect } from 'react'
import { fetchFeatureFlags, getCommonData, initialLoadingComplete, loadSoundPrefernce, setSound } from './CommonSlice'
import { getUser } from './Auth/AuthSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import Loader from '../shared/Loader'
import useSound from '../utils/useSound'
import { setGameMode } from './Games/GameSlice';
import { getAchievements } from './Profile/AchievementSlice';
import { Image } from 'react-native';
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../utils/utils';
import { setItems } from '../features/InAppPurchaseSlice';
import * as InAppPurchases from 'expo-in-app-purchases';
import MixedContainerBackground from '../shared/ContainerBackground/MixedContainerBackground';
import { PRODUCTS, items } from '../utils/StoreProductsArray';
import AchievementPopup from '../shared/AchievementPopup';

const Dashboard = ({ navigation }) => {
    const loading = useSelector(state => state.common.initialLoading);
    const dispatch = useDispatch()
    const [achievementPopup, setAchievementPopup] = useState(false)
    const gameModes = useSelector(state => state.common.gameModes);
    const isSoundLoaded = useSelector(state => state.common.isSoundLoaded);
    const exhibitionSelected = gameModes.find(item => item.name === 'EXHIBITION')

    const isFocused = useIsFocused();
    const { playSound, toogle, handleToggle, stopSound } = useSound(require('./../../assets/sounds/dashboard.mp3'));

    useEffect(() => {
        if (isFocused && isSoundLoaded) {
            playSound()
        }
    }, [isFocused, isSoundLoaded]);

    const getStoreItems = async () => {

        const { responseCode, results } = await InAppPurchases.getProductsAsync(items);
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            // console.error(results, "results")
            dispatch(setItems(results.length !== 0 ? results : PRODUCTS))
        } else {

        }
    }

    useEffect(() => {
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())


        Promise.all([_2, _3]).then(() => {
            dispatch(initialLoadingComplete());
        });
        loadSoundPrefernce(dispatch, setSound)
        getStoreItems()
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
            <MixedContainerBackground>
                <View style={styles.container}>
                    <View style={{ height: responsiveHeight(25), justifyContent: 'center' }}>
                        <Pressable style={styles.icons} onPress={handleToggleSwitch}>
                            {toogle ? <Image style={styles.imageIcons} source={require('../../assets/images/sound-1.png')} /> :
                                <Image style={styles.imageIcons} source={require('../../assets/images/sound-off.png')} />
                            }
                        </Pressable>
                        <View style={styles.logo}>
                            <GameArkLogo />
                        </View>
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

                <AchievementPopup setAchievementPopup={setAchievementPopup} achievementPopup={achievementPopup} />
            </MixedContainerBackground>
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
console.log(responsiveWidth(100))
const styles = EStyleSheet.create({
    container: {
        height: responsiveHeight(100),
        // backgroundColor:'yellow',
        paddingTop: responsiveHeight(8),
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
        justifyContent: 'flex-end',
        height: responsiveHeight(40),
    },

    welcomeText: {
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        color: '#fff',
    },

    welcomeBtn: {
        marginTop: '.3rem',
        backgroundColor: '#15397D',
        height: normalize(38),
        width: responsiveScreenWidth(50),
        justifyContent: 'center',
        borderRadius: 20,
        borderBottomColor: '#0D2859',
        borderBottomWidth: 4,
    },
    welcomeBtnText: {
        color: "#fff",
        // lineHeight: '1.3rem',
        fontSize: '1.4rem',
        textAlign: 'center',
        fontFamily: 'blues-smile'
    },
    setting: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: responsiveHeight(90),
        justifyContent: 'flex-end',
        // marginTop:Platform.OS === 'ios' ? responsiveScreenHeight(10): responsiveScreenHeight(5),
    },
    imageIcons: {
        width: 50,
        height: 50,
        // marginBottom: normalize(60)

    },

})

export default Dashboard