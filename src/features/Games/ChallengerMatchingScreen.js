import React, { useEffect, useState } from "react";
import { Alert, ImageBackground, Platform } from "react-native";
import { Image } from "react-native";
import { Text, View } from "react-native";
import { isTrue } from "../../utils/stringUtl";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import LottieAnimations from "../../shared/LottieAnimations";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AppButton from "../../shared/AppButton";
import firestore from '@react-native-firebase/firestore';
import { setChallengeDetails, setOpponentDetails, setQuestions } from "./TriviaChallengeStaking/TriviaChallengeGameSlice";

const ChallengerMatchingScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    const user = useSelector(state => state.auth.user);
    const [cancelling, setCancelling] = useState(false);
    const documentId = useSelector(state => state.triviaChallenge.documentId);
    const dispatch = useDispatch();

    const cancelChallenge = () => {
        setCancelling(true);
        Alert.alert(
            "Challenge Notification",
            `Are you sure you want to cancel this challenge?`,
            [
                {
                    text: "Dismiss",
                    onPress: () => abortCancel(),
                    style: "cancel"
                },
                { text: "Yes, cancel", onPress: () => proceedWithCancel() }
            ]
        );

    }
    const abortCancel = () => {
        setCancelling(false);
        console.log("Cancel Pressed");
        // setMatched(true)
    }

    const proceedWithCancel = () => {
        setCancelling(false);
        navigation.navigate('Home');
    }

    useEffect(() => {

        const subscriber = firestore()
            .doc('trivia-challenge-requests/zKjRo8xHZ2iCEpKD4njn')
            // .doc(documentId)
            .onSnapshot(documentSnapshot => {
                // console.log('User data: ', documentSnapshot.data());
                if (documentSnapshot.data().status === "MATCHED") {
                    const questions = documentSnapshot.data().questions;
                    const challengeDetails = documentSnapshot.data()
                    // dispatch(setQuestions(questions));
                    dispatch(setChallengeDetails(challengeDetails))
                    navigation.navigate('ChallengeGameLoading')
                }
            });

 
        return () => subscriber();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor("transparent");
                return;
            }
            StatusBar.setBarStyle('light-content');
            return () => {
                if (Platform.OS === "android") {
                    StatusBar.setTranslucent(true)
                    return;
                }
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                Finding an opponent...
            </Text>
            <View style={styles.animationContainer}>
                <LottieAnimations
                    animationView={require('../../../assets/hour-glass.json')}
                    width={normalize(200)}
                    height={normalize(200)}
                />
            </View>
            <View style={styles.messageContainer}>
                {/* <Text style={styles.message}>
                    Hey,
                </Text> */}
                {/* <Text style={styles.message}>
                    Finding an opponent...
                </Text> */}
                {/* <Text style={styles.matchingText}>
                    Matching.....
                </Text> */}
                <SelectedPlayers user={user} />
            </View>
            <AppButton text="Cancel" onPress={cancelChallenge} disabled={cancelling} style={styles.stakeButton} />

        </View>
    )
}


const SelectedPlayers = ({ user }) => {
    return (
        <>
            <ImageBackground source={require('../../../assets/images/challenge-stage.png')}
                style={styles.playerImage} imageStyle={{ borderRadius: 20, borderColor: "#FFFF", borderWidth: 1 }} resizeMode="cover">
                <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")} />

                <Image
                    source={require('../../../assets/images/versus.png')}
                />
                <SelectedPlayer playerName="...." playerAvatar={require("../../../assets/images/question.png")} />
            </ImageBackground>
        </>
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

export default ChallengerMatchingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        // paddingTop: normalize(40),
        backgroundColor: '#301934',
        justifyContent: 'center',
    },
    animationContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    playerImage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: '2rem',
    },
    avatarBackground: {
        alignItems: 'center'
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
        textAlign: 'center',
        marginTop: '.8rem'
    },
    message: {
        fontSize: '1rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        textAlign: 'center',
        marginVertical: normalize(4),
        lineHeight: '2rem'
    },
    matchingText: {
        fontSize: '.8rem',
        fontFamily: 'graphik-italic',
        color: '#FFFF',
        textAlign: 'center',
        marginBottom: normalize(4),
        lineHeight: '2rem'
    }
})