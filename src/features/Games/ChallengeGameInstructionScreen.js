import React, { useRef, useState, useEffect } from "react";
import { Text, View, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import EStyleSheet from "react-native-extended-stylesheet";
import GoToStore from '../../shared/GoToStore';
import { startChallengeGame, getChallengeDetails } from "./GameSlice";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import AppButton from '../../shared/AppButton';
import PageLoading from "../../shared/PageLoading";
import UserAvailableBoost from "../../shared/UserAvailableBoost";
import { getChallengeScores, logoutUser } from "../Auth/AuthSlice";
import LottieAnimations from "../../shared/LottieAnimations";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";



export default function ChallengeGameInstructionsScreen({ navigation, route }) {
  useApplyHeaderWorkaround(navigation.setOptions);
  const { challengeId } = route.params

  const refRBSheet = useRef();
  const [onLoading, setOnLoading] = useState(true)
  const dispatch = useDispatch();
  const challengeDetails = useSelector(state => state.game.challengeDetails);
  const challengeScores = useSelector(state => state.auth.challengeScores)
  const username = useSelector(state => state.auth.user.username);

  const openBottomSheet = () => {
    refRBSheet.current.open()
  }

  const closeBottomSheet = () => {
    refRBSheet.current.close()
  }


  useEffect(() => {
    dispatch(getChallengeDetails(challengeId)).then(() => setOnLoading(false));
    challengeDetails.playerUsername !== username && dispatch(logoutUser());
  }, []);

  useEffect(() => {
    dispatch(getChallengeScores(
      challengeId
    )).then(() => setOnLoading(false));
  }, [])


  if (onLoading) {
    return <PageLoading spinnerColor="#0000ff" />
  }

  return (
    <>
      {challengeDetails.status === "ACCEPTED" &&
        challengeScores.challengerStatus === "PENDING" ?
        <ScrollView style={styles.container}>
          <ChallengeInstructions />
          <AppButton onPress={openBottomSheet} text='Proceed' />
          <UniversalBottomSheet
            refBottomSheet={refRBSheet}
            height={430}
            subComponent={<AvailableChallengeBoosts onClose={closeBottomSheet} />}
          />
        </ScrollView>
        :
        <ChallengeNotPending challenge={challengeScores} />
      }

    </>
  );
};

const ChallengeInstructions = () => {
  return (
    <>
      <Text style={styles.instructionHeader}>Ready to start winning? Let’s get started
        by reading the following instructions carefully.
      </Text>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0031'}.</Text>
        <Text style={styles.instructionText}>There are 10 questions per session.
          You are required to answer these 10 questions in 60 seconds</Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0032'}.</Text>
        <Text style={styles.instructionText}>Click on the “Next” button after answering each question to
          progress to the next question. You can also see your competitor’s progress
          opposite yours on the upper right corner of your screen.
        </Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0033'}.</Text>
        <Text style={styles.instructionText}>At the end of the session, you will see
          your total score against that of your competitor.
        </Text>
      </View>
    </>
  )
};


const AvailableChallengeBoosts = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const boosts = useSelector(state => state.auth.user.boosts);
  const challengeType = useSelector(state => state.game.challengeDetails.gameModeId);
  const gameTypeId = useSelector(state => state.game.gameType.id);
  const challengeCategory = useSelector(state => state.game.challengeDetails.categoryId);
  const challengeId = useSelector(state => state.game.challengeDetails.challenegeId);
  const [loading, setLoading] = useState(false);

  const startChallenge = () => {
    setLoading(true);
    dispatch(startChallengeGame({
      category: challengeCategory,
      type: gameTypeId,
      challenge_id: challengeId
    }))
      .then(unwrapResult)
      .then(result => {
        // console.log(result);
        setLoading(false);
        onClose();
        navigation.navigate("ChallengeGameInProgress")
      })
      .catch((rejectedValueOrSerializedError) => {
        // console.log(rejectedValueOrSerializedError);
        Alert.alert(rejectedValueOrSerializedError.message)
        setLoading(false);
      });
  }



  const visitStore = () => {
    onClose();
    navigation.navigate('GameStore')
  }

  return (
    <View style={styles.availableBoosts}>
      <Text style={styles.title}>Available Boosts</Text>
      {boosts?.length > 0 ?
        <View style={styles.boosts}>
          {boosts.map((boost, i) => <UserAvailableBoost boost={boost} key={i} />
          )}
        </View>
        :
        <Text style={styles.noBoosts}>No boost available, go to store to purchase boost</Text>
      }
      <View style={styles.storeLinks}>
        <GoToStore onPress={visitStore} />
      </View>
      <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={startChallenge} disabled={loading} />
    </View>
  )
}

