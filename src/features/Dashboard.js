import { View, Text, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import Constants from 'expo-constants';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Pressable } from 'react-native'
import DashboardSettings from '../shared/DashboardSettings'
import GameArkLogo from '../shared/GameArkLogo'
import { useEffect } from 'react'
import { fetchFeatureFlags, getCommonData, initialLoadingComplete, loadSoundPrefernce, setSound } from './CommonSlice'
import { getUser, userUpdateReferralCode } from './Auth/AuthSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import Loader from '../shared/Loader'
import useSound from '../utils/useSound'
import { setGameMode } from './Games/GameSlice';
import { getAchievements } from './Profile/AchievementSlice';
import { Image } from 'react-native';
import { notifyOfStoreUpdates } from '../utils/utils';
import { setItems } from '../features/InAppPurchaseSlice';
import * as InAppPurchases from 'expo-in-app-purchases';
import MixedContainerBackground from '../shared/ContainerBackground/MixedContainerBackground';
import { PRODUCTS, items } from '../utils/StoreProductsArray';
import NetworkModal from '../shared/NetworkModal';
import * as Updates from 'expo-updates';
import crashlytics from '@react-native-firebase/crashlytics';
import GameModal from '../shared/GameModal';
import { unwrapResult } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ navigation, route }) => {
    // const loading = useSelector(state => state.common.initialLoading);
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [achievementPopup, setAchievementPopup] = useState(false);
    const [updateModal, setUpdateModal] = useState(false)
    const gameModes = useSelector(state => state.common.gameModes);
    const [showModal, setShowModal] = useState(false)
    const [showReferralModal, setShowReferralModal] = useState(true)
    const [referralUpdate, setReferralUpdate] = useState(false)
    const [updateSuccessful, setUpdateSuccessful] = useState(false)
    const isSoundLoaded = useSelector(state => state.common.isSoundLoaded);
    const exhibitionSelected = gameModes.find(item => item.name === 'EXHIBITION')
    const params = route.params;
    const socialSignUp = params?.socialSignUp ?? null
    const [referrer, setReferrer] = useState('');
    const onChangeReferral = (text) => {
        setReferrer(text)
    }

    console.log(socialSignUp)
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
            dispatch(setItems(results.length !== 0 ? results : PRODUCTS))
        } else {

        }
    }

    const reloadNetworkConnection = () => {
        setLoading(true)
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())
        const _4 = dispatch(getUser())
        Promise.all([_2.unwrap(), _3.unwrap(), _4.unwrap()]).then(() => {
            setLoading(false)
            setShowModal(false)
        })
            .catch(error => {
                setLoading(true)
                setTimeout(() => {
                    setShowModal(true)
                    setLoading(false)
                }, 3000)
            });
        loadSoundPrefernce(dispatch, setSound)
        getStoreItems();
        // get achievements badges
        dispatch(getAchievements());
    }

    useEffect(() => {
        const checkReferralCodeUpdated = async () => {
          const referralCode = await AsyncStorage.getItem('referralCodeUpdated');
          if (referralCode !== 'true') {
            setShowReferralModal(true)
          }else{
            setShowReferralModal(false)
          }
        }
        checkReferralCodeUpdated();
      }, []);

    useEffect(() => {
        if (socialSignUp && showReferralModal) {
            setShowReferralModal(true)
        }
    }, [showReferralModal])

    useFocusEffect(
        React.useCallback(() => {
            reloadNetworkConnection();
        }, [])
    );

    const gameModeSelected = () => {
        dispatch(setGameMode(exhibitionSelected));
        navigation.navigate('Games')
        playSound()
    }

    const updateApp = async () => {
        await Updates.reloadAsync();
        setUpdateModal(false)
        navigation.navigate('Dashboard')
    }
    const notifyOfPublishedUpdates = async () => {
        const navigation = useNavigation()
        try {
            const update = await Updates.checkForUpdateAsync();
            if (!update.isAvailable) {
                return;
            }
            await Updates.fetchUpdateAsync();
            setUpdateModal(true)
        } catch (error) {
            crashlytics().recordError(error);
        }
    }

    if (loading) {
        return <Loader />
    }

    const handleToggleSwitch = () => {
        handleToggle();
        stopSound()
    };

    const updateReferralCode = () => {
        setShowReferralModal(false)
        try{
        dispatch(userUpdateReferralCode({
           referrer
        }))
            .then(unwrapResult)
            .then( async result => {
                setReferralUpdate(true)
                await AsyncStorage.setItem('referralCodeUpdated', 'true');                
                setUpdateSuccessful(true)
            })
            .catch((error) => {
                 setReferralUpdate(true)
            })
        }catch(error){
            console.log(error)
        }
    }

    return (
        <>
            <RenderUpdateChecker notifyOfPublishedUpdates={notifyOfPublishedUpdates} />
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
                <NetworkModal showModal={showModal} setShowModal={setShowModal} onPress={reloadNetworkConnection} />
                <GameModal
                    setShowModal={setUpdateModal}
                    showModal={updateModal}
                    title='Updates Available'
                    modalBody='Please reload the app to enjoy the new experience we just added to Gameark!'
                    btnText='Restart'
                    inputBox={true}
                    btnHandler={updateApp}
                />
                <GameModal
                    setShowModal={setShowReferralModal}
                    showModal={showReferralModal}
                    modalBody='Please input referral code (if referred)'
                    multipleBtn={true}
                    btnText='Submit'
                    btnText_2='Close'
                    inputBox={true}
                    btnHandler={updateReferralCode}
                    btnHandler_2={() => setShowReferralModal(false)}
                    onChange={onChangeReferral}
                    value={referrer}
                />
                <GameModal
                    setShowModal={setReferralUpdate}
                    showModal={referralUpdate}
                    title={updateSuccessful ? 'Update Successful!' : 'Update Failed😥'}
                    modalBody={updateSuccessful ? 'Received. Thank You' : 'Username does not exist'}
                    btnText='Ok'
                    btnHandler={() => setReferralUpdate(false)}
                />
            </MixedContainerBackground>
        </>
    )
}


function RenderUpdateChecker({ notifyOfPublishedUpdates }) {
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
        borderRadius: 19,
        borderBottomColor: '#0D2859',
        borderBottomWidth: 4,
    },
    welcomeBtnText: {
        color: "#fff",
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
    },
    imageIcons: {
        width: 50,
        height: 50,
    },

})

export default Dashboard