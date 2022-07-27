import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, Image, ScrollView, ImageBackground, Animated, Pressable, Alert, StatusBar, BackHandler } from 'react-native';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { unwrapResult } from '@reduxjs/toolkit';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';

import {
  nextQuestion, challengeEndGame
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


export default function ChallengeGameInProgressScreen({ navigation }) {
  useApplyHeaderWorkaround(navigation.setOptions);


  const dispatch = useDispatch();
  const refRBSheet = useRef();

  const gameSessionToken = useSelector(state => state.game.gameSessionToken);
  const chosenOptions = useSelector(state => state.game.chosenOptions);
  const consumedBoosts = useSelector(state => state.game.consumedBoosts);
  const isEnded = useSelector(state => state.game.isEnded);

  const [ending, setEnding] = useState(false);

  const onEndGame = (confirm = false) => {

    if (ending) {
      //doe not delete
      console.log("Trying to end second time. If this happens, please notify Oye")
      return;
  }

    setEnding(true);
    if (confirm) {
      showExitConfirmation()
      return;
    }

    dispatch(challengeEndGame({
      token: gameSessionToken,
      chosenOptions,
      consumedBoosts
    }))
      .then(unwrapResult)
      .then(() => {
        setEnding(false);
        navigation.navigate('ChallengeEndGameScreen')

      })
      .catch((rejectedValueOrSerializedError) => {
        setEnding(false);
        console.log(rejectedValueOrSerializedError);
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
            console.log("show exit from exit button")
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

  if (isEnded) {
    return null;
}

  return (
    <ImageBackground source={require('../../../assets/images/game_mode.png')} style={styles.image} resizeMode="cover">
      <ScrollView>
        <PlayGameHeader onPress={() => onEndGame(true)} onPressBoost={() => refRBSheet.current.open()} />
        <GameProgressAndBoosts onComplete={() => onEndGame()} ending={ending} />
        <GameQuestions />
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={400}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            },
            draggableIcon: {
              backgroundColor: "#000",
            },
            container: {
              borderTopStartRadius: 25,
              borderTopEndRadius: 25,
            }
          }}
        >
          <UserAvailableBoosts />
        </RBSheet>
      </ScrollView>
      <NextButton onPress={() => onEndGame()} ending={ending} />
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

const NextButton = ({ onPress, ending }) => {
  const dispatch = useDispatch()
  const isLastQuestion = useSelector(state => state.game.isLastQuestion);

  return (
    // <View >
    <AppButton
      disabled={ending}
      text={isLastQuestion ? 'Finish' : 'Next'}
      onPress={() => dispatch(isLastQuestion ? onPress : nextQuestion())}
      style={styles.nextButton}
    />
    // {/* </View> */}
  )
}

const styles = EStyleSheet.create({

  image: {
    flex: 1,
    backgroundColor: '#9C3DB8',
    paddingHorizontal: normalize(18),
    paddingTop: normalize(15),
    justifyContent: 'flex-end'
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
    justifyContent: 'flex-end'
    // position: 'absolute',
    // bottom: 0,
    // left: 0
  }
});
