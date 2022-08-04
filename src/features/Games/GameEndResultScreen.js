import React, { useRef, useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, Alert, BackHandler, StatusBar } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { incrementCountdownResetIndex, startGame } from './GameSlice';
import EStyleSheet from 'react-native-extended-stylesheet';
import NoGameNotification from '../../shared/NoGameNotification';
import GameEndClockAnimation from '../../shared/GameEndClockAnimation';
import UserName from '../../shared/UserName';
import { logActionToServer } from '../CommonSlice';

export default function GameEndResultScreen({ navigation }) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const pointsGained = useSelector(state => state.game.pointsGained);
	const gameCategoryId = useSelector(state => state.game.gameCategory.id);
	const gameTypeId = useSelector(state => state.game.gameType.id);
	const gameModeId = useSelector(state => state.game.gameMode.id);
	const hasActivePlan = useSelector(state => state.auth.user.hasActivePlan);
	const isGameEnded = useSelector(state => state.game.isEnded);
	const [loading, setLoading] = useState(false);
	const refRBSheet = useRef();

	const openBottomSheet = () => {
		refRBSheet.current.open()
	}

	const closeBottomSheet = () => {
		refRBSheet.current.close()
	}

	const onPlayButtonClick = () => {

		if (!hasActivePlan) {
			openBottomSheet();
			return;
		}

		setLoading(true);

		dispatch(startGame({
			category: gameCategoryId,
			type: gameTypeId,
			mode: gameModeId
		}))
			.then(unwrapResult)
			.then(result => {
				dispatch(logActionToServer({
					message: "Game session " + result.data.game.token + " questions recieved for " + user.username,
					data: result.data.questions
				}))
					.then(unwrapResult)
					.then(result => {
						console.log('Action logged to server');
					})
					.catch(() => {
						console.log('failed to log to server');
					});
				setLoading(false);
				dispatch(incrementCountdownResetIndex());
				navigation.navigate("GameInProgress")
			})
			.catch((err) => {
				Alert.alert(err.data.message)
				setLoading(false);
			});
	}

	const onHomeButtonClick = () => {
		navigation.navigate('Home')
	}

	useFocusEffect(
		React.useCallback(() => {
			const onBackPress = () => isGameEnded
			BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () =>
				BackHandler.removeEventListener('hardwareBackPress', onBackPress);
		}, [isGameEnded])
	);

	useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

	return (

		<ScrollView style={styles.container}>
			<GameEndClockAnimation />
			<UserName userName={user.firstName} />
			<UserResultInfo pointsGained={pointsGained} />
			<SeeRank />
			<FinalScore pointsGained={pointsGained} />
			<View style={styles.gameButtons}>
				<GameButton buttonText='Return to Home'
					onPress={onHomeButtonClick}
				/>
				<GameButton buttonText={loading ? 'loading...' : 'Play Again'}
					onPress={onPlayButtonClick}
					disabled={loading}
				/>

			</View>
			<NoGameNotification
				refBottomSheet={refRBSheet}
				onClose={closeBottomSheet}
			/>
		</ScrollView>

	);
}


const UserResultInfo = ({ pointsGained }) => {
	return (
		<View style={styles.infoContainer}>
			<Text style={styles.info}>you scored {pointsGained} points, Play again to climb up the leaderboard</Text>
		</View>
	)
}

const SeeRank = () => {
	const navigation = useNavigation();

	return (
		<Pressable
			onPress={() => navigation.navigate('Leaderboard')}
			style={styles.goToLeaderboard}
		>
			<View style={styles.seeRank}>
				<Image
					source={require('../../../assets/images/leaderboard.png')}
				/>
				<Text style={styles.seeRankText}>Check the leaderboard to see your rank</Text>
			</View>
		</Pressable>

	)
}

const FinalScore = ({ pointsGained }) => {
	return (
		<View style={styles.finalScore}>
			<Text style={styles.finalScoreText}>Your final score point is</Text>
			<Text style={styles.point}>{pointsGained}</Text>
		</View>
	)
}

const GameButton = ({ buttonText, onPress, disabled }) => {
	return (
		<Pressable onPress={onPress} style={[styles.gameButton, disabled ? styles.gameButtonDisabled : {}]} >
			<Text style={styles.buttonText}>{buttonText}</Text>
		</Pressable>
	)
}


const styles = EStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#9C3DB8',
		paddingVertical: normalize(40),
		paddingHorizontal: normalize(18),
		display: 'flex',
	},
	image: {
		flex: 1,
	},
	emojiContainer: {
		alignItems: 'center',
	},
	emoji: {
		width: normalize(66),
		height: normalize(70)
	},
	infoContainer: {
		alignItems: 'center',
		textAlign: 'center',
		marginHorizontal: normalize(25),
		marginBottom: responsiveScreenWidth(10)
	},
	info: {
		textAlign: 'center',
		color: '#FFFF',
		fontFamily: 'graphik-regular',
		fontSize: '1rem',
		lineHeight: '1.5rem'
	},
	seeRank: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	seeRankText: {
		color: '#FFFF',
		fontFamily: 'graphik-medium',
		fontSize: '0.7rem',
	},
	goToLeaderboard: {
		backgroundColor: '#701F88',
		borderRadius: 8,
		padding: normalize(15),
		marginBottom: normalize(15)
	},
	finalScore: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#F9E821',
		borderRadius: 16,
		marginBottom: responsiveScreenWidth(23),
		padding: Platform.OS === 'ios' ? normalize(15) : normalize(10),
	},
	finalScoreText: {
		color: '#9236AD',
		fontFamily: 'graphik-medium',
		fontSize: '0.75rem',
	},
	point: {
		color: '#9236AD',
		fontFamily: 'graphik-bold',
		fontSize: '4rem',
	},
	gameButton: {
		borderColor: '#FFFF',
		borderWidth: 1,
		width: responsiveScreenWidth(35),
		height: responsiveScreenHeight(6.5),
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
	},
	gameButtonDisabled: {
		backgroundColor: '#DFCBCF'
	},
	gameButtons: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: normalize(50)
	},
	buttonText: {
		textAlign: 'center',
		color: '#FFFF',
		fontFamily: 'graphik-medium',
		fontSize: '0.72rem',
	},

});
