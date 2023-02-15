import React, { useRef, useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, BackHandler, StatusBar, Platform } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import GameEndClockAnimation from '../../shared/GameEndClockAnimation';
import UserName from '../../shared/UserName';
import NoGame from '../../shared/NoGame';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import { getUser } from '../Auth/AuthSlice';
import analytics from '@react-native-firebase/analytics';
import StakeWinnings from '../../shared/StakeWinnings';
import Boostspopup from '../../shared/BoostPopUp';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function GameEndResultScreen({ navigation }) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const pointsGained = useSelector(state => state.game.pointsGained);
	const amountWon = useSelector(state => state.game.amountWon);
	const withStaking = useSelector(state => state.game.withStaking);
	const minimumBoostScore = useSelector(state => state.common.minimumBoostScore)
	const isGameEnded = useSelector(state => state.game.isEnded);
	const [loading, setLoading] = useState(false);
	const [showText, setShowText] = useState(true);
	const [lastRunDate, setLastRunDate] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const activePlan = useSelector(state => state.auth.user.activePlans);
	const bonusGame = activePlan?.find((item) => item.name === 'Bonus Games')
	const newUser = useSelector(state => state.auth.user.joinedOn);
	const newUserDate = newUser.slice(0, 10);
	let formattedDate = new Date().toISOString().split('T')[0];

	const logFreeGamesExhausted = () => {
		const currentDate = new Date().toLocaleDateString();
		if (lastRunDate !== currentDate) {
			if (formattedDate === newUserDate && bonusGame && bonusGame.game_count === 0) {
				analytics().logEvent('new_user_FG_exhausted', {
					'id': user.username,
					'phone_number': user.phoneNumber,
					'email': user.email
				});
			}
			if(formattedDate !== newUserDate && bonusGame && bonusGame.game_count === 0) {
				analytics().logEvent('free_game_exhausted', {
					'id': user.username,
					'phone_number': user.phoneNumber,
					'email': user.email
				});
			}
			setLastRunDate(currentDate);
		}
	};

	const refRBSheet = useRef();

	const openBottomSheet = () => {
		refRBSheet.current.open()
	}

	const closeBottomSheet = () => {
		refRBSheet.current.close()
	}

	const onPlayButtonClick = async () => {
		setLoading(true);
		analytics().logEvent('exhibition_play_again_clicked', {
			'id': user.username,
			'phone_number': user.phoneNumber,
			'email': user.email
		});
		if (bonusGame && bonusGame.game_count === 2) {
			analytics().logEvent('two_free_games_left', {
				'id': user.username,
				'phone_number': user.phoneNumber,
				'email': user.email
			});
		};
		logFreeGamesExhausted()
		navigation.navigate("GameInstructions")
		setLoading(false);

	}

	const onHomeButtonClick = async () => {
		if (bonusGame && bonusGame.game_count === 2) {
			analytics().logEvent('two_free_games_left', {
				'id': user.username,
				'phone_number': user.phoneNumber,
				'email': user.email
			});
		};
		logFreeGamesExhausted()
		navigation.navigate('Home', { showStakingAdvert: !withStaking })
	}
	useFocusEffect(
		React.useCallback(() => {
			dispatch(getUser())
		}, [])
	)

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
	const reviewStaking = () => {
		analytics().logEvent('review_staking', {
			'id': user.username,
			'phone_number': user.phoneNumber,
			'email': user.email
		})
		navigation.navigate("ReviewStake")
	}

	useEffect(() => {
		// Change the state every second or the time given by User.
		const interval = setInterval(() => {
			setShowText((showText) => !showText);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (pointsGained <= minimumBoostScore) {
			setModalVisible(true)
		} else {
			setModalVisible(false)
		}
	}, [pointsGained])

	return (

		<ScrollView style={styles.container}>
			<GameEndClockAnimation />
			<UserName userName={user.firstName} />
			<UserResultInfo pointsGained={pointsGained} />
			{withStaking &&
				<Winnings showText={showText} amountWon={amountWon} onPress={reviewStaking} />
			}
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
			<Boostspopup modalVisible={modalVisible} setModalVisible={setModalVisible} />
			<UniversalBottomSheet
				refBottomSheet={refRBSheet}
				height={Platform.OS === 'ios' ? 400 : 350}
				subComponent={<NoGame onClose={closeBottomSheet} />}
			/>
		</ScrollView>

	);
}


const UserResultInfo = ({ pointsGained }) => {
	return (
		<View style={styles.infoContainer}>
			<Text style={styles.info}>you scored {pointsGained} points, Play more games to climb up the leaderboard and stand a chance to earn cash prizes every week!</Text>
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

const Winnings = ({ showText, amountWon, onPress }) => {
	return (
		<View style={styles.winningsContainer}>
			<StakeWinnings showText={showText} amountWon={amountWon} />
			<Pressable onPress={onPress}>
				<Text style={styles.reviewStake}>Review Stake</Text>
			</Pressable>
		</View>
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
		marginBottom: responsiveScreenWidth(5)
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
		marginBottom: responsiveScreenWidth(12),
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
		marginBottom: normalize(50),
	},
	buttonText: {
		textAlign: 'center',
		color: '#FFFF',
		fontFamily: 'graphik-medium',
		fontSize: '0.72rem',
	},
	winningsContainer: {
		alignItems: 'center',
		backgroundColor: '#FFFF',
		paddingVertical: normalize(10),
		marginBottom: normalize(20),
		borderRadius: 13,
	},
	reviewStake: {
		textAlign: 'center',
		color: '#EF2F55',
		fontFamily: 'graphik-regular',
		fontSize: '.8rem',
		textDecorationLine: 'underline',
		// lineHeight: '1.5rem'
	},

});
