import React, { useRef, useState } from "react";
import { Text, View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import EStyleSheet from "react-native-extended-stylesheet";
import { startGame, setIsPlayingTrivia, startChallengeGame } from "./GameSlice";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import AppButton from './../../shared/AppButton';
import { logActionToServer } from "../CommonSlice";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import analytics from '@react-native-firebase/analytics';
import ExhibitionStakeAmount from "../../shared/ExhibitionStakeAmount";
import StakingButtons from "../../shared/StakingButtons";
import ExhibitionUserAvailableBoosts from "../../shared/ExhibitionUserAvailableBoosts";



export default function GameInstructionsScreen({ navigation }) {
  useApplyHeaderWorkaround(navigation.setOptions);

  const gameMode = useSelector(state => state.game.gameMode);
  const user = useSelector(state => state.auth.user);

  const features = useSelector(state => state.common.featureFlags);

  const isStakingFeatureEnabled = features['exhibition_game_staking'] !== undefined && features['exhibition_game_staking'].enabled == true;


  const refRBSheet = useRef();

  const gotoStaking = async () => {
    await analytics().logEvent('initiate_exhibition_staking', {
      'id': user.username,
      'phone_number': user.phoneNumber,
      'email': user.email
    })
    navigation.navigate("GameStaking")
  }

  const openBottomSheet = async () => {
    await analytics().logEvent('proceed_exhibition_without_staking', {
      'id': user.username,
      'phone_number': user.phoneNumber,
      'email': user.email
    })
    refRBSheet.current.open()
  }

  const closeBottomSheet = () => {
    refRBSheet.current.close()
  }


  return (

    <View style={styles.container}>
      <ScrollView>
        {gameMode.name === "EXHIBITION" && <ExhibitionInstructions />}
        {/* {gameMode.name === "CHALLENGE" && <ChallengeInstructions />} */}
        {/* {isStakingFeatureEnabled && gameMode.name !== "CHALLENGE" && */}
        {isStakingFeatureEnabled &&
          <ExhibitionStakeAmount onPress={gotoStaking} />
        }
        <UniversalBottomSheet
          refBottomSheet={refRBSheet}
          height={430}
          subComponent={<AvailableBoosts onClose={closeBottomSheet} user={user} />}
        />
      </ScrollView>
      {/* {isStakingFeatureEnabled && gameMode.name !== "CHALLENGE" ? */}
      {isStakingFeatureEnabled ?
        <StakingButtons onPress={gotoStaking} onPressProceed={openBottomSheet} />
        :
        <AppButton
          onPress={openBottomSheet}
          text='Proceed'
          style={styles.proceed}
        />

      }
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

// const ChallengeInstructions = () => {
//   return (
//     <>
//       <Text style={styles.instructionHeader}>Ready to start winning? Let’s get started
//         by reading the following instructions carefully.
//       </Text>
//       <View style={styles.instruction}>
//         <Text style={styles.unicode}>{'\u0031'}.</Text>
//         <Text style={styles.instructionText}>There are 10 questions per session.
//           You are required to answer these 10 questions in 60 seconds</Text>
//       </View>
//       <View style={styles.instruction}>
//         <Text style={styles.unicode}>{'\u0032'}.</Text>
//         <Text style={styles.instructionText}>Click on the “Next” button after answering each question to
//           progress to the next question. You can also see your competitor’s progress
//           opposite yours on the upper right corner of your screen.
//         </Text>
//       </View>
//       <View style={styles.instruction}>
//         <Text style={styles.unicode}>{'\u0033'}.</Text>
//         <Text style={styles.instructionText}>At the end of the session, you will see
//           your total score against that of your competitor.
//         </Text>
//       </View>
//     </>
//   )
// };


const AvailableBoosts = ({ onClose, user }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const boosts = useSelector(state => state.auth.user.boosts);
  const gameCategoryId = useSelector(state => state.game.gameCategory.id);
  const gameTypeId = useSelector(state => state.game.gameType.id);
  const gameModeId = useSelector(state => state.game.gameMode.id);
  const gameMode = useSelector(state => state.game.gameMode);
  // const challengeType = useSelector(state => state.game.challengeDetails.gameModeId);
  // const challengeCategory = useSelector(state => state.game.challengeDetails.categoryId);
  // const challengeId = useSelector(state => state.game.challengeDetails.challenegeId);
  const [loading, setLoading] = useState(false);


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
          .then(async result => {
            await analytics().logEvent("exhibition_without_staking_game_started", {
              'id': user.username,
              'phone_number': user.phoneNumber,
              'email': user.email
            })
            // console.log('Action logged to server');
          })
          .catch((e) => {
            // console.log('Failed to log to server');
          });
        setLoading(false);
        onClose();
        navigation.navigate("GameInProgress")
      })
      .catch((rejectedValueOrSerializedError) => {
        Alert.alert(rejectedValueOrSerializedError.message)
        setLoading(false);
      });
  }

  // const startChallenge = () => {
  //   setLoading(true);
  //   dispatch(startChallengeGame({
  //     category: challengeCategory,
  //     type: gameTypeId,
  //     challenge_id: challengeId
  //   }))
  //     .then(unwrapResult)
  //     .then(result => {
  //       dispatch(logActionToServer({
  //         message: "Challenge Game session " + result.data.game.token + " questions recieved for " + user.username,
  //         data: result.data.questions
  //       }))
  //         .then(unwrapResult)
  //         .then(async result => {
  //           await analytics().logEvent("challenge_start_game", {
  //             action: "initiate",
  //             'id': user.username,
  //             'phone_number': user.phoneNumber,
  //             'email': user.email
  //           })
  //           // console.log('Action logged to server');
  //         })
  //         .catch(() => {
  //           // console.log('failed to log to server');
  //         });
  //       setLoading(false);
  //       onClose();
  //       navigation.navigate("ChallengeGameInProgress")
  //     })
  //     .catch((rejectedValueOrSerializedError) => {
  //       Alert.alert('Failed to start game')
  //       setLoading(false);
  //     });
  // }


  return (
    <ExhibitionUserAvailableBoosts gameMode={gameMode}
      boosts={boosts} onStartGame={onStartGame}
      // startChallenge={startChallenge} 
      loading={loading}
      onClose={onClose}
    />
  )
}




const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FF',
    paddingHorizontal: normalize(18),
    paddingTop: normalize(20),
    paddingBottom: normalize(5)
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
  proceed: {
    marginVertical: 10,
  },
});
