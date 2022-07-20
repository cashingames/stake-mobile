import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, Pressable, StatusBar } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { useDispatch, useSelector } from 'react-redux';
import LottieAnimations from '../../shared/LottieAnimations';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PageLoading from '../../shared/PageLoading';
import { getUserChallenges } from './GameSlice';
import AppButton from '../../shared/AppButton';
import { getUser } from '../Auth/AuthSlice';



const MyChallengesScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)


    const userChallenges = useSelector(state => state.game.userChallenges);
    console.log(userChallenges)


    useEffect(() => {
        dispatch(getUserChallenges()).then(() => setLoading(false));
    }, []);

    useEffect(() => {
        StatusBar.setBackgroundColor('#701F88');
        StatusBar.setBarStyle('light-content');
        return () => {
            StatusBar.setBackgroundColor('#FFFF');
            StatusBar.setBarStyle('dark-content');
        }
    }, []);

    if (loading) {
        return <PageLoading
            backgroundColor='#701F88'
            spinnerColor="#FFFF"
        />
    }




    return (
        <ScrollView style={styles.container}>
            <View>
                {userChallenges.map((userChallenge, i) => <ChallengeCard
                    key={i}
                    userChallenge={userChallenge}
                />
                )}
            </View>

        </ScrollView>
    )
}

const ChallengeCard = ({ userChallenge }) => {
    const navigation = useNavigation();

    const checkScores = () => {
        navigation.navigate('MyChallengesScore', {
            challengeid: userChallenge.challengeId
        })

    }
    const challengeDeclined = userChallenge.status === "DECLINED";
    return (
        <View style={styles.challengeContainer}>
            <View style={styles.categoryContainer}>
                <Text style={styles.challengeCategory}>{userChallenge.subcategory}</Text>
                <LottieAnimations
                    animationView={require('../../../assets/challenge.json')}
                    height={normalize(50)}
                />
            </View>
            <Text style={styles.status}>{userChallenge.date}</Text>
            <Text style={styles.status}>STATUS : {userChallenge.status}</Text>
            <View style={styles.competitorsContainer}>
                <Text style={styles.challenger}>{userChallenge.playerUsername}</Text>
                <Text style={styles.versus}>vs</Text>
                <Text style={styles.opponent}>{userChallenge.opponentUsername}</Text>
            </View>
            {userChallenge.status === "DECLINED" ?
                <AppButton text={'Challenge Declined'} disabled={challengeDeclined} style={styles.disabled} />
                :
                <Pressable style={styles.scoresButton} onPress={checkScores}>
                    <Text style={styles.scoresText}>Scores</Text>
                </Pressable>
            }


        </View>
    )
}

export default MyChallengesScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#701F88',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(5)

    },
    challengeContainer: {
        marginVertical: responsiveScreenWidth(3),
        backgroundColor: '#FFFF',
        borderRadius: 16,
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(12)
    },
    challengeCategory: {
        fontSize: '.9rem',
        color: '#6895FF',
        fontFamily: 'graphik-medium',
    },
    status: {
        fontSize: '.75rem',
        color: '#701F88',
        fontFamily: 'graphik-medium',
        opacity: 0.4
    },
    versus: {
        fontSize: '.9rem',
        color: '#9236AD',
        fontFamily: 'graphik-regular',
    },
    opponent: {
        fontSize: '1rem',
        color: '#FF716C',
        fontFamily: 'graphik-medium',
    },
    challenger: {
        fontSize: '1rem',
        color: '#2D9CDB',
        fontFamily: 'graphik-medium',
    },
    competitorsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: normalize(10),
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(5),
        alignItems: 'center'

    },
    scoresButton: {
        backgroundColor: '#EF2F55',
        alignItems: 'center',
        paddingVertical: normalize(10),
        marginTop: normalize(15),
        borderRadius: 5
    },
    scoresText: {
        fontSize: '.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    disabled: {
        backgroundColor: '#DFCBCF'
    }

});