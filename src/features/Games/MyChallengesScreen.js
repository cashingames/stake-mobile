import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, Pressable, StatusBar } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { useDispatch, useSelector } from 'react-redux';
import LottieAnimations from '../../shared/LottieAnimations';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PageLoading from '../../shared/PageLoading';
import { getUserChallenges } from '../Auth/AuthSlice';



const MyChallengesScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)

    const userChallenges = useSelector(state => state.auth.userChallenges);
    console.log(userChallenges)


    useEffect(() => {
        dispatch(getUserChallenges()).then(() => setLoading(false));
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );


    if (loading) {
        return <PageLoading
            backgroundColor='#701F88'
            spinnerColor="#FFFF"
        />
    }




    return (
        <ScrollView style={styles.container}>
            {userChallenges.length > 0 ?
                <View>
                    {userChallenges.map((userChallenge, i) => <ChallengeCard
                        key={i}
                        userChallenge={userChallenge}
                    />
                    )}
                </View>
                :
                <NoChallenges />

            }

        </ScrollView>
    )
}

const ChallengeCard = ({ userChallenge }) => {
    const navigation = useNavigation();

    const checkScores = () => {
        navigation.navigate('MyChallengesScore', {
            challengeId: userChallenge.challengeId
        })

    }
    const challengeDeclined = userChallenge.status === "DECLINED";
    return (
        <>
            {!challengeDeclined ?
                < View style={styles.challengeContainer}>
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
                    {/* <AppButton text={'Challenge Declined'} disabled={challengeDeclined} style={styles.disabled} /> */}

                    <Pressable style={styles.scoresButton} onPress={checkScores}>
                        {userChallenge.status === "CLOSED" ?
                            <Text style={styles.scoresText}>Scores</Text>
                            :
                            <Text style={styles.scoresText}>View challenge details</Text>
                        }
                    </Pressable>
                </View>
                :
                <></>
            }
        </>

    )
}

const NoChallenges = () => {
    return (
        < View style={styles.noTransactionContainer}>
            <LottieAnimations
                animationView={require('../../../assets/challenge.json')}
                height={normalize(100)}
            />
            <Text style={styles.noTransaction}>
                You dont have any challenge yet. Challenge a friend to play exciting and fun games
            </Text>
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
    },
    noTransaction: {
        fontFamily: 'graphik-regular',
        fontSize: '1rem',
        color: '#FFFF',
        lineHeight: '1.5rem',
        textAlign: 'center',
        marginTop: responsiveScreenWidth(8)
    },
    noTransactionContainer: {
        display: 'flex',
        marginVertical: responsiveScreenWidth(40),
        paddingHorizontal: normalize(18),
        alignItems: 'center'
    },

});