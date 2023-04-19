import React, { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, ImageBackground, Platform, StatusBar, Image, Text, View, ScrollView } from "react-native";
import { isTrue } from "../../../utils/stringUtl";
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../../utils/normalize";
import LottieAnimations from "../../../shared/LottieAnimations";
import { useFocusEffect } from "@react-navigation/native";
import AppButton from "../../../shared/AppButton";
import firestore from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics';
import { setChallengeDetails } from "./TriviaChallengeGameSlice";

const ChallengeMatchingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const boosts = useSelector(state => state.common.boosts);
    const documentId = useSelector(state => state.triviaChallenge.documentId);
    const [cancelling, setCancelling] = useState(false);
    const [dataUpdated, setDataUpdated] = useState(false);
    const [challengeInfo, setChallengeInfo] = useState([]);

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
    }

    const proceedWithCancel = () => {
        setCancelling(false);
        navigation.navigate('Home');
    }

    useEffect(() => {

        const subscriber = firestore()
            // .doc('trivia-challenge-requests/n3gJEjoqHdg3wY2h7QK8')
            .doc(documentId)
            .onSnapshot(documentSnapshot => {
                if (!documentSnapshot.exists) {
                    console.log('listening and got updated: ', "no data");
                    return;
                }
                const data = documentSnapshot.data();
                console.log('listening and got updated: ', "got data", documentId, data.status);
                /**
                 * @TODO fix this bug, something keeps reruning this subscription from game in progress screen
                 * when opponent info changes
                 */
                if (data.status === "MATCHED" && data.opponent.status !== "COMPLETED") {
                    analytics().logEvent("trivia_challenge_stake_matched", {
                        'documentId': documentId,
                        'opponentName': data.opponent.username,
                        'username': data.username,
                    })
                    analytics().logEvent("trivia_challenge_stake_start_initiated", {
                        'documentId': documentId,
                        'opponentName': data.opponent.username,
                        'username': data.username,
                    })

                    dispatch(setChallengeDetails(data))
                    setChallengeInfo(data)
                    setDataUpdated(true)
                    setTimeout(() => {
                        console.log("game loading", "navigating after 5 seconds")
                        navigation.navigate('ChallengeGameBoard');
                    }, 5000);
                }
            }, error => {
                console.log('listening and got updated: ', "error", error);
            });


        return () => subscriber();
    }, [documentId]);

    useFocusEffect(
        useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor("transparent");
                return;
            }
            StatusBar.setBarStyle('light-content');
        }, [])
    );
    //disable back button
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {!dataUpdated ?
                <Text style={styles.message}>
                    Finding an opponent...
                </Text>
                :
                <Text style={styles.message}>Nice, you have been matched</Text>
            }

            <View style={styles.animationContainer}>
                <LottieAnimations
                    animationView={require('../../../../assets/hour-glass.json')}
                    width={normalize(180)}
                    height={normalize(180)}
                />
            </View>
            <View style={styles.messageContainer}>
                <SelectedPlayers user={user} challengeDetails={challengeInfo} dataUpdated={dataUpdated} />
            </View>
            <View style={styles.boostInfoContainer}>
                <Text style={styles.boostText}>Score higher by using boosts</Text>
                <View style={styles.boostContainer}>
                    {boosts.map((boost, i) => <BoostCardDetails key={i} boost={boost} />)}
                </View>
            </View>
            {!dataUpdated &&
                <AppButton text="Cancel" onPress={cancelChallenge} disabled={cancelling} style={styles.stakeButton} />
            }

        </ScrollView>
    )
}


const SelectedPlayers = ({ user, dataUpdated, challengeDetails }) => {
    return (
        <>
            <ImageBackground source={require('../../../../assets/images/challenge-stage.png')}
                style={styles.playerImage} imageStyle={{ borderRadius: 20, borderColor: "#FFFF", borderWidth: 1 }} resizeMode="cover">
                <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

                <Image
                    source={require('../../../../assets/images/versus.png')}
                />
                {dataUpdated ?
                    <SelectedPlayer playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                    :
                    <SelectedPlayer playerName="...." playerAvatar={require("../../../../assets/images/question.png")} />
                }
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

const BoostCardDetails = ({ boost }) => {
    return (
        <View style={styles.boostDetailsHead}>
            <Image
                source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                style={styles.boostIcon}
            />
            <View style={styles.boostDetailsContainer}>
                <View style={styles.boostNameCount}>
                    <Text style={styles.storeItemName}>{boost.name}</Text>
                    <Text style={styles.storeItemDescription}>{boost.description}</Text>
                </View>
            </View>
        </View>
    )
}

export default ChallengeMatchingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        backgroundColor: '#301934',
    },
    content: {
        justifyContent: 'center',
        flex: 1,
    },
    animationContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    playerImage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(30),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: '2rem',
    },
    avatarBackground: {
        alignItems: 'center'
    },
    avatar: {
        width: normalize(55),
        height: normalize(55),
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
    },
    boostText: {
        fontSize: '.75rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        textAlign: 'center',
        lineHeight: '1.2rem'
    },
    boostIcon: {
        marginBottom: normalize(5),
        width: responsiveScreenHeight(4),
        height: responsiveScreenHeight(4),
    },
    boostContainer: {
        flexDirection: 'row',
        // alignItems: 'flex-start',
        // justifyContent: 'center',

    },
    boostInfoContainer: {
        // paddingHorizontal:'2rem'

    },
    boostDetailsHead: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '1rem',
        marginHorizontal: '1rem'
    },
    boostDetailsContainer: {
        flexDirection: 'column',
    },
    boostNameCount: {
        alignItems: 'center',
    },
    storeItemName: {
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
        color: '#FFF',
        marginVertical: '.3rem'
    },
    storeItemDescription: {
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
        color: '#FFF',
        width: '8rem',
        textAlign: 'center',
        lineHeight: '1.2rem'
    },
    cardDescription: {
        fontFamily: 'graphik-medium',
        fontSize: '0.73rem',
        color: '#828282',
        lineHeight: responsiveScreenHeight(2.5),
        width: responsiveScreenWidth(38),
        textAlign: 'center'
    },
})