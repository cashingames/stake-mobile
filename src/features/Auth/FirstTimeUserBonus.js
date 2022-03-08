import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground
} from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { ScrollView } from 'react-native-gesture-handler';
import AppButton from '../../shared/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';


const FirstTimeUserBonus = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    return (
        <ImageBackground source={require('../../../assets/images/confetti1.png')} style={styles.image} resizeMode='contain'>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.userDetails}>Congratulations, {user.username}</Text>
                    <Text style={styles.rewardHeaderText}>You have been rewarded with a starter bundle</Text>
                </View>
                <FirstTimeUserRewards />
                <AppButton text={'Proceed to Dashboard'} onPress={() => navigation.navigate('Home')} />
            </ScrollView>
        </ImageBackground>
    )
}


const FirstTimeUserRewards = () => {
    var rewards =
        [
            {
                bonus: 100,
                bonusName: 'Points',
                bonusText: 'Get a boost on the leaderboard with free points'
            },
            {
                bonus: 3,
                bonusName: 'Skips',
                bonusText: 'Get a boost on the leaderboard with free points'
            },
            {
                bonus: 3,
                bonusName: 'Freezes',
                bonusText: 'Get a boost on the leaderboard with free points'
            }
        ]

    return (
        <View style={styles.rewardsContainer}>
            {rewards.map((reward, i) => <FirstTimeUserReward key={i} reward={reward} />)}
        </View>

    )

}

const FirstTimeUserReward = ({ reward }) => {
    return (
        <View style={styles.reward}>
            <Text style={styles.bonusName}>{reward.bonus} {reward.bonusName}</Text>
            <Text style={styles.bonusText}>{reward.bonusText}</Text>
        </View>
    )
}
export default FirstTimeUserBonus;

const styles = EStyleSheet.create({

    image: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingHorizontal: normalize(18),
        paddingTop: responsiveScreenWidth(8),
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: responsiveScreenWidth(10)
    },
    userDetails: {
        fontFamily: 'graphik-bold',
        fontSize: '1.2rem',
        marginVertical: responsiveScreenWidth(5),
        color: '#151C2F',
        textAlign: 'center',
        alignItems:'center'
    },
    rewardHeaderText: {
        color: '#4F4F4F',
        fontFamily: 'graphik-regular',
        fontSize: '.8rem',
        textAlign: 'center',
        alignItems:'center'
    },
    rewardsContainer: {
        borderWidth: 0.6,
        borderRadius: 10,
        borderColor: '#E0E0E0',
        paddingHorizontal: normalize(15)
    },
    reward: {
        paddingVertical: normalize(20)
    },
    bonusName: {
        color: '#000000',
        fontFamily: 'graphik-bold',
        fontSize: '.9rem',
        marginVertical: normalize(12)
    },
    bonusText: {
        color: '#4F4F4F',
        fontFamily: 'graphik-regular',
        fontSize: '.7rem'
    }

});