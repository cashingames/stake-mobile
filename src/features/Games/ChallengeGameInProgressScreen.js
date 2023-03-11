import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, ScrollView, ImageBackground, Alert, StatusBar, BackHandler } from 'react-native';
import normalize from "../../utils/normalize";
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

import {
  nextQuestion, challengeEndGame, setShowCorrectAnswer, setSubmissionResult, setSelectedOption
} from "./GameSlice";

import AppButton from "../../shared/AppButton";
import EStyleSheet from "react-native-extended-stylesheet";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { useFocusEffect } from "@react-navigation/native";
import PlayGameHeader from "../../shared/PlayGameHeader";
import GameTopicProgress from "../../shared/GameTopicProgress";
import AvailableGameSessionBoosts from "../../shared/AvailableGameSessionBoosts";
import GameQuestions from "../../shared/GameQuestions";
import UserAvailableBoosts from "../../shared/UserAvailableBoosts";
import { logActionToServer } from "../CommonSlice";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import useSound from "../../utils/useSound";


export default function ChallengeGameInProgressScreen({ navigation }) {
  useApplyHeaderWorkaround(navigation.setOptions)
  const dispatch = useDispatch();
  const refRBSheet = useRef();

  const gameSessionToken = useSelector(state => state.game.gameSessionToken);
  const chosenOptions = useSelector(state => state.game.chosenOptions);
  const consumedBoosts = useSelector(state => state.game.consumedBoosts);
  const isEnded = useSelector(state => state.game.isEnded);
  const user = useSelector(state => state.auth.user);
  const [ending, setEnding] = useState(false);
  const newUser = useSelector(state => state.auth.user.joinedOn);
  const newUserDate = newUser.slice(0, 10);
  const { playSound } = useSound(require('../../../assets/sounds/game-started.mp3'))


  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;


  useEffect(() => {
    playSound()
}, [])
  const openBottomSheet = () => {
    refRBSheet.current.open()
  }

  const closeBottomSheet = () => {
    refRBSheet.current.close()
  }

  const onEndGame = (confirm = false) => {

    if (ending) {
      //doe not delete
      // console.log("Trying to end second time. If this happens, please notify Oye")
      return;
    }

    setEnding(true);
    if (confirm) {
      showExitConfirmation()
      return;
    }

    dispatch(setSelectedOption(null))
    dispatch(setSubmissionResult())
    dispatch(setShowCorrectAnswer(false))

    dispatch(challengeEndGame({
      token: gameSessionToken,
      chosenOptions,
      consumedBoosts
    }))
      .then(unwrapResult)
      .then(async () => {
        crashlytics().log('User completed challenge game');
        if (formattedDate === newUserDate) {
          await analytics().logEvent('new_user_challenge_completed', {
            'action': 'complete'
          });
        } else {
          await analytics().logEvent('challenge_completed', {
            'action': 'complete'
          });
        }
        dispatch(logActionToServer({
          message: "Challenge Game session " + gameSessionToken + " chosen options for " + user.username,
          data: chosenOptions
        }))
        setEnding(false);
        navigation.navigate('ChallengeEndGameScreen')

      })
      .catch((rejectedValueOrSerializedError) => {
        crashlytics().recordError();
        crashlytics().log('failed to end challenge game');
        setEnding(false);
        Alert.alert('failed to end game')
      });
  }

  const showExitConfirmation = () => {
    Alert.alert(
      'Exit Game?',
      'You have an ongoing game. Do you want to submit this game ?',
      [
        {
          text: "Continue playing",
          style: 'cancel',
          onPress: () => setEnding(false)
        },
        {
          text: 'Exit',
          onPress: () => {
            // console.log("show exit from exit button")
            onEndGame();
          },
        },
      ]
    );
  }

  //disable back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setTranslucent(true)
      StatusBar.setBackgroundColor("transparent")
      StatusBar.setBarStyle('light-content');
    }, [])
  );

  if (isEnded) {
    return null;
  }

  return (
    <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="contain">
      <View style={styles.container} keyboardShouldPersistTaps='always'>
        <PlayGameHeader onPress={showExitConfirmation} onPressBoost={openBottomSheet} />
        <GameProgressAndBoosts onComplete={() => onEndGame()} ending={ending} />
        <GameQuestions onEndGame={() => onEndGame()} ending={ending}/>
        <UniversalBottomSheet
          refBottomSheet={refRBSheet}
          height={350}
          subComponent={<UserAvailableBoosts onClose={closeBottomSheet} />}
        />
      </View>
    </ImageBackground>
  );
}


const GameProgressAndBoosts = ({ onComplete, ending }) => {
  return (
    <View style={styles.gameProgressAndBoost}>
      <GameTopicProgress onComplete={onComplete} ending={ending} />
      <AvailableGameSessionBoosts />
    </View>
  )
}

const styles = EStyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#9C3DB8',
    paddingTop: normalize(45),
  },
  image: {
    paddingHorizontal: normalize(18),
    backgroundColor: '#9C3DB8',
    flex: 1,
  },
  gameProgressAndBoost: {
    display: 'flex',
    backgroundColor: 'rgba(57, 15, 15, 0.4)',
    shadowColor: 'inset 0px 4px 0px rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    marginVertical: normalize(18)
  },
  options: {
    // paddingBottom: normalize(80),
  },
  nextButton: {
    marginBottom: 10,
    marginTop: 5
  }

});
