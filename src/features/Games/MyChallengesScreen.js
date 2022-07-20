import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { useDispatch, useSelector } from 'react-redux';
import LottieAnimations from '../../shared/LottieAnimations';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PageLoading from '../../shared/PageLoading';
import { getUserChallenges } from './GameSlice';



const MyChallengesScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)


    const userChallenges = useSelector(state => state.game.userChallenges);
    console.log(userChallenges )




    useEffect(() => {
        dispatch(getUserChallenges()).then(() => setLoading(false));
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

const ChallengeCard = ({userChallenge }) => {
    const navigation = useNavigation();

    const checkScores = () => {
        navigation.navigate('MyChallengesScore', {
            challengeid: userChallenge.challengeId
        })

    }
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
            <Pressable style={styles.scoresButton} onPress={checkScores}>
                <Text style={styles.scoresText}>Scores</Text>
            </Pressable>
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
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(15)
    },
    challengeCategory: {
        fontSize: '.9rem',
        color: '#6895FF',
        fontFamily: 'graphik-medium',
    },
    status: {
        fontSize: '.75rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
    },
    versus: {
        fontSize: '.9rem',
        color: '#9236AD',
        fontFamily: 'graphik-regular',
    },
    opponent: {
        fontSize: '1.2rem',
        color: '#FF716C',
        fontFamily: 'graphik-medium',
    },
    challenger: {
        fontSize: '1.2rem',
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
    }

});