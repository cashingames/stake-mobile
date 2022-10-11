import React, { useEffect, useRef, useState } from 'react'
import { Text, View, Image, ScrollView, Pressable, ActivityIndicator, ImageBackground, Dimensions, Alert, Platform } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
import { useDispatch, useSelector } from 'react-redux';
import PageLoading from '../../shared/PageLoading';
import { formatCurrency, isTrue } from '../../utils/stringUtl';
import { getChallengeScores, getUser } from '../Auth/AuthSlice';
import { acceptDeclineChallengeInivite, getChallengeDetails, startChallengeGame } from './GameSlice';
import AppButton from '../../shared/AppButton';
import analytics from '@react-native-firebase/analytics';
import { unwrapResult } from '@reduxjs/toolkit';
import { logActionToServer } from '../CommonSlice';
import StakeWinnings from '../../shared/StakeWinnings';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import LowWalletBalance from '../../shared/LowWalletBalance';
import ChallengeTermsAndConditions from '../../shared/ChallengeTermsAndConditions';



const MyChallengesScoreScreen = ({ navigation, route }) => {
  useApplyHeaderWorkaround(navigation.setOptions);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const [clicking, setClicking] = useState(false)
  const [showText, setShowText] = useState(true);
  const params = route.params;
  const user = useSelector(state => state.auth.user);
  const challengeCategory = useSelector(state => state.game.challengeDetails.categoryId);
  const challengeId = useSelector(state => state.game.challengeDetails.challenegeId);
  const gameTypeId = useSelector(state => state.game.gameType.id);
  const challengeScores = useSelector(state => state.auth.challengeScores)
  console.log("challenge scores", challengeScores)
  const challengeDetails = useSelector(state => state.game.challengeDetails);
  console.log("challenge details", challengeDetails)
  const refRBSheet = useRef();

  const openBottomSheet = async () => {
    refRBSheet.current.open()
  }

  const closeBottomSheet = () => {
    dispatch(getUser());
    refRBSheet.current.close()
  }
  const closeTermsSheet = () => {
    refRBSheet.current.close()
  }

  useEffect(() => {
    dispatch(getChallengeScores(
      params.challengeId
    )).then(() => setLoading(false));
    dispatch(getUser());
  }, [])

  useEffect(() => {
    dispatch(getChallengeDetails(params.challengeId)).then(() => setLoading(false)
    );
  }, []);

  useEffect(() => {
    // Change the state every second or the time given by User.
    const interval = setInterval(() => {
      setShowText((showText) => !showText);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const acceptChallengeInivite = async () => {
    setClicking(true);
    if (Number.parseFloat(user.walletBalance) < Number.parseFloat(challengeDetails.stakingAmount)) {
      await analytics().logEvent('challenge_opponent_staking_low_balance', {
        'id': user.username,
        'phone_number': user.phoneNumber,
        'email': user.email
    });
      openBottomSheet();
      setClicking(false);
      return
    }
    dispatch(acceptDeclineChallengeInivite({
      challenge_id: challengeDetails.challenegeId,
      status: 1
    }
    ))
    dispatch(startChallengeGame({
      category: challengeCategory,
      type: gameTypeId,
      challenge_id: challengeId
    }))
      .then(unwrapResult)
      .then(result => {
        dispatch(logActionToServer({
          message: "Challenge Game session " + result.data.game.token + " questions recieved for " + user.username,
          data: result.data.questions
        }))
          .then(unwrapResult)
          .then(async result => {
            await analytics().logEvent("challenge_opponent_accepts_and_start_game", {
              action: "initiate",
              'id': user.username,
              'phone_number': user.phoneNumber,
              'email': user.email
            })
          })
          .catch(() => {
          });
        setClicking(false);
        navigation.navigate("ChallengeGameInProgress")
      })
      .catch((rejectedValueOrSerializedError) => {
        Alert.alert('Failed to start game')
        setClicking(false);
      });
  }

  const challengerPlays = async () => {
    dispatch(startChallengeGame({
      category: challengeCategory,
      type: gameTypeId,
      challenge_id: challengeId
    }))
      .then(unwrapResult)
      .then(result => {
        dispatch(logActionToServer({
          message: "Challenge Game session " + result.data.game.token + " questions recieved for " + user.username,
          data: result.data.questions
        }))
          .then(unwrapResult)
          .then(async result => {
            await analytics().logEvent("challenge_challenger_start_game", {
              action: "initiate",
              'id': user.username,
              'phone_number': user.phoneNumber,
              'email': user.email
            })
          })
          .catch(() => {
          });
        setClicking(false);
        navigation.navigate("ChallengeGameInProgress")
      })
      .catch((rejectedValueOrSerializedError) => {
        Alert.alert('Failed to start game')
        setClicking(false);
      });
  }

  const declineChallengeInivite = () => {
    setClicking(true)
    dispatch(acceptDeclineChallengeInivite({
      challenge_id: challengeDetails.challenegeId,
      status: 0
    }
    ))
      .then(async result => {
        await analytics().logEvent("challenge_declined", {
          action: "incomplete",
          'id': user.username
        })
      })
      .then(() => setClicking(false))
    navigation.navigate('Home')
  }

  if (loading) {
    return <PageLoading
      backgroundColor='#EDDA74'
      spinnerColor="#000000"
    />
  }

  return (
    <ImageBackground source={require('../../../assets/images/quiz-stage.jpg')}
      style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
      resizeMethod="resize">
      <ScrollView style={styles.container}>
        <>
          <View style={styles.confetti}>
            {challengeScores.opponentStatus === "COMPLETED" &&
              challengeScores.challengerStatus === "COMPLETED" &&
              <LottieAnimations
                animationView={require('../../../assets/challenge-end.json')}
                height={normalize(150)}
              />
            }
          </View>
          <ChallengeMessage playerPoint={challengeScores}
            user={user}
            challengeDetails={challengeDetails}
            showText={showText}
            amountWon={challengeDetails.finalStakingWinAmount}
          />
          <ChallengeParticipants player={challengeScores} user={user} />
          {challengeDetails.withStaking &&
            user.username === challengeDetails.opponentUsername &&
            challengeDetails.status === "PENDING" &&
            challengeScores.opponentStatus !== "COMPLETED" &&
            <View style={styles.stakeContainer}>
              <Text style={styles.stakeText}>Accept challenge to stake <Text style={styles.stakeAmount}>&#8358;{formatCurrency(challengeDetails.stakingAmount)}</Text> and stand a chance of winning double of this amount</Text>
            </View>
          }
          {challengeDetails.status === "PENDING" ||
            challengeScores.opponentStatus !== "COMPLETED" ||
            challengeScores.challengerStatus !== "COMPLETED" ?
            <Pressable style={styles.termsContainer} onPress={openBottomSheet}>
              <Text style={styles.termsText}>Click to view terms and conditions</Text>
            </Pressable>
            :
            <></>
          }
          <ResultContainer playerScore={challengeScores} />
        </>
        {Number.parseFloat(user.walletBalance) < Number.parseFloat(challengeDetails.stakingAmount) ?
          <UniversalBottomSheet
            refBottomSheet={refRBSheet}
            height={620}
            subComponent={<LowWalletBalance onClose={closeBottomSheet} />}
          />
          :
          <UniversalBottomSheet
            refBottomSheet={refRBSheet}
            height= {Platform.OS === 'ios' ? 820 : 730}
            subComponent={<ChallengeTermsAndConditions onClose={closeTermsSheet} staking={challengeDetails.withStaking} />}
          />
        }
      </ScrollView>
      <View style={styles.subContainer}>
        {user.username === challengeDetails.opponentUsername &&
          <>
            {challengeDetails.status === "PENDING" &&
              challengeScores.opponentStatus === "PENDING" &&
              challengeScores.opponentStatus !== "COMPLETED" &&
              <View style={styles.buttonContainer}>
                <AppButton text={clicking ? <ActivityIndicator size="small" color="#FFFF" /> : "Accept and Play"} style={styles.acceptButton} onPress={acceptChallengeInivite} />
                <AppButton text="Decline" textStyle={styles.declineText} style={styles.declineButton} onPress={declineChallengeInivite} />
              </View>
              // :
              // <>
              //   {
              //     challengeDetails.status === "ACCEPTED" &&
              //     challengeScores.opponentStatus !== "COMPLETED" &&
              //     <AppButton text={clicking ? <ActivityIndicator size="small" color="#FFFF" /> : "Play"} onPress={challengerPlays} />
              //   }
              // </>
            }
          </>
        }
        {user.username === challengeDetails.playerUsername &&
          <>
            {challengeDetails.status === "ACCEPTED" &&
              challengeScores.challengerStatus === "PENDING" &&
              <AppButton text={clicking ? <ActivityIndicator size="small" color="#FFFF" /> : "Play"} onPress={challengerPlays} />
            }
          </>

        }
      </View>
    </ImageBackground>
  )
}

const ResultContainer = ({ playerScore }) => {
  return (
    <>
      {playerScore.challengerStatus === "COMPLETED" &&
        playerScore.opponentStatus === "COMPLETED" &&
        <View style={styles.resultContainer}>
          <Text style={styles.finalScoreText}>The final result is</Text>
          <View style={styles.playersResult}>
            <Text style={styles.playersScore}>{playerScore.challengerPoint} </Text>
            <Text style={styles.colon}>: </Text>
            <Text style={styles.opponentScore}>{playerScore.opponentPoint}</Text>
          </View>
        </View>
      }
    </>
  )
}

const ChallengeMessage = ({ playerPoint, user, challengeDetails, showText, amountWon }) => {
  const challengerwins = playerPoint.challengerPoint > playerPoint.opponentPoint;
  const challengerlose = playerPoint.opponentPoint > playerPoint.challengerPoint;
  const opponentwins = playerPoint.opponentPoint > playerPoint.challengerPoint
  const opponentlose = playerPoint.challengerPoint > playerPoint.opponentPoint
  const draw = playerPoint.opponentPoint === playerPoint.challengerPoint


  return (
    <View style={styles.challengeMessageContainer}>
      {playerPoint.challengerStatus === "COMPLETED" &&
        playerPoint.opponentStatus === "COMPLETED" ?
        <>
          {challengerwins && user.username === challengeDetails.playerUsername &&
            <>
              <Text style={styles.challengeMessageTop}>Congrats {playerPoint.challengerUsername}</Text>
              <Text style={styles.challengeMessageBottom}>You won this challenge</Text>
              {challengeDetails.withStaking &&
                <View style={styles.winningsContainer}>
                  <StakeWinnings showText={showText} amountWon={amountWon} />
                </View>
              }
            </>
          }
          {opponentwins && user.username === challengeDetails.opponentUsername &&
            <>
              <Text style={styles.challengeMessageTop}>Congrats {playerPoint.opponentUsername}</Text>
              <Text style={styles.challengeMessageBottom}>You won this challenge</Text>
              {challengeDetails.withStaking &&
                <View style={styles.winningsContainer}>
                  <StakeWinnings showText={showText} amountWon={amountWon} />
                </View>
              }
            </>
          }
          {opponentlose && user.username === challengeDetails.opponentUsername &&
            <>
              <Text style={styles.challengeMessageTop}>Sorry {playerPoint.opponentUsername}</Text>
              <Text style={styles.challengeMessageBottom}>You lost this challenge</Text>
            </>
          }
          {challengerlose && user.username === challengeDetails.playerUsername &&
            <>
              <Text style={styles.challengeMessageTop}>Sorry {playerPoint.challengerUsername}</Text>
              <Text style={styles.challengeMessageBottom}>You lost this challenge</Text>
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
        <>
          {user.username === challengeDetails.opponentUsername &&
            challengeDetails.status === "PENDING" &&
            <Text style={styles.challengeInProgress}>You have been invited to a challenge</Text>
          }
          {user.username === challengeDetails.playerUsername &&
            challengeDetails.status === "PENDING" &&
            <Text style={styles.challengeInProgress}>Your opponent has not responded to this challenge</Text>
          }
          {challengeDetails.status === "ACCEPTED" &&
            <Text style={styles.challengeInProgress}>This challenge is still in progress</Text>
          }
        </>
      }
    </View>
  )
}

const ChallengeParticipants = ({ player, user }) => {
  return (
    <ImageBackground source={require('../../../assets/images/challenge-stage.png')}
      style={styles.playerImage} imageStyle={{ borderRadius: 20 }} resizeMode="cover">
      {player.challengerStatus === "COMPLETED" &&
        player.opponentStatus === "COMPLETED" ?
        <View style={styles.winDetails}>
          <View style={styles.winLoseContainer}>
            {player.challengerPoint > player.opponentPoint &&
              <>
                <Image
                  style={styles.winLose}
                  source={require("../../../assets/images/first-crown.png")}
                />
              </>
            }
            <ChallengerDetails challenger={player} />
          </View>
          <Image
            style={styles.versus}
            source={require('../../../assets/images/versus.png')}
          />
          <View style={styles.winLoseContainer}>
            {player.opponentPoint > player.challengerPoint &&
              <>
                <Image
                  style={styles.winLose}
                  source={require("../../../assets/images/first-crown.png")}
                />
              </>
            }
            <OpponentDetails opponent={player} />
          </View>
        </View>
        :
        <View style={styles.winDetails}>
          <ChallengerDetails challenger={player} />
          <Image
            style={styles.versus}
            source={require('../../../assets/images/versus.png')}
          />
          <OpponentDetails opponent={player} />
        </View>
      }
    </ImageBackground>
  )
}

const ChallengerDetails = ({ challenger }) => {

  return (
    <View style={styles.playerDetails}>
      <View style={styles.topPlayerIconContainer}>
        <Image
          style={styles.topPlayerIcon}
          source={isTrue(challenger.challengerAvatar) ?
            { uri: challenger.challengerAvatar } :
            require("../../../assets/images/user-icon.png")}
        />
      </View>
      <Text style={styles.PlayerName}>@{challenger.challengerUsername}</Text>
    </View>
  )
}

const OpponentDetails = ({ opponent }) => {

  return (
    <View style={styles.playerDetails}>
      <View style={styles.otherPlayerIconContainer}>
        <Image
          style={styles.otherPlayerIcon}
          source={isTrue(opponent.opponentAvatar) ?
            { uri: opponent.opponentAvatar } :
            require("../../../assets/images/user-icon.png")} />
      </View>
      <Text style={styles.PlayerName}>@{opponent.opponentUsername}</Text>
    </View>
  )
}


export default MyChallengesScoreScreen;

const styles = EStyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: normalize(20),
    paddingTop: responsiveScreenWidth(5),
  },
  subContainer: {
    paddingHorizontal: normalize(20),
    marginBottom: '2rem',
    flex: 1,
  },
  confetti: {
    alignItems: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: responsiveScreenWidth(40),
    justifyContent: 'space-between',
    backgroundColor: '#EDDA74',
    borderRadius: 16,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(5),
    opacity: 0.9,
    marginTop: '.3rem'
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
  winLose: {
    width: normalize(35),
    height: normalize(35),
  },
  versus: {
    width: normalize(35),
    height: normalize(102),
  },
  winLoseContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  challengeMessageContainer: {
    alignItems: 'center',
    marginBottom: normalize(12)
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
    fontSize: '1rem',
    color: '#FFFF',
    fontFamily: 'graphik-regular',
    opacity: 0.9,
    textAlign: 'center'
  },

  winDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  topPlayerIcon: {
    width: normalize(70),
    height: normalize(70),
    backgroundColor: '#FFFF',
    borderRadius: 100,
    borderColor: '#2D9CDB',
    borderWidth: 3
  },
  topPlayerIconContainer: {
    borderColor: '#FFFF',
    borderWidth: 4,
    width: normalize(70),
    height: normalize(70),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherPlayerIconContainer: {
    borderColor: '#EF2F55',
    borderWidth: 4,
    width: normalize(70),
    height: normalize(70),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherPlayerIcon: {
    width: normalize(70),
    height: normalize(70),
    backgroundColor: '#FFFF',
    borderRadius: 100,
    borderColor: '#EF2F55',
    borderWidth: 3
  },
  playerDetails: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  PlayerName: {
    fontSize: '.9rem',
    color: '#FFFF',
    fontFamily: 'graphik-regular',
    // marginBottom: normalize(10),
    // width: responsiveScreenWidth(27),
    textAlign: 'center'
  },
  playerTopDetails: {
    alignItems: 'flex-end'
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    paddingHorizontal: responsiveScreenWidth(1),
    width: '9rem',
    backgroundColor: '#EF2F55'
  },
  declineButton: {
    paddingHorizontal: responsiveScreenWidth(1),
    width: '9rem',
    backgroundColor: 'transparent',
    borderColor: '#FFFF',
    borderWidth: 1
  },
  declineText: {
    color: '#FFFF'
  },
  playerImage: {
    marginVertical: '.5rem',
    display: 'flex',
    paddingVertical: normalize(40),
    paddingHorizontal: normalize(20),
    borderRadius: 20,
    opacity: 0.93
  },
  stakeContainer: {
    backgroundColor: '#EDDA74',
    borderRadius: 15,
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(20),
    alignItems: 'center'
  },
  stakeText: {
    fontSize: '.8rem',
    color: '#000000',
    fontFamily: 'graphik-medium',
    textAlign: 'center',
    lineHeight: '1rem'
  },
  stakeAmount: {
    color: '#EF2F55',
  },
  winningsContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFF',
    paddingTop: '.3rem',
    marginTop: normalize(10),
    borderRadius: 13,
    paddingHorizontal: '4.2rem'
  },
  termsContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: '.3rem',
    marginVertical: normalize(12),
    borderRadius: 10,
    paddingHorizontal: '.5rem',
    borderColor: '#FFFF',
    borderWidth: 1
  },
  termsText: {
    fontSize: '.8rem',
    color: '#FFFF',
    fontFamily: 'graphik-regular',
    // textAlign: 'center'
  }

});