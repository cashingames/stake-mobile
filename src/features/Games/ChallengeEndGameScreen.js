import React from 'react';
import { Text, View, Image, ScrollView, Pressable, BackHandler } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppButton from '../../shared/AppButton';
import GameEndClockAnimation from '../../shared/GameEndClockAnimation';
import UserName from '../../shared/UserName';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function ChallengeEndGameScreen({ navigation }) {
    const user = useSelector(state => state.auth.user);
    const pointsGained = useSelector(state => state.game.pointsGained);
    const isGameEnded = useSelector(state => state.game.isEnded);

    const onHomeButtonClick = () => {
        navigation.navigate('AppRouter')
    }

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => isGameEnded;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [isGameEnded])
    );




    return (

        <ScrollView style={styles.container}>
            <GameEndClockAnimation />
            <UserName userName={user.firstName} />
            <UserResultInfo pointsGained={pointsGained} />
            <SeeRank />
            <FinalScore pointsGained={pointsGained} />
            <AppButton text='Return to Home'
            style={styles.gameButton}
                onPress={onHomeButtonClick} />

        </ScrollView>

    );
}

const UserResultInfo = ({ pointsGained }) => {
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.info}>you scored {pointsGained}, go to the challenge leaderboard
                to view the status and result of this challenge
            </Text>
        </View>
    )
}

const SeeRank = () => {
    const navigation = useNavigation();

    return (
        <Pressable
            onPress={() => navigation.navigate('MyChallenges')}
            style={styles.goToLeaderboard}
        >
            <View style={styles.seeRank}>
                <Image
                    source={require('../../../assets/images/leaderboard.png')}
                />
                <Text style={styles.seeRankText}>Click to see status and result of this challenge</Text>
            </View>
        </Pressable>

    )
}

const FinalScore = ({ pointsGained }) => {
    return (
        <View style={styles.finalScore}>
            <Text style={styles.finalScoreText}>Your final score point is</Text>
            <Text style={styles.point}>{pointsGained}</Text>
        </View>
    )
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(18),
        display: 'flex',
    },
    image: {
        flex: 1,
    },
    emojiContainer: {
        alignItems: 'center',
    },
    emoji: {
        width: normalize(66),
        height: normalize(70)
    },
    infoContainer: {
        alignItems: 'center',
        textAlign: 'center',
        marginHorizontal: normalize(25),
        marginBottom: responsiveScreenWidth(10)
    },
    info: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        fontSize: '1rem',
        lineHeight: '1.5rem'
    },
    seeRank: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    seeRankText: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
    },
    goToLeaderboard: {
        backgroundColor: '#701F88',
        borderRadius: 8,
        padding: normalize(15),
        marginBottom: normalize(15)
    },
    finalScore: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9E821',
        borderRadius: 16,
        marginBottom: responsiveScreenWidth(23),
        padding: Platform.OS === 'ios' ? normalize(15) : normalize(10),
    },
    finalScoreText: {
        color: '#9236AD',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
    },
    point: {
        color: '#9236AD',
        fontFamily: 'graphik-bold',
        fontSize: '4rem',
    },
    gameButton: {
      marginVertical:normalize(1)
    },


});
