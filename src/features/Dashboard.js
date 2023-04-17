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
import { notifyOfPublishedUpdates, notifyOfStoreUpdates } from '../utils/utils'
import { ScrollView } from 'react-native-gesture-handler';
import { setGameMode } from './Games/GameSlice';
import { getAchievements } from './Profile/AchievementSlice';

const Dashboard = ({ navigation }) => {
    const loading = useSelector(state => state.common.initialLoading);
    const dispatch = useDispatch()
    const minVersionCode = useSelector(state => state.common.minVersionCode);
    const minVersionForce = useSelector(state => state.common.minVersionForce);
    const [modalVisible, setModalVisible] = useState(false);
    const [achievementPopup, setAchievementPopup] = useState(false)
    const gameModes = useSelector(state => state.common.gameModes);
    const items = useSelector(state => state.inAppPurchase.items);
    const [refreshing, setRefreshing] = useState(false);
    // const isTourActive = useSelector(state => state.tourSlice.isTourActive);
    const [forceRender, setForceRender] = useState(true)
    const isSoundLoaded = useSelector(state => state.common.isSoundLoaded);
    const exhibitionSelected = gameModes.find(item => item.name === 'EXHIBITION')

    const isFocused = useIsFocused();
    const { playSound } = useSound(require('./../../assets/sounds/dashboard.mp3'));
    
    useEffect(() => {
        if (isFocused && isSoundLoaded) {
            playSound()
        }
    }, [isFocused, isSoundLoaded]);
    useEffect(() => {
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())
        // const _4 = dispatch(getUser())

        Promise.all([_2, _3]).then(() => {
            dispatch(initialLoadingComplete());
        });
        loadSoundPrefernce(dispatch, setSound)
        // getStoreItems()
    }, []);

    useEffect(() => {
        if (Constants.manifest.extra.isDevelopment) {
            return;
        }
        //whether we are forcing or not, show the first time
        notifyOfStoreUpdates(minVersionCode, minVersionForce);
    }, [minVersionCode]);


    useFocusEffect(
        React.useCallback(() => {

            if (loading) {
                return;
            }

            // console.info('home screen focus effect')

            if (Constants.manifest.extra.isDevelopment) {
                return;
            }

            notifyOfPublishedUpdates();

            if (minVersionForce) {
                notifyOfStoreUpdates(minVersionCode, minVersionForce);
            }

        }, [loading])
    );
    useFocusEffect(
        React.useCallback(() => {
            // console.info('UserDetails focus effect')
            dispatch(getUser());

            // get achievements badges
            dispatch(getAchievements());

        }, [])
    );
    useFocusEffect(
        React.useCallback(() => {
            if (loading) {
                return;
            }
        }, [loading])
        );

        const gameModeSelected = () => {
            dispatch(setGameMode(exhibitionSelected));
            navigation.navigate('Games')
            playSound()
        }

        
    if (loading) {
        return <Loader />
    }

    return (
        <ScrollView>
        <MainContainerBackground>
            <View style={styles.container}>
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
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
    },

    logo: {
        alignItems: 'center',
        marginTop: normalize(80)
    },

    welcome: {
        alignItems: 'center',
        marginTop: responsiveScreenHeight(35)
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

})

export default Dashboard