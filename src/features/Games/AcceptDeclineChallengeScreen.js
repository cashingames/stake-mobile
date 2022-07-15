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
import { unwrapResult } from "@reduxjs/toolkit";

const AcceptDeclineChallengeScreen = ({ navigation }) => {
	useApplyHeaderWorkaround(navigation.setOptions);

	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true)
	const challengeDetails = useSelector(state => state.game.challengeDetails);

	const acceptChallengeInivite = () => {
		dispatch(acceptDeclineChallengeInivite({
			challenge_id: challengeDetails.challenegeId,
			status: 1
		}
		))
		navigation.navigate('GameInstructions')
	}

	const declineChallengeInivite = () => {
		dispatch(acceptDeclineChallengeInivite({
			challenge_id: challengeDetails.challenegeId,
			status: 0
		}
		))
		navigation.navigate('Home')
	}

	useEffect(() => {
		dispatch(getChallengeDetails(12)).then(() => setLoading(false));
		console.log('fetched')
	}, []);

	if (loading) {
		return <PageLoading spinnerColor="#0000ff" />
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.requestHeader}>You have been invited to a challenge</Text>
			<SelectedPlayers challengeDetails={challengeDetails} />
			<View style={styles.buttonContainer}>
				<AppButton text="Accept" style={styles.acceptButton} onPress={acceptChallengeInivite} />
				<AppButton text="Decline" style={styles.declineButton} onPress={declineChallengeInivite} />
			</View>
		</ScrollView>

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
})