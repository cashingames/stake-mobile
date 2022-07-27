import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
import { useDispatch, useSelector } from 'react-redux';
import PageLoading from '../../shared/PageLoading';
import { isTrue } from '../../utils/stringUtl';
import { getChallengeScores } from '../Auth/AuthSlice';



const MyChallengesScoreScreen = ({ navigation, route }) => {
  useApplyHeaderWorkaround(navigation.setOptions);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const params = route.params;

  const challengeScores = useSelector(state => state.auth.challengeScores)
  console.log(challengeScores)

  useEffect(() => {
    dispatch(getChallengeScores(
      params.challengeid
    )).then(() => setLoading(false));
  }, [])

  if (loading) {
    return <PageLoading
      backgroundColor='#701F88'
      spinnerColor="#FFFF"
    />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.confetti}>
        <LottieAnimations
          animationView={require('../../../assets/challenge.json')}
          height={normalize(150)}
        />
      </View>
      <ChallengeMessage playerPoint={challengeScores} />
      <ChallengeParticipants player={challengeScores} />
      <ResultContainer playerScore={challengeScores} />

    </ScrollView>
  )
}

const ResultContainer = ({ playerScore }) => {
  return (
    <View style={styles.resultContainer}>
      <Text style={styles.finalScoreText}>The final result is</Text>
      <View style={styles.playersResult}>
        <Text style={styles.playersScore}>{playerScore.challengerPoint} </Text>
        <Text style={styles.colon}>: </Text>
        <Text style={styles.opponentScore}>{playerScore.opponentPoint}</Text>
      </View>
    </View>
  )
}

const ChallengeMessage = ({ playerPoint }) => {
  const challengerwins = playerPoint.challengerPoint > playerPoint.opponentPoint;
  const opponentwins = playerPoint.opponentPoint > playerPoint.challengerPoint
  const draw = playerPoint.opponentPoint === playerPoint.challengerPoint


  return (
    <View style={styles.challengeMessageContainer}>
      {playerPoint.challengeStatus === 'CLOSED' ?
        <>
          {challengerwins &&
            <>
              <Text style={styles.challengeMessageTop}>Congrats {playerPoint.challengerUsername}</Text>
              <Text style={styles.challengeMessageBottom}>You won this challenge</Text>
            </>
          }
          {opponentwins &&
            <>
              <Text style={styles.challengeMessageTop}>Congrats {playerPoint.opponentUsername}</Text>
              <Text style={styles.challengeMessageBottom}>You won this challenge</Text>
            </>
          }
          {draw &&
            <>
              <Text style={styles.challengeMessageTop}>Draw</Text>
              <Text style={styles.challengeMessageBottom}>This challenge ended a draw, you can challenge each other again</Text>
            </>
          }
        </>
        :
        <Text style={styles.challengeInProgress}>This Challenge is still in progress</Text>
      }
    </View>
  )
}

const ChallengeParticipants = ({ player }) => {
  return (
    <View style={styles.playersDetails}>
      <TopChallengerDetails challenger={player} />
      <OpponentDetails opponent={player} />
    </View>
  )
}

const TopChallengerDetails = ({ challenger }) => {

  return (
    <View style={styles.playerDetails}>
      <Text style={styles.PlayerName}>{challenger.challengerUsername}</Text>
      <View style={styles.topPlayerIconContainer}>
        <Image
          style={styles.topPlayerIcon}
          source={isTrue(challenger.challengerAvatar) ?
            { uri: challenger.challengerAvatar } :
            require("../../../assets/images/user-icon.png")}
        />
      </View>
    </View>
  )
}

const OpponentDetails = ({ opponent }) => {


  return (
    <View style={styles.playerDetails}>
      <Text style={styles.PlayerName}>{opponent.opponentUsername}</Text>
      <View style={styles.otherPlayerIconContainer}>
        <Image
          style={styles.otherPlayerIcon}
          source={isTrue(opponent.opponentAvatar) ?
            { uri: opponent.opponentAvatar } :
            require("../../../assets/images/user-icon.png")} />
      </View>
    </View>
  )
}

export default MyChallengesScoreScreen;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#701F88',
    paddingHorizontal: normalize(20),
    paddingBottom: responsiveScreenWidth(30)

  },
  confetti: {
    alignItems: 'center'
  },
  resultContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveScreenWidth(5),
    justifyContent: 'space-between',
    backgroundColor: '#F9E821',
    borderRadius: 16,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(5)
  },
  playersResult: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  playerResult: {
    alignItems: 'center',
  },
  duration: {
    fontSize: '.8rem',
    color: '#000000',
    fontFamily: 'graphik-medium',
  },
  finalScoreText: {
    fontSize: '.8rem',
    color: '#9236AD',
    fontFamily: 'graphik-medium',
  },
  playersScore: {
    fontSize: '4rem',
    color: '#6895FF',
    fontFamily: 'graphik-medium',
  },
  colon: {
    fontSize: '4rem',
    color: '#9236AD',
    fontFamily: 'graphik-medium',
    marginBottom: normalize(30)
  },
  opponentScore: {
    fontSize: '4rem',
    color: '#FF716C',
    fontFamily: 'graphik-medium',
  },
  challengerIcon: {
    width: normalize(50),
    height: normalize(50),
    backgroundColor: '#FFFF',
    borderRadius: 15,
    marginRight: normalize(10)
  },
  opponentIcon: {
    width: normalize(50),
    height: normalize(50),
    backgroundColor: '#FFFF',
    borderRadius: 15,
    marginLeft: normalize(10)
  },
  challengeMessageContainer: {
    alignItems: 'center',
    marginBottom: normalize(20)
  },
  challengeMessageTop: {
    fontSize: '1.7rem',
    color: '#FFFF',
    fontFamily: 'graphik-medium',
    marginBottom: '.7rem'
  },
  challengeMessageBottom: {
    fontSize: '1rem',
    color: '#FFFF',
    fontFamily: 'graphik-regular',
    opacity: 0.7,
    textAlign: 'center'
  },
  challengeInProgress: {
    fontSize: '1.2rem',
    color: '#FFFF',
    fontFamily: 'graphik-regular',
    opacity: 0.7,
    textAlign: 'center'
  },
  playersDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topPlayerIcon: {
    width: normalize(93),
    height: normalize(93),
    backgroundColor: '#FFFF',
    borderRadius: 100,
    borderColor: '#2D9CDB',
    borderWidth: 4
  },
  topPlayerIconContainer: {
    borderColor: '#FFFF',
    borderWidth: 5,
    width: normalize(100),
    height: normalize(100),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherPlayerIconContainer: {
    borderColor: '#EF2F55',
    borderWidth: 2,
    width: normalize(65),
    height: normalize(65),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherPlayerIcon: {
    width: normalize(62),
    height: normalize(62),
    backgroundColor: '#FFFF',
    borderRadius: 100,
    borderColor: '#EF2F55',
    borderWidth: 2
  },
  playerDetails: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  PlayerName: {
    fontSize: '.9rem',
    color: '#FFFF',
    fontFamily: 'graphik-medium',
    marginBottom: normalize(10),
    width: responsiveScreenWidth(28),
    textAlign: 'center'
  },
  playerTopDetails: {
    alignItems: 'flex-end'
  },



});