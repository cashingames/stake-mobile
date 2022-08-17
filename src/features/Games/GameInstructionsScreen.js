import React, { useRef, useState } from "react";
import { Text, View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import EStyleSheet from "react-native-extended-stylesheet";
import GoToStore from '../../shared/GoToStore';
import { startGame, setIsPlayingTrivia, startChallengeGame } from "./GameSlice";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import AppButton from './../../shared/AppButton';
import UserAvailableBoost from "../../shared/UserAvailableBoost";
import { logActionToServer } from "../CommonSlice";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";


export default function GameInstructionsScreen({ navigation }) {
  useApplyHeaderWorkaround(navigation.setOptions);

  const gameMode = useSelector(state => state.game.gameMode);
  const refRBSheet = useRef();

  const openBottomSheet = () => {
    refRBSheet.current.open()
  }

  const closeBottomSheet = () => {
    refRBSheet.current.close()
  }


  return (

    <View style={styles.container}>
      <ScrollView>
        {gameMode.name === "EXHIBITION" && <ExhibitionInstructions />}
        {gameMode.name === "CHALLENGE" && <ChallengeInstructions />}
        <UniversalBottomSheet
          refBottomSheet={refRBSheet}
          height={430}
          subComponent={<AvailableBoosts onClose={closeBottomSheet} />}
        />
      </ScrollView>
      <AppButton
        onPress={openBottomSheet}
        text='Proceed'
        style={styles.proceedButton}
      />
    </View>
  );
};
const ExhibitionInstructions = () => {
  return (
    <>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0031'}.</Text>
        <Text style={styles.instructionText}>There are 10 questions per session.
          You are required to answer these 10 questions in 60 seconds</Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0032'}.</Text>
        <Text style={styles.instructionText}>Click on the “Next” button after answering each question to
          progress to the next question.</Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0033'}.</Text>
        <Text style={styles.instructionText}>At the end of the session, you will see your total score</Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0034'}.</Text>
        <Text style={styles.instructionText}>Click “Play again” to start another session in winning
          more points to climb the leader board.</Text>
      </View>
    </>
  )
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


const AvailableBoosts = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const boosts = useSelector(state => state.auth.user.boosts);
  const gameCategoryId = useSelector(state => state.game.gameCategory.id);
  const gameTypeId = useSelector(state => state.game.gameType.id);
  const gameModeId = useSelector(state => state.game.gameMode.id);
  const gameMode = useSelector(state => state.game.gameMode);
  const challengeType = useSelector(state => state.game.challengeDetails.gameModeId);
  const challengeCategory = useSelector(state => state.game.challengeDetails.categoryId);
  const challengeId = useSelector(state => state.game.challengeDetails.challenegeId);
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);

  console.log(gameCategoryId, gameModeId, gameTypeId);

  const onStartGame = () => {
    setLoading(true);
    dispatch(setIsPlayingTrivia(false))
    dispatch(startGame({
      category: gameCategoryId,
      type: gameTypeId,
      mode: gameModeId
    }))
      .then(unwrapResult)
      .then(result => {
        dispatch(logActionToServer({
          message: "Game session " + result.data.game.token + " questions recieved for " + user.username,
          data: result.data.questions
        }))
          .then(unwrapResult)
          .then(result => {
            console.log('Action logged to server');
          })
          .catch((e) => {
            console.log('Failed to log to server');
          });
        setLoading(false);
        onClose();
        navigation.navigate("GameInProgress")
      })
      .catch((rejectedValueOrSerializedError) => {
        console.log(rejectedValueOrSerializedError);
        Alert.alert(rejectedValueOrSerializedError.message)
        setLoading(false);
      });
  }

  const startChallenge = () => {
    setLoading(true);
    dispatch(startChallengeGame({
      category: challengeCategory,
      type: gameTypeId,
      challenge_id: challengeId
    }))
      .then(unwrapResult)
      .then(result => {
        console.log(result);
        dispatch(logActionToServer({
          message: "Challenge Game session " + result.data.game.token + " questions recieved for " + user.username,
          data: result.data.questions
        }))
          .then(unwrapResult)
          .then(result => {
            console.log('Action logged to server');
          })
          .catch(() => {
            console.log('failed to log to server');
          });
        setLoading(false);
        onClose();
        navigation.navigate("ChallengeGameInProgress")
      })
      .catch((rejectedValueOrSerializedError) => {
        console.log(rejectedValueOrSerializedError);
        Alert.alert('Failed to start game')
        // Alert.alert(rejectedValueOrSerializedError.message)
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
      {gameMode.name === "EXHIBITION" && <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={onStartGame} disabled={loading} />}
      {gameMode.name === "CHALLENGE" && <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={startChallenge} disabled={loading} />}

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
  proceedButton: {
    marginVertical: 10,
  }
});
