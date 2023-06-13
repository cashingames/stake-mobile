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
import { claimDailyReward, dismissDailyReward } from '../features/CommonSlice';
import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import Constants from 'expo-constants';
import DoubleDailyRewards from './DoubleDailyRewards';
import GameModal from './GameModal';


const DailyReward = ({ showDailyRewardModal, setShowDailyRewardModal, user }) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const rewards = user.dailyReward?.reward ?? [];

    const singleDailyRewards = rewards?.slice(0, 4) ?? [];
    const fifthDailyRewards = rewards?.filter((item) => item.day == 5) ?? []
    const sixthDailyRewards = rewards?.filter((item) => item.day == 6) ?? []
    const seventhDailyRewards = rewards?.filter((item) => item.day == 7) ?? []
    console.log(user.dailyReward)
    const claimReward = (day) => {
        setLoading(true)
        try {
            dispatch(claimDailyReward(day))
                .then(unwrapResult)
                .then((result) => {
                    console.log(result)
                    setShowDailyRewardModal(false)
                    setLoading(false)
                    setShowModal(true)
                })
        } catch (error) {
            setLoading(false)
        }
    }

    const dismissReward = () => {
        try {
            dispatch(dismissDailyReward())
                .then(unwrapResult)
                .then((result) => {
                    setShowDailyRewardModal(false);
                    setLoading(false)
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user.dailyReward.shouldShowPopup) {
            setShowDailyRewardModal(true)
        } else {
            setShowDailyRewardModal(false)
        }
    }, [])

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDailyRewardModal}
                onRequestClose={() => {
                    setShowDailyRewardModal(!showDailyRewardModal);
                }}
            >
                <ScrollView>
                    <View style={styles.centeredView}>
                        <View style={styles.container}>
                            <View style={styles.closedBtnContainer}>
                                <Pressable style={styles.closeBtn}
                                    onPress={dismissReward}
                                >
                                    <Image style={styles.closeIcon} source={require('./../../assets/images/close-icon.png')} />
                                </Pressable>
                            </View>
                            <View style={styles.header}>
                                <View style={styles.headerTextCase}>
                                    <Text style={styles.headerText}>Daily Reward</Text>
                                </View>
                            </View>
                            <ScrollView>
                                <View style={styles.dailyRewards}>
                                    {singleDailyRewards.map((myDailyReward, i) => <SingleDailyRewards
                                        myDailyReward={myDailyReward}
                                        key={i}
                                        claimReward={claimReward} loading={loading} />)}
                                    {fifthDailyRewards.length > 0 ? <DoubleDailyRewards myDailyReward={fifthDailyRewards}
                                        rewardText1='Bomb x3 +' rewardText2='30 coins' loading={loading} claimReward={claimReward} /> : null}
                                    {sixthDailyRewards.length > 0 ? <DoubleDailyRewards myDailyReward={sixthDailyRewards}
                                        rewardText1='60 coins +' rewardText2='x3 skips' loading={loading} claimReward={claimReward} /> : null}
                                    {seventhDailyRewards.length > 0 ? <DoubleDailyRewards myDailyReward={seventhDailyRewards}
                                        rewardText1='80 coins +' rewardText2='x5 Freeze' loading={loading} claimReward={claimReward} /> : null}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
            <GameModal
                showModal={showModal}
                setShowModal={setShowModal}
                title='Reward Claimed🕺'
                modalBody='You have successfully claimed your daily reward'
                btnText='Ok'
                btnHandler={() => setShowModal(false)}
            />
        </View>
    );
}
export default DailyReward;

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
