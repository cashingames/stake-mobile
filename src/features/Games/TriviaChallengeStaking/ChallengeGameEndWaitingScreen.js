import React, { useEffect } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import LottieAnimations from "../../../shared/LottieAnimations";
import normalize, { responsiveScreenWidth } from "../../../utils/normalize";
import { isTrue } from "../../../utils/stringUtl";
import Constants from 'expo-constants';


const ChallengeGameEndWaitingScreen = ({navigation}) => {
    const user = useSelector(state => state.auth.user);
    const challengeDetails = useSelector(state => state.triviaChallenge.challengeDetails);
    const opponentStatus = challengeDetails.opponent.status;
    const opponentDetails = challengeDetails.opponent.status;

    useEffect(() => {
        if (opponentStatus === 'COMPLETED') {
            navigation.navigate('ChallengeEndGame');
        }
    }, [opponentStatus])

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Weldone, you finshed first</Text>
            <View style={styles.animationContainer}>
                <LottieAnimations
                    animationView={require('../../../../assets/hour-glass.json')}
                    width={normalize(200)}
                    height={normalize(200)}
                />
            </View>
            <SelectedPlayers user={user} opponentDetails={opponentDetails} />
            <Text style={styles.message}>Wait for both scores to be calculated</Text>
            <Text style={styles.matchingText}>Calculating....</Text>
        </View>
    )
}

const SelectedPlayers = ({ user, opponentDetails }) => {
    return (
        <>
            <ImageBackground source={require('../../../../assets/images/challenge-stage.png')}
                style={styles.playerImage} imageStyle={{ borderRadius: 20, borderColor: "#FFFF", borderWidth: 1 }} resizeMode="cover">
                <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

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
export default ChallengeGameEndWaitingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        backgroundColor: '#9C3DB8',
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
})