import * as React from 'react';
import { Text, View, ScrollView, Pressable, Modal, Platform, ActivityIndicator } from 'react-native';
import normalize, { responsiveHeight, responsiveWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import LottieAnimations from '../shared/LottieAnimations';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
// import { dailyRewardPayload } from '../utils/DailyRewardPayload';
import { useEffect } from 'react';
import SingleDailyRewards from './SingleDailyRewards';
import { claimDailyReward } from '../features/CommonSlice';
import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import Constants from 'expo-constants';

const DoubleDailyRewards = ({ myDailyReward, rewardText2, rewardText1, loading, claimReward }) => {
    const [disabled] = React.useState(!myDailyReward[0].can_claim)
    return (
        <ImageBackground style={styles.cardBackground} source={require('./../../assets/images/reward.png')}>
            <View style={styles.cardBody}>
                <Text style={styles.days}>Day {myDailyReward[0].day}</Text>
                <View style={styles.doubleRewardImageCase}>
                    <Image style={styles.rewardIcon} resizeMode='contain'
                        source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${myDailyReward[0].icon}` }} />
                    <Image style={styles.rewardIcon} resizeMode='contain' source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${myDailyReward[1].icon}` }} />
                </View>
                <View style={styles.rewardTextCase}>
                    <Text style={styles.reward}>{rewardText1}</Text>
                    <Text style={styles.reward}>{rewardText2}</Text>
                </View>
                <Pressable disabled={disabled} onPress={() =>claimReward(myDailyReward[0].day)}>
                    {myDailyReward[0].is_claimed ?
                        <Image style={styles.closeIcon} resizeMode='contain' source={require('./../../assets/images/claimed.png')} />
                        :
                        <View>
                            {!disabled ?
                                <ImageBackground style={styles.buttonCase} resizeMode='contain' source={require('./../../assets/images/button-case.png')}>
                                    {loading ? <ActivityIndicator size="small" color="#FFFF" /> : <Text>claim</Text>}
                                </ImageBackground> :
                                <ImageBackground style={styles.buttonCase} resizeMode='contain' source={require('./../../assets/images/disabled_reward.png')}>
                                    <Text>claim</Text>
                                </ImageBackground>
                            }
                        </View>
                    }
                </Pressable>
            </View>
        </ImageBackground>
    )
}
export default DoubleDailyRewards;

const styles = EStyleSheet.create({
    centeredView: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        height: responsiveHeight(100),
        backgroundColor: 'rgba(17, 41, 103, 0.77)'
    },

    container: {
        flex: 1,
    },
    inviteBg: {
        paddingVertical: normalize(15),
        paddingHorizontal: '2rem',
        alignItems: 'center',
        height: responsiveHeight(35),
        width: responsiveWidth(80)
    },
    modalTitle: {
        color: '#fff',
        fontSize: '1.4rem',
        marginTop: responsiveHeight(100) * 0.02,
        fontFamily: 'poppins',
    },
    modalBody: {
        color: '#fff',
        textAlign: 'center',
        fontSize: '0.95rem',
        fontFamily: 'graphik-medium',
        marginVertical: '1rem',
        lineHeight: '1.5rem',
        width: responsiveWidth(50)
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#2D53A0',
        borderColor: '#FFAA00',
        borderBottomWidth: 4,
        justifyContent: 'space-around',
        height: 50,
        alignItems: 'center',
        marginVertical: normalize(20)
    },
    headerText: {
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '2rem'
    },
    closedBtnContainer: {
        alignItems: 'flex-end',
        padding: responsiveWidth(3),
    },
    closeIcon: {
        width: 60,
        height: 60,
    },
    dailyRewards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cardBackground: {
        alignItems: 'center',
        marginBottom: responsiveHeight(5),
        paddingVertical: responsiveHeight(2),
        // paddingHorizontal: responsiveWidth(), 
        justifyContent: 'space-between',
        width: 126,
        height: 151,
        marginHorizontal: '1rem',
    },
    cardBody: {
        alignItems: 'center'
    },
    days: {
        color: '#fff',
        fontSize: '1rem',
        fontFamily: 'poppins'
    },
    doubleRewardImageCase: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    reward: {
        color: '#fff',
        fontSize: '0.65rem',
        fontFamily: 'poppins',
        textAlign: 'center'
    },
    buttonCase: {
        height: responsiveHeight(9),
        width: responsiveWidth(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardIcon: {
        width: 27,
        height: 40,
        margin: 0
    },
    rewardTextCase: {
        marginTop: 5
    }
});
