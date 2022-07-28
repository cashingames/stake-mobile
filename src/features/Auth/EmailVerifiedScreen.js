import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert
} from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import AppButton from '../../shared/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import LottieAnimations from '../../shared/LottieAnimations';
import { setToken, verifyUser} from './AuthSlice';
import { Base64 } from 'js-base64';
import { saveToken } from '../../utils/ApiHelper';
import { unwrapResult } from '@reduxjs/toolkit';



const EmailVerifiedScreen = ({ navigation, route }) => {
    const email = route.params.email
    console.log(email)

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const goToDashboard = () => {
        setLoading(true);
        dispatch(verifyUser({ email: email }))
            .then(unwrapResult)
            .then(response => {
                console.log(response)
                saveToken(response.data.data)
                setLoading(false);
                navigation.navigate('AppRouter')
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError)
                Alert.alert("Failed to log in");
                setLoading(false);
            })
    }

    if (user.username) {
        navigation.navigate("AppRouter");
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.excellent}>
                    <LottieAnimations
                        animationView={require('../../../assets/congrats.json')}
                        width={normalize(170)}
                        height={normalize(170)}
                    />
                </View>
                <View style={styles.headerContainer}>
                    <Text style={styles.userDetails}>Congratulations</Text>
                    <Text style={styles.rewardHeaderText}>
                        You have successfully been register, kindly click on the button below
                        to verify your email to Login and play exciting games and win great prices
                    </Text>
                </View>
                <FirstTimeUserRewards />
            </ScrollView>
            <AppButton text={loading ? 'Verifying...' : 'Login'} onPress={goToDashboard} disabled={loading} />

        </View>

    )
}


const FirstTimeUserRewards = () => {
    var rewards =
        [
            {
                bonus: 100,
                bonusName: 'Naira',
                bonusText: 'Get a boost on the leaderboard with free points'
            },
            {
                bonus: 3,
                bonusName: 'Skips',
                bonusText: 'Skip a question in a game session'
            },
            {
                bonus: 3,
                bonusName: 'Freezes',
                bonusText: 'Freeze time for 15 seconds during a game session'
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
export default EmailVerifiedScreen;

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingHorizontal: normalize(18),
        paddingBottom: responsiveScreenWidth(10),
    },
    excellent: {
        alignItems: 'center'
    },
    headerContainer: {
        alignItems: 'center',
        // marginVertical: responsiveScreenWidth(10)
    },
    userDetails: {
        fontFamily: 'graphik-bold',
        fontSize: '1.2rem',
        marginVertical: responsiveScreenWidth(5),
        color: '#151C2F',
        textAlign: 'center',
        alignItems: 'center'
    },
    rewardHeaderText: {
        color: '#4F4F4F',
        fontFamily: 'graphik-regular',
        fontSize: '.8rem',
        textAlign: 'center',
        alignItems: 'center',
        lineHeight: '1.7rem'
    },
    rewardsContainer: {
        // borderWidth: 0.6,
        // borderRadius: 10,
        // borderColor: '#E0E0E0',
        // paddingHorizontal: normalize(15),
        // marginVertical: normalize(10),
        // elevation: 2,
        // shadowColor: '#000',
        // shadowOffset: { width: 0.5, height: 2 },
        // shadowOpacity: 0.6,
    },
    reward: {
        paddingVertical: normalize(15)
    },
    bonusName: {
        color: '#000000',
        fontFamily: 'graphik-bold',
        fontSize: '.9rem',
        marginVertical: normalize(10)
    },
    bonusText: {
        color: '#4F4F4F',
        fontFamily: 'graphik-regular',
        fontSize: '.7rem'
    }

});