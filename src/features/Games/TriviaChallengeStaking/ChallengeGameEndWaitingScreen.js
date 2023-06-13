import React, { useCallback, useEffect } from "react";
import { BackHandler, Image, ImageBackground, Platform, StatusBar, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import LottieAnimations from "../../../shared/LottieAnimations";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import { isTrue } from "../../../utils/stringUtl";
import Constants from 'expo-constants';
import { useFocusEffect } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import { setChallengeDetails } from "./TriviaChallengeGameSlice";


const ChallengeGameEndWaitingScreen = ({ navigation }) => {
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const documentId = useSelector(state => state.triviaChallenge.documentId);

    const dispatch = useDispatch();

    useEffect(() => {

        if (!documentId)
            return;

        const subscriber = firestore()
            .doc(documentId)
            .onSnapshot(documentSnapshot => {
                const data = documentSnapshot.data();
                if (data.opponent.status === "COMPLETED") {
                    dispatch(setChallengeDetails(data))
                    navigation.navigate('ChallengeEndGame')
                }
            });


        return () => {
            subscriber();
        };
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
        <ImageBackground source={require('../../../../assets/images/coins-background.png')} style={{ flex: 1 }}>

            <View style={styles.container}>
                <Text style={styles.message}>Great, you finished first</Text>
                <View style={styles.animationContainer}>
                    <LottieAnimations
                        animationView={require('../../../../assets/hour-glass.json')}
                        width={normalize(200)}
                        height={normalize(200)}
                    />
                </View>
                <SelectedPlayers challengeDetails={challengeDetails} />
                <Text style={styles.message}>Waiting for your opponent to finish</Text>
                <Text style={styles.matchingText}>Loading....</Text>
            </View>
        </ImageBackground>
    )
}

const SelectedPlayers = ({ challengeDetails }) => {
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.avatar}` } : require("../../../../assets/images/user-icon.png")} />

            <Image
                source={require('../../../../assets/images/versus.png')}
            />
            <SelectedPlayer playerName={challengeDetails.opponent.username} playerAvatar={isTrue(challengeDetails.opponent.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${challengeDetails.opponent.avatar}` } : require("../../../../assets/images/user-icon.png")} />
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
export default ChallengeGameEndWaitingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        // backgroundColor: '#9C3DB8',
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
        fontFamily: 'gotham-bold',
        color: '#072169',
        textAlign: 'center',
        marginBottom: normalize(4),
        lineHeight: '2rem'
    },
})