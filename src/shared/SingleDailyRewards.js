import * as React from 'react';
import { Text, View, ScrollView, Pressable, Modal, Platform, ActivityIndicator } from 'react-native';
import normalize, { responsiveHeight, responsiveWidth } from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import LottieAnimations from '../shared/LottieAnimations';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
const SingleDailyRewards = ({ myDailyReward, claimReward, loading }) => {
    const [disabled] = React.useState(!myDailyReward.can_claim)
    return (
        <ImageBackground style={styles.cardBackground} source={require('./../../assets/images/reward.png')}>
            <View style={styles.cardBody}>
                <Text style={styles.days}>Day {myDailyReward.day}</Text>
                <Image style={styles.closeIcon} resizeMode='contain' source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${myDailyReward.icon}` }} />
                {myDailyReward.type == 'boost' ?
                    <Text style={styles.reward}>{myDailyReward.name} x{myDailyReward.count}</Text>
                    :
                    <Text style={styles.reward}>{myDailyReward.count} {myDailyReward.name}</Text>
                }
                <Pressable onPress={() =>claimReward(myDailyReward.day)} disabled={disabled}>
                    {myDailyReward.is_claimed ?
                        <Image style={styles.closeIcon} resizeMode='contain' source={require('./../../assets/images/claimed.png')} />
                        :
                        <View>
                            {!disabled ?
                                <ImageBackground style={styles.buttonCase} resizeMode='contain' source={require('./../../assets/images/button-case.png')}>
                                    {loading ? <ActivityIndicator size="small" color="rgba(17, 41, 103, 0.77)" /> : <Text>claim</Text>}
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
