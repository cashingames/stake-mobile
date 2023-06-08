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
const SingleDailyRewards = ({ x }) => {
    const [disabled] = React.useState(!x.can_claim)
    return (
        // <View style=>
        <ImageBackground style={styles.cardBackground} source={require('./../../assets/images/reward.png')}>
            <View style={styles.cardBody}>
                <Text style={styles.days}>Day {x.day}</Text>
                <Image style={styles.closeIcon} resizeMode='contain' source={require('./../../assets/images/store-icon.png')} />
                {x.type == 'boost' ?
                    <Text style={styles.reward}>{x.name} x{x.count}</Text>
                    :
                    <Text style={styles.reward}>{x.count} {x.name}</Text>
                }
                <Pressable disabled={disabled}>
                    {x.is_claimed ?
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
        // </View>
    )
}


export default SingleDailyRewards;

const styles = EStyleSheet.create({
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
