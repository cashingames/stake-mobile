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
import { setChallengeDetails } from "./TriviaChallengeGameSlice";
import logToAnalytics from "../../../utils/analytics";

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
                    logToAnalytics("trivia_challenge_stake_matched", {
                        'documentId': documentId,
                        'opponentName': data.opponent.username,
                        'username': data.username,
                    })
                    logToAnalytics("trivia_challenge_stake_start_initiated", {
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
                    }, 10000);
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
        <ImageBackground source={require('../../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {!dataUpdated ?
                    <View style={styles.findingContainer}>
                        <Text style={styles.message}>
                            Finding a player...
                        </Text>
                        <View style={styles.animationContainer}>

                            <Image
                                source={require('../../../../assets/images/finding-bar.png')}
                                style={styles.barAvatar}
                            />
                        </View>

                    </View>
                    :
                    <Text style={styles.message}>Nice, you have been matched</Text>
                }
                <View style={styles.boostInfoContainer}>
                    <Text style={styles.boostText}>Score high points using boosts</Text>
                    <View style={styles.boostContainer}>
                        {boosts.map((boost, i) => <BoostCardDetails key={i} boost={boost} />)}
                    </View>
                </View>
                <View style={styles.messageContainer}>
                    <SelectedPlayers user={user} challengeDetails={challengeInfo} dataUpdated={dataUpdated} />
                </View>

                {!dataUpdated &&
                    <AppButton text="Cancel" onPress={cancelChallenge} disabled={cancelling} style={styles.stakeButton} />
                }

            </ScrollView>
        </ImageBackground>
    )
}


const SelectedPlayers = ({ user, dataUpdated, challengeDetails }) => {
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

            <Image
                source={require('../../../../assets/images/versus.png')}
            />
            {dataUpdated ?
                <SelectedPlayer playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
                :
                <SelectedPlayer playerName="...." playerAvatar={require("../../../../assets/images/question.png")} />
            }
        </View>
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
                    {/* <Text style={styles.storeItemName}>{boost.name}</Text> */}
                    <Text style={styles.boostDescription}>{boost.description}</Text>
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
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 13,
        marginBottom: '1rem',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        backgroundColor: '#fff'
    },
    avatarBackground: {
        alignItems: 'center'
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#F6F4FF',
        borderRadius: 50,
    },
    username: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginTop: '.8rem'
    },
    message: {
        fontSize: '1rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
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
        fontSize: '.85rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
        textAlign: 'center',
        lineHeight: '1.2rem'
    },
    boostIcon: {
        marginBottom: normalize(5),
        width: responsiveScreenHeight(6),
        height: responsiveScreenHeight(6),
    },
    boostContainer: {
        flexDirection: 'row',
        // alignItems: 'flex-start',
        // justifyContent: 'center',

    },
    boostInfoContainer: {
        backgroundColor: '#FFF',
        marginVertical: normalize(15),
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(18),
        borderRadius: 13,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
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
    boostDescription: {
        fontFamily: 'gotham-medium',
        fontSize: '0.7rem',
        color: '#072169',
        width: '8rem',
        textAlign: 'center',
        lineHeight: '1.2rem'

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