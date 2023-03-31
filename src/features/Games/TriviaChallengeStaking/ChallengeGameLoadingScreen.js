import React, { useCallback } from "react";
import { ImageBackground, Text, View, Image, Platform, StatusBar, BackHandler } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from "react-redux";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../../utils/normalize";
import { isTrue } from "../../../utils/stringUtl";
import Constants from 'expo-constants';
import LottieAnimations from "../../../shared/LottieAnimations";
import { useFocusEffect } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';

const ChallengeGameLoadingScreen = ({ navigation }) => {

    const user = useSelector(state => state.auth.user);
    const boosts = useSelector(state => state.common.boosts);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const opponentDetails = challengeDetails.opponent
    const documentId = useSelector(state => state.triviaChallenge.documentId);

    setTimeout(() => {
        navigation.navigate('ChallengeGameBoard');
    }, 5000);

    firestore()
        // .doc('trivia-challenge-requests/n3gJEjoqHdg3wY2h7QK8')
        .doc(documentId)
        .update({
            status: "ONGOING",
        })
        .then(() => {
            console.log('status updated!');
        });


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
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                <LottieAnimations
                    animationView={require('../../../../assets/loading-circle.json')}
                    width={normalize(130)}
                    height={normalize(130)}
                />
            </View>
            <View style={styles.messageContainer}>
                <Text style={styles.message}>Nice, you have been matched</Text>
                <Text style={styles.matchingText}>Game board loading....</Text>
                <SelectedPlayers user={user} opponentDetails={opponentDetails} />
            </View>
            <View>
                <Text style={styles.boostText}>Do you know that you can score higher by using boosts?</Text>
                <View style={styles.boostContainer}>
                    {boosts.map((boost, i) => <BoostCardDetails key={i} boost={boost} />)}
                </View>
                <Text style={styles.matchingText}>Boost are available in the store</Text>
            </View>
        </View>
    )
}

const SelectedPlayers = ({ user, opponentDetails }) => {
    return (
        <>
            <ImageBackground source={require('../../../../assets/images/challenge-stage.png')}
                style={styles.playerImage} imageStyle={{ borderRadius: 20, borderColor: "#FFFF", borderWidth: 1 }} resizeMode="cover">
                <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

                <Image
                    source={require('../../../../assets/images/versus.png')}
                />
                <SelectedPlayer playerName={opponentDetails.username} playerAvatar={require("../../../../assets/images/user-icon.png")} />
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
                    <Text style={styles.cardDescription}>{boost.description}</Text>
                </View>
            </View>
        </View>
    )
}
export default ChallengeGameLoadingScreen;

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
    },
    boostText: {
        fontSize: '.85rem',
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
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    boostDetailsHead: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '1rem'
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
        color: '#EF2F55',
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
