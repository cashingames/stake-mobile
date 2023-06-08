import * as React from 'react';
import { Text, View, ScrollView, Pressable, Modal, Platform } from 'react-native';
import normalize, { responsiveHeight, responsiveWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import LottieAnimations from '../shared/LottieAnimations';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
import { dailyRewardPayload } from '../utils/DailyRewardPayload';
import { useEffect } from 'react';
import SingleDailyRewards from './SingleDailyRewards';

const DailyReward = ({ showDailyRewardModal, setShowDailyRewardModal }) => {
    const { shouldShowPopup, rewards } = dailyRewardPayload

    const singleDailyRewards = rewards.slice(0, 4);
    const fifthDay = rewards.filter((item) => item.day == 5)
    const sixthDailyReward = rewards.filter((item) => item.day == 6)
    const seventhDailyReward = rewards.filter((item) => item.day == 7)

    // console.log(fifthDay[0])

    useEffect(() => {
        if (shouldShowPopup) {
            setShowDailyRewardModal(true)
        } else {
            setShowDailyRewardModal(false)
        }
    }, [rewards])
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
                                    onPress={() => setShowDailyRewardModal(false)}
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
                                    {singleDailyRewards.map((x, i) => <SingleDailyRewards x={x} key={i} />)}
                                    <DoubleDailyRewards x={fifthDay} />
                                    <DoubleDailyRewards x={sixthDailyReward} />
                                    <DoubleDailyRewards x={seventhDailyReward} />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
}

const DoubleDailyRewards = ({x}) => {
    const [disabled] = React.useState(!x[0].can_claim)
    console.log(disabled)

    return (
        <ImageBackground style={styles.cardBackground} source={require('./../../assets/images/reward.png')}>
        <View style={styles.cardBody}>
            <Text style={styles.days}>Day {x[0].day}</Text>
            <Image style={styles.closeIcon} resizeMode='contain' source={require('./../../assets/images/store-icon.png')} />
                <Text style={styles.reward}>hello</Text>           
                <Pressable disabled={disabled}>
                {x[0].is_claimed ?
                    <Image style={styles.closeIcon} resizeMode='contain' source={require('./../../assets/images/claimed.png')} />
                    :
                    <View>
                        {!disabled ?
                            <ImageBackground style={styles.buttonCase} resizeMode='contain' source={require('./../../assets/images/button-case.png')}>
                                <Text>claim</Text>
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
        height: Platform.OS === "ios" ? responsiveHeight(22.5) : 151,
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
    reward: {
        color: '#fff',
        fontSize: '0.75rem',
        fontFamily: 'poppins'
    },
    buttonCase: {
        height: responsiveHeight(9),
        width: responsiveWidth(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
});
