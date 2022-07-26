import React, { useEffect, useState } from "react";
import { View, Text, Image, StatusBar, ScrollView } from "react-native";
import AppButton from "../../shared/AppButton";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { ImageBackground } from "react-native";
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { acceptDeclineChallengeInivite, getChallengeDetails } from "./GameSlice";
import { useSelector, useDispatch } from 'react-redux';
import PageLoading from "../../shared/PageLoading";
import { isTrue } from "../../utils/stringUtl";
import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from "@reduxjs/toolkit";
import LottieAnimations from "../../shared/LottieAnimations";

const AcceptDeclineChallengeScreen = ({ navigation, route }) => {
  useApplyHeaderWorkaround(navigation.setOptions);
  const { challengeId } = route.params
  console.log(route.params)
  console.log('log challegeid', challengeId)

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const user = useSelector(state => state.auth.user);

  const challengeDetails = useSelector(state => state.game.challengeDetails);
  console.log(JSON.stringify(challengeDetails))

  const acceptChallengeInivite = () => {
    dispatch(acceptDeclineChallengeInivite({
      challenge_id: challengeDetails.challenegeId,
      opponentId: user.id,
      status: 1
    }
    ))
    navigation.navigate('GameInstructions')
  }

  const declineChallengeInivite = () => {
    dispatch(acceptDeclineChallengeInivite({
      challenge_id: challengeDetails.challenegeId,
      opponentId: user.id,
      status: 0
    }
    ))
    navigation.navigate('AppRouter')
  }


  useEffect(() => {
    dispatch(getChallengeDetails(challengeId)).then(() => setLoading(false)
    );
    console.log('fetched')
  }, []);



  if (loading) {
    return <PageLoading spinnerColor="#0000ff" />
  }

  return (
    <>
      {challengeDetails.status === "PENDING" || null ?
        <ScrollView style={styles.container}>
          <Text style={styles.requestHeader}>You have been invited to a challenge</Text>
          <SelectedPlayers challengeDetails={challengeDetails} />
          <View style={styles.buttonContainer}>
            <AppButton text="Accept" style={styles.acceptButton} onPress={acceptChallengeInivite} />
            <AppButton text="Decline" style={styles.declineButton} onPress={declineChallengeInivite} />
          </View>
        </ScrollView>
        :
        <ChallengeNotPending challenge={challengeDetails} />
      }
    </>

  )
}

const SelectedPlayers = ({ challengeDetails }) => {
  return (
    <>
      <ImageBackground source={require('../../../assets/images/player_stage.png')} style={styles.playerImage} resizeMode="cover">
        <SelectedPlayer playerName={challengeDetails.playerUsername} playerAvatar={isTrue(challengeDetails.playerAvatar) ? { uri: challengeDetails.playerAvatar } : require("../../../assets/images/user-icon.png")} />
        <Image
          source={require('../../../assets/images/versus.png')}
        />
        <SelectedPlayer playerName={challengeDetails.opponentUsername} playerAvatar={isTrue(challengeDetails.opponentAvatar) ? { uri: challengeDetails.opponentAvatar } : require("../../../assets/images/user-icon.png")} />
      </ImageBackground></>
  )
}

const SelectedPlayer = ({ playerName, playerAvatar }) => {
  return (
    <View style={styles.avatarBackground}>
      <Image
        source={playerAvatar}
        style={styles.avatar}
      />
      <Text style={styles.username}>@{playerName}</Text>
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
      {challenge.status === 'ACCEPTED' &&
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
      {challenge.status === 'DECLINED' &&
        <>
          <View style={styles.animation}>
            <Image
              source={require('../../../assets/images/sad-face-emoji.png')}
              style={styles.emoji}
            />
          </View>
          <Text style={styles.message}>Sorry, this challenge has been declined,
            go to dashboard to challenge other players
          </Text>
          <AppButton text='Dashboard' onPress={goHome} />

        </>
      }
    </View>
  )
}

export default AcceptDeclineChallengeScreen;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#072169',
    paddingHorizontal: normalize(22),
    paddingTop: normalize(25)
  },
  avatarBackground: {
    alignItems: 'center'
  },
  imageHeader: {
    alignItems: 'center'
  },
  playerImage: {
    marginVertical: '6rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(40),
    paddingHorizontal: normalize(20),
    alignItems: 'center',
    borderRadius: 20,
  },
  image: {
    width: normalize(250),
    height: normalize(130),
  },
  requestHeader: {
    fontSize: '1.5rem',
    color: '#FFFF',
    fontFamily: 'graphik-medium',
    textAlign: 'center',
    lineHeight: '2rem'
  },
  acceptText: {
    fontSize: '0.8rem',
    color: '#FFFF',
    fontFamily: 'graphik-regular',
    textAlign: 'center',
    lineHeight: '1.5rem',
    marginVertical: normalize(8)
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    paddingHorizontal: responsiveScreenWidth(13),
    backgroundColor: '#EF2F55'
  },
  declineButton: {
    paddingHorizontal: responsiveScreenWidth(13),
    backgroundColor: '#072169',
    borderColor: '#FFFF',
    borderWidth: 1
  },
  avatar: {
    width: normalize(65),
    height: normalize(65),
    backgroundColor: '#FFFF',
    borderRadius: 50,
  },
  username: {
    fontSize: '0.75rem',
    fontFamily: 'graphik-regular',
    color: '#FFFF',
    width: responsiveScreenWidth(25),
    textAlign: 'center'
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
})