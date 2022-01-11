import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground
} from 'react-native';
import normalize from '../../utils/normalize';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../shared/AppButton';

const FirstTimeUserBonus = ({navigation}) => {
    return (
        <ImageBackground source={require('../../../assets/images/confetti1.png')} style={styles.image} resizeMode='contain'>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.userDetails}>Congrats, John</Text>
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

const styles = StyleSheet.create({

    image: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingHorizontal: normalize(18),
        paddingTop: normalize(35),
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: normalize(40)
    },
    userDetails: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(28),
        marginVertical: normalize(20),
        color: '#151C2F'
    },
    rewardHeaderText: {
        color: '#4F4F4F',
        fontFamily: 'graphik-regular',
        fontSize: normalize(12),
        width: normalize(200),
        textAlign: 'center'
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
        fontSize: normalize(14),
        marginVertical: normalize(12)
    },
    bonusText: {
        color: '#4F4F4F',
        fontFamily: 'graphik-regular',
        fontSize: normalize(10),
    }

});