const ChallengeNotPending = ({ challenge }) => {
  const navigation = useNavigation();

  const goHome = () => {
    navigation.navigate('AppRouter')

  }
  const goToMyChallenges = () => {
    navigation.navigate('MyChallenges')

  }
  return (
    <View style={styles.noContainer}>
      {challenge.challengeStatus === 'CLOSED' &&
        <>
          <View style={styles.animation}>
            <LottieAnimations
              animationView={require('../../../assets/leaderboard.json')}
              width={normalize(170)}
              height={normalize(170)}
            />
          </View>
          <Text style={styles.message}>This challenge has already been played,
            check your recent challenges to see the result
            or go to dashboard to play more exciting games
          </Text>
          <View style={styles.buttonContainer}>
            <AppButton text='Dashboard' onPress={goHome} style={styles.button} />
            <AppButton text='My Challenges' onPress={goToMyChallenges} style={styles.button} />
          </View>

        </>
      }
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FF',
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(20)
  },
  instruction: {
    flexDirection: 'row',
    marginBottom: normalize(20)
  },
  instructionHeader: {
    fontSize: '0.9rem',
    fontFamily: 'graphik-regular',
    color: '#4F4F4F',
    lineHeight: '1.4rem',
    textAlign: 'justify',
    width: responsiveScreenWidth(80),
    marginBottom: normalize(35)
  },
  unicode: {
    fontSize: '1.5rem',
    fontFamily: 'graphik-bold',
    color: '#4F4F4F',
    marginRight: normalize(10)
  },
  instructionText: {
    fontSize: '0.9rem',
    fontFamily: 'graphik-regular',
    color: '#4F4F4F',
    lineHeight: '1.4rem',
    textAlign: 'justify',
    width: responsiveScreenWidth(80)
  },
  buttonContainer: {
    marginTop: normalize(90),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(32),
    borderRadius: 12,
    backgroundColor: '#EF2F55'
  },
  storeLinks: {
    alignItems: 'center',
  },
  amount: {
    fontFamily: 'graphik-bold',
    fontSize: '0.8rem',
    color: '#FF932F'
  },
  title: {
    fontSize: '0.85rem',
    fontFamily: 'graphik-medium',
    color: '#000',
    lineHeight: 23,
    marginBottom: normalize(15)
  },
  boosts: {
    // alignItems: ''

  },
  noBoosts: {
    textAlign: 'center',
    fontSize: '0.85rem',
    fontFamily: 'graphik-regular',
    marginVertical: '1rem'
  },
  boostContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    marginBottom: normalize(17)
  },
  boostAmount: {
    display: 'flex',
    flexDirection: 'row',
  },
  availableBoosts: {
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(20),
  },
  boostDetails: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: normalize(15),
    justifyContent: 'center'
  },
  boostName: {
    fontSize: '0.69rem',
    fontFamily: 'graphik-bold',
    color: '#151C2F',
    lineHeight: '1.2rem',
  },
  boostDescription: {
    fontSize: '0.69rem',
    fontFamily: 'graphik-regular',
    color: '#828282',
    lineHeight: '1.2rem',
    width: responsiveScreenWidth(60),
  },
  storeLink: {
    fontSize: '0.69rem',
    fontFamily: 'graphik-medium',
    color: '#EF2F55',
  },
  needBoost: {
    fontSize: '0.69rem',
    fontFamily: 'graphik-regular',
    color: '#000',
  },
  moreBoost: {
    alignItems: 'center',
  },
  startContainer: {
    marginTop: normalize(50),
  },
  boostIcon: {
    width: normalize(35),
    height: normalize(35)
  },
  noContainer: {
    flex: 1,
    backgroundColor: '#072169',
    paddingHorizontal: normalize(22),
    paddingTop: normalize(25),
    justifyContent: 'center'
  },
  message: {
    fontSize: '1rem',
    color: '#FFFF',
    fontFamily: 'graphik-medium',
    textAlign: 'center',
    lineHeight: '1.5rem'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: normalize(50),
    justifyContent: 'space-between'
  },
  button: {
    width: responsiveScreenWidth(43),
  },
  animation: {
    alignItems: 'center',
    marginBottom: normalize(25)
  },
  emoji: {
    width: normalize(150),
    height: normalize(150),
  }
});
