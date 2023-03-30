import { View, Text } from 'react-native'
import React from 'react'
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Pressable } from 'react-native'
import { useState } from 'react'
import DashboardSettings from '../shared/DashboardSettings'
import { set } from 'lodash'
import MainContainerBackground from '../shared/ContainerBackground/MainContainerBackground'
import GameArkLogo from '../shared/GameArkLogo'
import { useEffect } from 'react'
import { fetchFeatureFlags, getCommonData, initialLoadingComplete } from './CommonSlice'
import { useDispatch } from 'react-redux'

const Dashboard = ({ navigation }) => {
    const [showSettings, setShowSettings] = useState(false);
    const dispatch = useDispatch()
    
    useEffect(() => {
        const _2 = dispatch(getCommonData());
        const _3 = dispatch(fetchFeatureFlags())

        Promise.all([_2, _3]).then(() => {
            dispatch(initialLoadingComplete());
        });
        // loadSoundPrefernce(dispatch, setSound)
        // getStoreItems()
    }, []);
    return (
        <MainContainerBackground>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <GameArkLogo />
                </View>
                <View style={styles.welcome}>
                    <Text style={styles.welcomeText}>Welcome to the ark</Text>
                    <Pressable onPress={() => navigation.navigate('Home')} style={styles.welcomeBtn}>
                        <Text style={styles.welcomeBtnText}>Play</Text>
                    </Pressable>
                </View>
                <View style={styles.setting}>
                    <DashboardSettings showSettings={showSettings} setShowSettings={setShowSettings} />
                </View>
            </View >
        </MainContainerBackground>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
        paddingHorizontal: responsiveScreenWidth(3),
    },

    logo: {
        alignItems: 'center',
        marginTop: normalize(50)
    },

    welcome: {
        alignItems: 'center',
        marginTop: responsiveScreenHeight(35)
    },

    welcomeText: {
        fontSize: '1.4rem',
        fontFamily: 'blues-smile',
        color: '#fff'
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
        marginTop: responsiveScreenHeight(9),
    },

})

export default Dashboard